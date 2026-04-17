"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { calcTier } from "@/lib/points-catalog";
import type { TierName } from "@/lib/points-catalog";

export interface PurchasePointsResult {
  success: boolean;
  pointsAwarded?: number;
  newTotal?: number;
  tier?: TierName;
  tierChanged?: boolean;
  skipped?: boolean;
  error?: string;
}

// Awards purchase_per_dollar points for a completed order.
// Idempotent: uses the Stripe Checkout Session ID to prevent double-awarding
// if the success page is visited more than once.
export async function awardPurchasePoints(
  sessionId: string,
  orderTotalDollars: number
): Promise<PurchasePointsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "unauthenticated" };
  }

  const admin = createServiceClient();
  const points = Math.floor(orderTotalDollars) * 10;

  // Idempotency: skip if this session has already been processed
  const { count } = await admin
    .from("point_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("event_type", "purchase_per_dollar")
    .contains("metadata", { session_id: sessionId });

  if ((count ?? 0) > 0) {
    return { success: true, skipped: true, pointsAwarded: points };
  }

  const { error: insertError } = await admin.from("point_events").insert({
    user_id: user.id,
    event_type: "purchase_per_dollar",
    points,
    metadata: {
      session_id: sessionId,
      order_total: orderTotalDollars,
    },
  });

  if (insertError) return { success: false, error: insertError.message };

  const { data: prevProfile } = await admin
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const oldTier = (prevProfile?.tier as TierName) ?? "Advocate";

  const { data: newTotal, error: rpcError } = await admin.rpc(
    "increment_user_points",
    { p_user_id: user.id, p_amount: points }
  );

  if (rpcError) return { success: false, error: rpcError.message };

  const newTier = calcTier(newTotal ?? 0);

  await admin
    .from("profiles")
    .update({ tier: newTier })
    .eq("id", user.id);

  return {
    success: true,
    pointsAwarded: points,
    newTotal: newTotal ?? 0,
    tier: newTier,
    tierChanged: newTier !== oldTier,
  };
}
