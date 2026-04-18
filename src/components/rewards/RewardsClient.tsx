"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getPointsBalance } from "@/app/actions/points";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { TierProgressBar } from "@/components/points/TierProgressBar";
import { AchievementGrid } from "@/components/points/AchievementGrid";
import { RedeemButton } from "@/components/points/RedeemButton";
import {
  REDEMPTIONS,
  TIERS,
  type PointsBalance,
  type TierName,
} from "@/lib/points-catalog";

const TIER_COLOR: Record<TierName, string> = {
  Advocate: "text-[#7A8B75] bg-[#7A8B75]/10 border-[#7A8B75]/30",
  Advisor: "text-[#C29E5F] bg-[#C29E5F]/10 border-[#C29E5F]/30",
  Architect: "text-[#C4725A] bg-[#C4725A]/10 border-[#C4725A]/30",
};

const EVENT_LABELS: Record<string, string> = {
  scan_dpp: "Scanned a passport",
  read_full_passport: "Read full passport",
  write_wearer_review: "Submitted a wearer review",
  write_caregiver_review: "Submitted a caregiver review",
  refer_caregiver: "Referred a caregiver",
  complete_fit_concierge: "Used the Fit Concierge",
  ar_tryon_session: "AI virtual fitting session",
  take_back_return: "Take-Back return",
  advocacy_share: "Shared an advocacy link",
  quarterly_advocacy_action: "Quarterly advocacy action",
  purchase_per_dollar: "Purchase",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RewardsClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<PointsBalance | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setAuthed(!!user);
        if (user) {
          getPointsBalance().then(setBalance).catch(() => setBalance(null));
        }
      })
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#5A5A5A] text-sm">Loading...</p>
      </div>
    );
  }

  if (!authed) {
    return <AuthPrompt />;
  }

  if (!balance) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#5A5A5A] text-sm motion-safe:animate-pulse">
          Loading your rewards...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-1">
              TempoPoints
            </h1>
            <p className="text-[#5A5A5A] text-sm">
              Every point you earn maps to a sustainability or community action.
            </p>
          </div>
          <div
            className="text-right shrink-0"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-5xl font-bold text-[#C29E5F] tabular-nums leading-none">
              {balance.points.toLocaleString()}
            </p>
            <span
              className={`inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full border ${TIER_COLOR[balance.tier]}`}
            >
              {balance.tier}
            </span>
          </div>
        </header>

        <section
          className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6"
          aria-labelledby="tier-progress-heading"
        >
          <h2
            id="tier-progress-heading"
            className="text-sm font-semibold text-[#1A1A1A] mb-4"
          >
            Tier progress
          </h2>
          <TierProgressBar points={balance.points} tier={balance.tier} />
          <ul className="mt-4 space-y-1">
            {TIERS[balance.tier].perks.map((perk) => (
              <li
                key={perk}
                className="text-xs text-[#5A5A5A] flex items-center gap-1.5"
              >
                <span className="text-[#7A8B75]" aria-hidden="true">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="activity-heading">
          <h2
            id="activity-heading"
            className="font-playfair text-xl font-bold text-[#1A1A1A] mb-4"
          >
            Recent activity
          </h2>
          {balance.recentEvents.length === 0 ? (
            <p className="text-sm text-[#5A5A5A] italic">
              No activity yet. Scan a passport or try on a garment to earn your
              first points.
            </p>
          ) : (
            <ol className="flex flex-col gap-2" aria-label="Last 10 point events">
              {balance.recentEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between bg-[#FAFAF7] border border-[#D4C9BA] rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {EVENT_LABELS[event.event_type] ?? event.event_type}
                    </p>
                    <p className="text-xs text-[#5A5A5A]">
                      {formatDate(event.created_at)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#C29E5F]">
                    +{event.points}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="redeem-heading">
          <h2
            id="redeem-heading"
            className="font-playfair text-xl font-bold text-[#1A1A1A] mb-4"
          >
            Redeem rewards
          </h2>
          <ul
            className="flex flex-col gap-3"
            role="list"
            aria-label="Available rewards"
          >
            {REDEMPTIONS.map((reward) => (
              <li
                key={reward.id}
                className="flex items-center justify-between bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {reward.label}
                  </p>
                  <p className="text-xs text-[#C29E5F] font-medium mt-0.5">
                    {reward.cost.toLocaleString()} points
                  </p>
                </div>
                <RedeemButton
                  rewardType={reward.id}
                  cost={reward.cost}
                  balance={balance.points}
                  label={reward.label}
                  onSuccess={(newTotal) =>
                    setBalance((prev) =>
                      prev ? { ...prev, points: newTotal } : prev
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </section>

        <AchievementGrid achievements={balance.achievements} />

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/points/how-it-works"
            className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            How sustainability weighting works
          </Link>
          <Link
            href="/rewards/leaderboard"
            className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Community leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
