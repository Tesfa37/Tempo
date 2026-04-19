"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import type {
  Profile,
  CareRecipient,
  FitProfile,
  AgencySettings,
  EmailPreferences,
  AccountType,
} from "@/lib/types/account";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Use session-bearing client for SELECT - no elevated privileges needed
  const { data } = await supabase
    .from("profiles")
    .select("id,email,display_name,tier,points,caregiver_mode,public_leaderboard,account_type,care_recipients,fit_profile,agency_settings,email_preferences,deleted_at,created_at")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  // Return null for soft-deleted accounts (caller treats as unauthenticated)
  if (data.deleted_at) return null;

  return {
    id: data.id,
    email: data.email ?? null,
    display_name: data.display_name ?? null,
    tier: data.tier ?? "Advocate",
    points: data.points ?? 0,
    caregiver_mode: data.caregiver_mode ?? false,
    public_leaderboard: data.public_leaderboard ?? false,
    account_type: (data.account_type as AccountType) ?? "individual",
    care_recipients: (data.care_recipients as CareRecipient[]) ?? [],
    fit_profile: data.fit_profile ?? null,
    agency_settings: data.agency_settings ?? null,
    email_preferences: data.email_preferences ?? {
      marketing: true,
      order_updates: true,
      point_alerts: true,
    },
    deleted_at: data.deleted_at ?? null,
    created_at: data.created_at,
  };
}

export async function updateProfile(updates: {
  display_name?: string;
  account_type?: AccountType;
  fit_profile?: FitProfile | null;
  agency_settings?: AgencySettings | null;
  email_preferences?: EmailPreferences;
  public_leaderboard?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  if (updates.display_name !== undefined && updates.display_name.length > 100) {
    return { success: false, error: "Display name must be 100 characters or fewer" };
  }

  // Explicit allowlist - prevents arbitrary column injection via service client
  const patch: Record<string, unknown> = {};
  if (updates.display_name     !== undefined) patch.display_name     = updates.display_name;
  if (updates.account_type     !== undefined) patch.account_type     = updates.account_type;
  if (updates.fit_profile      !== undefined) patch.fit_profile      = updates.fit_profile;
  if (updates.agency_settings  !== undefined) patch.agency_settings  = updates.agency_settings;
  if (updates.email_preferences !== undefined) patch.email_preferences = updates.email_preferences;
  if (updates.public_leaderboard !== undefined) patch.public_leaderboard = updates.public_leaderboard;
  // Keep caregiver_mode in sync - see Profile.caregiver_mode invariant note
  if (updates.account_type !== undefined) {
    patch.caregiver_mode = updates.account_type !== "individual";
  }

  const admin = createServiceClient();
  const { error } = await admin.from("profiles").update(patch).eq("id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCareRecipients(
  recipients: CareRecipient[]
): Promise<{ success: boolean; error?: string }> {
  if (recipients.length > 50) {
    return { success: false, error: "Maximum 50 care recipients allowed" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const { error } = await admin
    .from("profiles")
    .update({ care_recipients: recipients })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function softDeleteAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const deletedAt = new Date().toISOString();

  const { error } = await admin
    .from("profiles")
    .update({ deleted_at: deletedAt })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    // Rollback - un-delete so the user can retry
    await admin.from("profiles").update({ deleted_at: null }).eq("id", user.id);
    return { success: false, error: signOutError.message };
  }

  return { success: true };
}
