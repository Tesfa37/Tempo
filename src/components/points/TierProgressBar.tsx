import { TIERS, type TierName } from "@/lib/points-catalog";

interface TierProgressBarProps {
  points: number;
  tier: TierName;
}

const TIER_ORDER: TierName[] = ["Advocate", "Advisor", "Architect"];
const TIER_COLOR: Record<TierName, string> = {
  Advocate: "#7A8B75",
  Advisor: "#C29E5F",
  Architect: "#C4725A",
};

export function TierProgressBar({ points, tier }: TierProgressBarProps) {
  const currentIdx = TIER_ORDER.indexOf(tier);
  const nextTier = TIER_ORDER[currentIdx + 1] as TierName | undefined;

  if (!nextTier) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-[#C4725A]">Architect</span>
          <span className="text-[#5A5A5A]">Maximum tier</span>
        </div>
        <div className="h-3 rounded-full bg-[#C4725A]" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} aria-label="Tier progress: maximum tier reached" />
      </div>
    );
  }

  const tierMin = TIERS[tier].min;
  const tierMax = TIERS[nextTier].min;
  const progress = Math.min(100, Math.round(((points - tierMin) / (tierMax - tierMin)) * 100));
  const remaining = tierMax - points;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold" style={{ color: TIER_COLOR[tier] }}>{tier}</span>
        <span className="text-[#5A5A5A]">
          {remaining.toLocaleString()} pts to {nextTier}
        </span>
      </div>
      <div
        className="h-3 rounded-full bg-[#D4C9BA] overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progress}% of the way to ${nextTier} tier`}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: TIER_COLOR[tier] }}
        />
      </div>
      <p className="text-xs text-[#5A5A5A]">
        {points.toLocaleString()} / {tierMax.toLocaleString()} points
      </p>
    </div>
  );
}
