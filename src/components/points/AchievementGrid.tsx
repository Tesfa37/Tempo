import type { Achievements } from "@/lib/points-catalog";

interface Badge {
  key: keyof Achievements;
  label: string;
  description: string;
  icon: string;
}

const BADGES: Badge[] = [
  {
    key: "first_dpp_scan",
    label: "Passport Pioneer",
    description: "Scanned your first Digital Product Passport",
    icon: "🔍",
  },
  {
    key: "first_review",
    label: "Community Voice",
    description: "Submitted your first wearer or caregiver review",
    icon: "✍️",
  },
  {
    key: "first_takeback",
    label: "Circular Closer",
    description: "Returned a garment through the Take-Back program",
    icon: "♻️",
  },
  {
    key: "ten_caregiver_referrals",
    label: "Care Connector",
    description: "Referred 10 caregivers to the Tempo community",
    icon: "🤝",
  },
];

interface AchievementGridProps {
  achievements: Achievements;
}

export function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <section aria-labelledby="achievements-heading">
      <h2
        id="achievements-heading"
        className="font-playfair text-xl font-bold text-[#1A1A1A] mb-4"
      >
        Achievements
      </h2>
      <ul
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        role="list"
        aria-label="Achievement badges"
      >
        {BADGES.map((badge) => {
          const earned = achievements[badge.key];
          return (
            <li
              key={badge.key}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-opacity ${
                earned
                  ? "bg-[#FAFAF7] border-[#C29E5F]/40"
                  : "bg-[#E8DFD2]/50 border-[#D4C9BA] opacity-50"
              }`}
              aria-label={`${badge.label}: ${earned ? "earned" : "not yet earned"}. ${badge.description}`}
            >
              <span className="text-3xl" aria-hidden="true">
                {badge.icon}
              </span>
              <p className="text-xs font-semibold text-[#1A1A1A] leading-snug">
                {badge.label}
              </p>
              <p className="text-xs text-[#5A5A5A] leading-snug">
                {badge.description}
              </p>
              {earned && (
                <span className="text-xs font-medium text-[#7A8B75] bg-[#7A8B75]/10 px-2 py-0.5 rounded-full">
                  Earned
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
