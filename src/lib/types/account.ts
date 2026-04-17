// src/lib/types/account.ts

import type { TierName } from "@/lib/points-catalog";
import type { Condition } from "@/data/products";

export type AccountType = "individual" | "caregiver" | "agency";

export interface SavedItem {
  productId: string;
  slug: string;
  name: string;
  size: string;
  /** USD whole dollars, matches Product.price */
  price: number;
}

export interface CareRecipient {
  /** Use crypto.randomUUID() when creating. Must be unique within care_recipients array. */
  id: string;
  display_name: string;
  /**
   * Intentionally string[] (not Condition[]) so DB rows survive future Condition
   * value additions before a code deploy. Cast to Condition[] only at filter boundaries.
   */
  conditions: string[];
  sizes: {
    top: string;
    bottom: string;
    shoe?: string;
  };
  notes: string;
  saved_items: SavedItem[];
  /** ISO date string, updated manually when caregiver records an order */
  last_order_date?: string;
}

export interface FitProfile {
  top: string;
  bottom: string;
  shoe?: string;
  /**
   * Intentionally string[] — see CareRecipient.conditions for rationale.
   * Use KnownCondition type alias for filtering against Product.conditions.
   */
  conditions: string[];
  notes: string;
  care_setting?: "home" | "facility";
}

/**
 * KnownCondition narrows a stored string to a value the Product catalog recognises.
 * Use when filtering products by profile conditions.
 */
export type KnownCondition = Condition;

export interface AgencySettings {
  facility_name: string;
  bulk_order: boolean;
  net30: boolean;
}

export interface EmailPreferences {
  marketing: boolean;
  order_updates: boolean;
  point_alerts: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  tier: TierName;
  points: number;
  /**
   * Legacy field kept for backward compatibility.
   * Invariant: caregiver_mode === (account_type !== "individual").
   * Set account_type — never set caregiver_mode directly.
   */
  caregiver_mode: boolean;
  public_leaderboard: boolean;
  account_type: AccountType;
  care_recipients: CareRecipient[];
  fit_profile: FitProfile | null;
  agency_settings: AgencySettings | null;
  email_preferences: EmailPreferences;
  /** null = active; ISO string = soft-deleted; hard deletion after 30 days via cron */
  deleted_at: string | null;
  created_at: string;
}
