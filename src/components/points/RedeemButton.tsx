"use client";

import { useState } from "react";
import { redeemReward } from "@/app/actions/points";
import { showEarnToast } from "./EarnToast";
import { toast } from "sonner";
import type { RedemptionId } from "@/lib/points-catalog";

interface RedeemButtonProps {
  rewardType: RedemptionId;
  cost: number;
  balance: number;
  label: string;
  onSuccess: (newTotal: number) => void;
}

export function RedeemButton({
  rewardType,
  cost,
  balance,
  label,
  onSuccess,
}: RedeemButtonProps) {
  const [loading, setLoading] = useState(false);
  const canAfford = balance >= cost;

  async function handleClaim() {
    setLoading(true);
    const result = await redeemReward(rewardType, cost);
    setLoading(false);
    if (result.success && result.newTotal !== undefined) {
      showEarnToast(-cost, `Redeemed: ${label}`);
      onSuccess(result.newTotal);
    } else {
      toast.error(
        result.error === "insufficient_points"
          ? "Not enough points for this reward."
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClaim()}
      disabled={!canAfford || loading}
      aria-label={`Claim ${label} for ${cost.toLocaleString()} points`}
      className="text-xs font-medium px-3 py-1.5 rounded border motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed bg-[#7A8B75] border-[#7A8B75] text-white hover:bg-[#6a7a65] disabled:bg-[#D4C9BA] disabled:border-[#D4C9BA] disabled:text-[#5A5A5A]"
    >
      {loading ? "Claiming..." : "Claim"}
    </button>
  );
}
