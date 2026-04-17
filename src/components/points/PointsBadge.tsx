"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPointsBalance } from "@/app/actions/points";
import type { TierName } from "@/lib/points-catalog";

const TIER_COLOR: Record<TierName, string> = {
  Advocate: "bg-[#7A8B75]/15 text-[#7A8B75] border-[#7A8B75]/30",
  Advisor: "bg-[#C29E5F]/15 text-[#C29E5F] border-[#C29E5F]/30",
  Architect: "bg-[#C4725A]/15 text-[#C4725A] border-[#C4725A]/30",
};

export function PointsBadge() {
  const [data, setData] = useState<{ points: number; tier: TierName } | null>(null);

  useEffect(() => {
    getPointsBalance()
      .then((b) => {
        if (b) setData({ points: b.points, tier: b.tier });
      })
      .catch(() => null);
  }, []);

  if (!data) return null;

  return (
    <Link
      href="/rewards"
      aria-label={`TempoPoints: ${data.points} points, ${data.tier} tier`}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${TIER_COLOR[data.tier]}`}
    >
      <span aria-hidden="true">✦</span>
      {data.points.toLocaleString()} pts
    </Link>
  );
}
