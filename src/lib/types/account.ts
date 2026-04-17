// src/lib/types/account.ts

import type { TierName } from "@/lib/points-catalog";

export type AccountType = "individual" | "caregiver" | "agency";

export interface SavedItem {
  productId: string;
  slug: string;
  name: string;
  size: string;
  price: number;
}

export interface CareRecipient {
  id: string;               // random ID generated client-side
  display_name: string;
  conditions: string[];     // e.g. ["arthritis", "post-stroke"]
  sizes: {
    top: string;
    bottom: string;
    shoe?: string;
  };
  notes: string;
  saved_items: SavedItem[]; // for quick reorder
  last_order_date?: string; // ISO date string, updated manually
}

export interface FitProfile {
  top: string;
  bottom: string;
  shoe?: string;
  conditions: string[];
  notes: string;
  care_setting?: "home" | "facility";
}

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
  caregiver_mode: boolean;
  public_leaderboard: boolean;
  account_type: AccountType;
  care_recipients: CareRecipient[];
  fit_profile: FitProfile | null;
  agency_settings: AgencySettings | null;
  email_preferences: EmailPreferences;
  deleted_at: string | null;
  created_at: string;
}
