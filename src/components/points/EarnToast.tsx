"use client";

import { toast } from "sonner";
import type { TierName } from "@/lib/points-catalog";

export function showEarnToast(points: number, label: string) {
  toast(`+${points} Tempo Points`, {
    description: label,
    duration: 4000,
    style: {
      background: "#1A1A1A",
      color: "#FAFAF7",
      border: "1px solid #C29E5F",
    },
  });
}

export function showTierUpToast(tier: TierName) {
  toast(`You reached ${tier}!`, {
    description: "Check your new perks at /rewards",
    duration: 6000,
    style: {
      background: "#C29E5F",
      color: "#1A1A1A",
      border: "1px solid #a8874f",
    },
  });
}
