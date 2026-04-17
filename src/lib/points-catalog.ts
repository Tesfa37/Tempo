export const POINTS_RULES = {
  scan_dpp: 100,
  read_full_passport: 50,
  write_wearer_review: 250,
  write_caregiver_review: 250,
  refer_caregiver: 500,
  complete_fit_concierge: 50,
  ar_tryon_session: 75,
  take_back_return: 1000,
  advocacy_share: 150,
  quarterly_advocacy_action: 300,
  purchase_per_dollar: 10,
} as const;

export type PointsEventType = keyof typeof POINTS_RULES;

export const TIERS = {
  Advocate: {
    min: 0,
    max: 1499,
    perks: [
      "Early access to drops",
      "Free domestic shipping on orders over $75",
    ],
  },
  Advisor: {
    min: 1500,
    max: 4999,
    perks: [
      "All Advocate perks",
      "Quarterly advisor-board Q&A",
      "Free returns",
      "10% off next order",
    ],
  },
  Architect: {
    min: 5000,
    max: Infinity,
    perks: [
      "All Advisor perks",
      "$200 credit toward co-designed piece",
      "Named credit on next pattern",
      "Annual advisor retreat invite",
    ],
  },
} as const;

export type TierName = keyof typeof TIERS;

export const REDEMPTIONS = [
  { id: "takeback_label", label: "Free Take-Back shipping label", cost: 500 },
  { id: "advisor_meetgreet", label: "Advisor meet-and-greet (quarterly)", cost: 1000 },
  { id: "discount_25", label: "$25 off next order", cost: 2000 },
  { id: "dref_donation", label: "Named donation to Disability Rights Education Fund", cost: 3000 },
  { id: "early_access", label: "Early access to next product drop", cost: 5000 },
] as const;

export type RedemptionId = typeof REDEMPTIONS[number]["id"];

export interface PointEvent {
  id: string;
  event_type: string; // intentionally string: DB rows may contain future event types not yet in PointsEventType
  points: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Redemption {
  id: string;
  reward_type: string; // intentionally string: mirrors DB column, may contain future reward types
  points_spent: number;
  fulfilled: boolean;
  created_at: string;
}

export interface Achievements {
  first_dpp_scan: boolean;
  first_review: boolean;
  first_takeback: boolean;
  ten_caregiver_referrals: boolean;
}

export interface PointsBalance {
  points: number;
  tier: TierName;
  recentEvents: PointEvent[];
  redemptions: Redemption[];
  achievements: Achievements;
}

export interface GuestEvent {
  eventType: PointsEventType;
  points: number;
  metadata?: Record<string, unknown>;
  queuedAt: string;
}

export function calcTier(points: number): TierName {
  if (points >= TIERS.Architect.min) return "Architect";
  if (points >= TIERS.Advisor.min) return "Advisor";
  return "Advocate";
}
