// src/app/actions/account.ts
"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Profile, CareRecipient, FitProfile, AgencySettings, EmailPreferences, AccountType } from "@/lib/types/account";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createServiceClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return null;

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const patch: Record<string, unknown> = { ...updates };

  // Keep caregiver_mode in sync for backward compatibility
  if (updates.account_type !== undefined) {
    patch.caregiver_mode = updates.account_type !== "individual";
  }

  const { error } = await admin
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCareRecipients(
  recipients: CareRecipient[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const { error } = await admin
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  // Sign user out immediately after marking deleted
  await supabase.auth.signOut();
  return { success: true };
}
