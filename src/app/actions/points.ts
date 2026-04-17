"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  calcTier,
  type PointsEventType,
  type TierName,
  type PointsBalance,
  type GuestEvent,
} from "@/lib/points-catalog";

export interface AwardResult {
  success: boolean;
  newTotal?: number;
  tier?: TierName;
  tierChanged?: boolean;
  skipped?: boolean;
  error?: string;
}

export async function awardPoints(
  eventType: PointsEventType,
  points: number,
  metadata?: Record<string, unknown>
): Promise<AwardResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();

  // Idempotency: one scan_dpp award per user per SKU
  if (eventType === "scan_dpp" && metadata?.sku) {
    const { count } = await admin
      .from("point_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("event_type", "scan_dpp")
      .contains("metadata", { sku: metadata.sku });
    if ((count ?? 0) > 0) return { success: true, skipped: true };
  }

  const { error: insertError } = await admin.from("point_events").insert({
    user_id: user.id,
    event_type: eventType,
    points,
    metadata: metadata ?? null,
  });
  if (insertError) return { success: false, error: insertError.message };

  const { data: profile } = await admin
    .from("profiles")
    .select("points, tier")
    .eq("id", user.id)
    .single();

  const oldTotal = profile?.points ?? 0;
  const newTotal = oldTotal + points;
  const oldTier = (profile?.tier as TierName) ?? "Advocate";
  const newTier = calcTier(newTotal);

  await admin
    .from("profiles")
    .update({ points: newTotal, tier: newTier })
    .eq("id", user.id);

  return {
    success: true,
    newTotal,
    tier: newTier,
    tierChanged: newTier !== oldTier,
  };
}

export async function redeemReward(
  rewardType: string,
  pointsSpent: number
): Promise<{ success: boolean; newTotal?: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();

  const { data: sufficient } = await admin.rpc(
    "decrement_points_if_sufficient",
    { p_user_id: user.id, p_amount: pointsSpent }
  );

  if (!sufficient) return { success: false, error: "insufficient_points" };

  await admin.from("redemptions").insert({
    user_id: user.id,
    reward_type: rewardType,
    points_spent: pointsSpent,
  });

  const { data: profile } = await admin
    .from("profiles")
    .select("points")
    .eq("id", user.id)
    .single();

  return { success: true, newTotal: profile?.points ?? 0 };
}

export async function getPointsBalance(): Promise<PointsBalance | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, eventsRes, redemptionsRes, dppRes, reviewRes, takebackRes, referralRes] =
    await Promise.all([
      supabase.from("profiles").select("points, tier").eq("id", user.id).single(),
      supabase
        .from("point_events")
        .select("id, event_type, points, metadata, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("redemptions")
        .select("id, reward_type, points_spent, fulfilled, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("event_type", "scan_dpp"),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("event_type", ["write_wearer_review", "write_caregiver_review"]),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("event_type", "take_back_return"),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("event_type", "refer_caregiver"),
    ]);

  if (!profileRes.data) return null;

  return {
    points: profileRes.data.points,
    tier: profileRes.data.tier as TierName,
    recentEvents: eventsRes.data ?? [],
    redemptions: redemptionsRes.data ?? [],
    achievements: {
      first_dpp_scan: (dppRes.count ?? 0) > 0,
      first_review: (reviewRes.count ?? 0) > 0,
      first_takeback: (takebackRes.count ?? 0) > 0,
      ten_caregiver_referrals: (referralRes.count ?? 0) >= 10,
    },
  };
}

export async function migratePoints(
  guestEvents: GuestEvent[]
): Promise<{ migrated: number }> {
  let migrated = 0;
  for (const event of guestEvents) {
    const result = await awardPoints(
      event.eventType,
      event.points,
      event.metadata
    );
    if (result.success && !result.skipped) migrated++;
  }
  return { migrated };
}
