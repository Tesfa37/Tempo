# User Accounts + Caregiver Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase-backed user accounts with magic-link auth, per-type onboarding (individual/caregiver/agency), a caregiver recipient roster with quick reorder, and full account settings including GDPR data export and soft delete.

**Architecture:** Each account type writes to the same `profiles` row via typed jsonb columns (`fit_profile`, `care_recipients`, `agency_settings`). Auth is Supabase magic-link OTP — no passwords. All profile mutations route through server actions using `createServiceClient()` to bypass RLS. The caregiver dashboard reads `care_recipients` from the profile and wires quick-reorder into the existing Zustand cart store.

**Tech Stack:** Next.js 15 App Router (server components + server actions), Supabase SSR (`@supabase/ssr`), Zustand (cart store), Tailwind CSS, TypeScript strict, `nanoid` (recipient IDs).

---

## File Map

**New files:**
- `src/supabase/migrations/0002_user_accounts.sql` — 6 new columns + migration of existing `caregiver_mode`
- `src/lib/types/account.ts` — `Profile`, `CareRecipient`, `SavedItem`, `AccountType`, `FitProfile`, `AgencySettings`, `EmailPreferences`
- `src/app/login/page.tsx` — standalone magic-link login page (no password)
- `src/app/account/layout.tsx` — server-side auth guard; redirects to `/login?next=/account`
- `src/app/account/page.tsx` — profile setup: type selector + per-type onboarding section
- `src/app/account/caregiver/page.tsx` — caregiver recipient roster page
- `src/app/account/settings/page.tsx` — display name, email prefs, privacy, export, delete
- `src/app/api/account/export/route.ts` — GDPR data export (JSON file download)
- `src/app/actions/account.ts` — server actions: `getProfile`, `updateProfile`, `updateCareRecipients`, `softDeleteAccount`
- `src/components/account/AccountTypeSelector.tsx` — three-card type picker
- `src/components/account/IndividualOnboarding.tsx` — size quiz + conditions + fit notes
- `src/components/account/CaregiverOnboarding.tsx` — recipient list management
- `src/components/account/AgencyOnboarding.tsx` — facility name, bulk prefs, net-30 toggle
- `src/components/account/AddRecipientModal.tsx` — add/edit recipient dialog
- `src/components/account/RecipientCard.tsx` — recipient card with quick reorder

**Modified files:**
- `src/components/layout/Header.tsx` — add "Sign in" / "Account" nav link
- `src/app/auth/callback/route.ts` — handle `deleted_at` restoration flow

---

### Task 1: DB migration

**Files:**
- Create: `src/supabase/migrations/0002_user_accounts.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- src/supabase/migrations/0002_user_accounts.sql

-- 1. account_type: 'individual' | 'caregiver' | 'agency'
alter table public.profiles
  add column if not exists account_type text
  default 'individual'
  check (account_type in ('individual', 'caregiver', 'agency'));

-- 2. care_recipients: array of {id, display_name, conditions, sizes, notes, saved_items}
alter table public.profiles
  add column if not exists care_recipients jsonb default '[]'::jsonb;

-- 3. fit_profile: individual user's sizes + conditions (stored only for account_type='individual')
alter table public.profiles
  add column if not exists fit_profile jsonb default null;
-- shape: {top: string, bottom: string, shoe: string, conditions: string[], notes: string}

-- 4. agency_settings: facility name + bulk/invoicing prefs (account_type='agency')
alter table public.profiles
  add column if not exists agency_settings jsonb default null;
-- shape: {facility_name: string, bulk_order: boolean, net30: boolean}

-- 5. email_preferences: opt-in/out per category
alter table public.profiles
  add column if not exists email_preferences jsonb
  default '{"marketing": true, "order_updates": true, "point_alerts": true}'::jsonb;

-- 6. deleted_at: soft delete, 30-day recovery window
alter table public.profiles
  add column if not exists deleted_at timestamptz default null;

-- 7. Migrate existing caregiver_mode=true rows to account_type='caregiver'
update public.profiles
  set account_type = 'caregiver'
  where caregiver_mode = true;
```

- [ ] **Step 2: Run the migration**

  Paste the SQL into the Supabase SQL Editor (dashboard → SQL Editor → New query) and click Run.

  Expected: "Success. No rows affected" (or "7 rows affected" for the update).

- [ ] **Step 3: Verify columns in Supabase**

  In the Supabase Table Editor, open `profiles`. Confirm these columns are present: `account_type`, `care_recipients`, `fit_profile`, `agency_settings`, `email_preferences`, `deleted_at`.

- [ ] **Step 4: Commit**

```bash
git add src/supabase/migrations/0002_user_accounts.sql
git commit -m "feat: migrate profiles table for user accounts and caregiver mode"
```

---

### Task 2: Shared TypeScript types

**Files:**
- Create: `src/lib/types/account.ts`

- [ ] **Step 1: Create the types file**

```typescript
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
  id: string;               // nanoid — generated client-side
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
  conditions: string[];     // same Condition values as src/data/products.ts
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
```

- [ ] **Step 2: Verify types compile**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types/account.ts
git commit -m "feat: add shared TypeScript types for user accounts"
```

---

### Task 3: Profile server actions

**Files:**
- Create: `src/app/actions/account.ts`

- [ ] **Step 1: Write the server actions file**

```typescript
// src/app/actions/account.ts
"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Profile, CareRecipient, FitProfile, AgencySettings, EmailPreferences, AccountType } from "@/lib/types/account";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createServiceClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    email: data.email ?? null,
    display_name: data.display_name ?? null,
    tier: data.tier ?? "Advocate",
    points: data.points ?? 0,
    caregiver_mode: data.caregiver_mode ?? false,
    public_leaderboard: data.public_leaderboard ?? false,
    account_type: (data.account_type as AccountType) ?? "individual",
    care_recipients: (data.care_recipients as CareRecipient[]) ?? [],
    fit_profile: data.fit_profile ?? null,
    agency_settings: data.agency_settings ?? null,
    email_preferences: data.email_preferences ?? {
      marketing: true,
      order_updates: true,
      point_alerts: true,
    },
    deleted_at: data.deleted_at ?? null,
    created_at: data.created_at,
  };
}

export async function updateProfile(updates: {
  display_name?: string;
  account_type?: AccountType;
  fit_profile?: FitProfile | null;
  agency_settings?: AgencySettings | null;
  email_preferences?: EmailPreferences;
  public_leaderboard?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const patch: Record<string, unknown> = { ...updates };

  // Keep caregiver_mode in sync for backward compatibility
  if (updates.account_type !== undefined) {
    patch.caregiver_mode = updates.account_type !== "individual";
  }

  const { error } = await admin
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCareRecipients(
  recipients: CareRecipient[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const { error } = await admin
    .from("profiles")
    .update({ care_recipients: recipients })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function softDeleteAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();
  const { error } = await admin
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  // Sign user out immediately after marking deleted
  await supabase.auth.signOut();
  return { success: true };
}
```

- [ ] **Step 2: Verify types compile**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions/account.ts
git commit -m "feat: add profile server actions (get, update, caregiver recipients, soft delete)"
```

---

### Task 4: Login page

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create the login page**

```tsx
// src/app/login/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Tempo",
  description: "Sign in to your Tempo account with a magic link. No password required.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Already signed in — go to account (or the requested next page)
  if (user) {
    const { next } = await searchParams;
    const destination =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/account";
    redirect(destination);
  }

  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/account";

  return (
    <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl overflow-hidden">
          <div className="bg-[#1A1A1A] px-8 py-8 text-center">
            <h1 className="font-playfair text-2xl font-bold text-[#FAFAF7]">
              Sign in to Tempo
            </h1>
            <p className="text-[#9A9A9A] text-sm mt-2">
              No password required. We send you a magic link.
            </p>
          </div>
          <div className="px-8 py-8">
            <LoginForm next={safeNext} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the LoginForm client component**

```tsx
// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="font-playfair text-xl font-bold text-[#1A1A1A] mb-3">
          Check your email
        </p>
        <p className="text-[#5A5A5A] text-sm leading-relaxed">
          A sign-in link has been sent to{" "}
          <strong className="text-[#1A1A1A]">{email}</strong>. Click it to
          continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-[#1A1A1A] mb-2"
        >
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          aria-describedby={error ? "login-error" : undefined}
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="py-3 px-6 rounded-lg bg-[#C29E5F] text-white font-medium text-sm hover:bg-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending link..." : "Send magic link"}
      </button>
      {error && (
        <p id="login-error" className="text-sm text-[#C4725A]" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-[#9A9A9A] text-center">
        New to Tempo? Signing in creates your account automatically.
      </p>
    </form>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/login/page.tsx src/components/auth/LoginForm.tsx
git commit -m "feat: add /login page with magic-link auth"
```

---

### Task 5: Account layout (auth guard)

**Files:**
- Create: `src/app/account/layout.tsx`

- [ ] **Step 1: Create the layout**

```tsx
// src/app/account/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  return (
    <div className="min-h-screen bg-[#E8DFD2]">
      {/* Account sub-nav */}
      <nav
        aria-label="Account navigation"
        className="bg-[#FAFAF7] border-b border-[#D4C9BA]"
      >
        <div className="max-w-5xl mx-auto px-4 flex gap-6 py-3 text-sm overflow-x-auto">
          <Link
            href="/account"
            className="text-[#1A1A1A] font-medium whitespace-nowrap hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Profile
          </Link>
          <Link
            href="/account/caregiver"
            className="text-[#5A5A5A] whitespace-nowrap hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Care recipients
          </Link>
          <Link
            href="/account/settings"
            className="text-[#5A5A5A] whitespace-nowrap hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Settings
          </Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/account/layout.tsx
git commit -m "feat: add /account layout with auth guard and sub-navigation"
```

---

### Task 6: AccountTypeSelector component

**Files:**
- Create: `src/components/account/AccountTypeSelector.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/account/AccountTypeSelector.tsx
"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import type { AccountType } from "@/lib/types/account";
import { User, Users, Building2 } from "lucide-react";

const TYPES: {
  value: AccountType;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "individual",
    label: "Individual",
    sublabel: "Shopping for yourself",
    Icon: User,
  },
  {
    value: "caregiver",
    label: "Caregiver",
    sublabel: "Shopping for a family member or person you support",
    Icon: Users,
  },
  {
    value: "agency",
    label: "Professional caregiver",
    sublabel: "Purchasing for a care facility or agency",
    Icon: Building2,
  },
];

interface Props {
  current: AccountType;
  onChanged?: (type: AccountType) => void;
}

export function AccountTypeSelector({ current, onChanged }: Props) {
  const [selected, setSelected] = useState<AccountType>(current);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSelect(type: AccountType) {
    setSelected(type);
    setError("");
    startTransition(async () => {
      const result = await updateProfile({ account_type: type });
      if (!result.success) {
        setError(result.error ?? "Failed to save");
        setSelected(current);
      } else {
        onChanged?.(type);
      }
    });
  }

  return (
    <section aria-labelledby="account-type-heading">
      <h2
        id="account-type-heading"
        className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
      >
        Account type
      </h2>
      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid sm:grid-cols-3 gap-3"
      >
        {TYPES.map(({ value, label, sublabel, Icon }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(value)}
              disabled={isPending}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50 ${
                isSelected
                  ? "border-[#C29E5F] bg-[#C29E5F]/8"
                  : "border-[#D4C9BA] bg-[#FAFAF7] hover:border-[#9A9A9A]"
              }`}
            >
              <Icon
                size={20}
                className={isSelected ? "text-[#C29E5F]" : "text-[#5A5A5A]"}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-[#1A1A1A]">
                {label}
              </span>
              <span className="text-xs text-[#5A5A5A] leading-relaxed">
                {sublabel}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-[#C4725A] mt-2" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/account/AccountTypeSelector.tsx
git commit -m "feat: add AccountTypeSelector component with save-on-select"
```

---

### Task 7: Individual onboarding component

**Files:**
- Create: `src/components/account/IndividualOnboarding.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/account/IndividualOnboarding.tsx
"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import type { FitProfile } from "@/lib/types/account";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];
const CONDITIONS: { value: string; label: string }[] = [
  { value: "arthritis", label: "Arthritis" },
  { value: "post-stroke", label: "Post-stroke" },
  { value: "wheelchair", label: "Wheelchair user" },
  { value: "limited-mobility", label: "Limited mobility" },
  { value: "sensory", label: "Sensory sensitivities" },
  { value: "dementia", label: "Dementia" },
];

interface Props {
  initial: FitProfile | null;
}

export function IndividualOnboarding({ initial }: Props) {
  const [top, setTop] = useState(initial?.top ?? "");
  const [bottom, setBottom] = useState(initial?.bottom ?? "");
  const [shoe, setShoe] = useState(initial?.shoe ?? "");
  const [conditions, setConditions] = useState<string[]>(
    initial?.conditions ?? []
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function toggleCondition(value: string) {
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError("");
    startTransition(async () => {
      const result = await updateProfile({
        fit_profile: { top, bottom, shoe: shoe || undefined, conditions, notes },
      });
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Failed to save");
      }
    });
  }

  return (
    <section aria-labelledby="individual-onboarding-heading">
      <h2
        id="individual-onboarding-heading"
        className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
      >
        Your fit profile
      </h2>
      <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-6">
        {/* Size selectors */}
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-medium text-[#1A1A1A] mb-2">
            Sizes
          </legend>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="fit-top"
                className="block text-xs text-[#5A5A5A] mb-1"
              >
                Top size
              </label>
              <select
                id="fit-top"
                value={top}
                onChange={(e) => setTop(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <option value="">Select</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fit-bottom"
                className="block text-xs text-[#5A5A5A] mb-1"
              >
                Bottom size
              </label>
              <select
                id="fit-bottom"
                value={bottom}
                onChange={(e) => setBottom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <option value="">Select</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fit-shoe"
                className="block text-xs text-[#5A5A5A] mb-1"
              >
                Shoe size (optional)
              </label>
              <select
                id="fit-shoe"
                value={shoe}
                onChange={(e) => setShoe(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <option value="">Select</option>
                {SHOE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Conditions (opt-in) */}
        <fieldset>
          <legend className="text-sm font-medium text-[#1A1A1A] mb-1">
            Conditions
          </legend>
          <p className="text-xs text-[#5A5A5A] mb-3">
            Optional. Used to personalise product filters. Not shared publicly.
          </p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(({ value, label }) => {
              const checked = conditions.includes(value);
              return (
                <label
                  key={value}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer motion-safe:transition-colors ${
                    checked
                      ? "border-[#7A8B75] bg-[#7A8B75]/10 text-[#1A1A1A] font-medium"
                      : "border-[#D4C9BA] text-[#5A5A5A] hover:border-[#9A9A9A]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleCondition(value)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Fit notes */}
        <div>
          <label
            htmlFor="fit-notes"
            className="block text-sm font-medium text-[#1A1A1A] mb-1"
          >
            Fit preferences or notes
          </label>
          <p className="text-xs text-[#5A5A5A] mb-2">
            Optional. Shared with the Fit Concierge to personalise suggestions.
          </p>
          <textarea
            id="fit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. prefer loose fit, sensitive to seams, need extra room in the shoulders"
            className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save fit profile"}
          </button>
          {saved && (
            <p className="text-sm text-[#7A8B75]" role="status" aria-live="polite">
              Saved
            </p>
          )}
          {error && (
            <p className="text-sm text-[#C4725A]" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/account/IndividualOnboarding.tsx
git commit -m "feat: add IndividualOnboarding component (sizes, conditions, fit notes)"
```

---

### Task 8: AddRecipientModal component

**Files:**
- Create: `src/components/account/AddRecipientModal.tsx`

This component is used by both CaregiverOnboarding and the caregiver dashboard to add or edit a recipient.

- [ ] **Step 1: Create the modal**

```tsx
// src/components/account/AddRecipientModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CareRecipient } from "@/lib/types/account";
import { products } from "@/data/products";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const CONDITIONS: { value: string; label: string }[] = [
  { value: "arthritis", label: "Arthritis" },
  { value: "post-stroke", label: "Post-stroke" },
  { value: "wheelchair", label: "Wheelchair user" },
  { value: "limited-mobility", label: "Limited mobility" },
  { value: "sensory", label: "Sensory sensitivities" },
  { value: "dementia", label: "Dementia" },
];

interface Props {
  open: boolean;
  initial?: CareRecipient;
  onSave: (recipient: CareRecipient) => void;
  onClose: () => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function AddRecipientModal({ open, initial, onSave, onClose }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [topSize, setTopSize] = useState("");
  const [bottomSize, setBottomSize] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initial) {
      setDisplayName(initial.display_name);
      setConditions(initial.conditions);
      setTopSize(initial.sizes.top);
      setBottomSize(initial.sizes.bottom);
      setShoeSize(initial.sizes.shoe ?? "");
      setNotes(initial.notes);
    } else {
      setDisplayName("");
      setConditions([]);
      setTopSize("");
      setBottomSize("");
      setShoeSize("");
      setNotes("");
    }
  }, [initial, open]);

  function toggleCondition(value: string) {
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: initial?.id ?? generateId(),
      display_name: displayName.trim(),
      conditions,
      sizes: {
        top: topSize,
        bottom: bottomSize,
        shoe: shoeSize || undefined,
      },
      notes: notes.trim(),
      saved_items: initial?.saved_items ?? [],
      last_order_date: initial?.last_order_date,
    });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipient-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D4C9BA]">
          <h2
            id="recipient-modal-title"
            className="font-playfair text-lg font-bold text-[#1A1A1A]"
          >
            {initial ? "Edit recipient" : "Add care recipient"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-[#5A5A5A] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="px-6 py-6 flex flex-col gap-5">
          {/* Display name */}
          <div>
            <label
              htmlFor="recipient-name"
              className="block text-sm font-medium text-[#1A1A1A] mb-1"
            >
              Display name
            </label>
            <input
              id="recipient-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Margaret, or Room 14B"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            />
          </div>

          {/* Sizes */}
          <fieldset>
            <legend className="text-sm font-medium text-[#1A1A1A] mb-3">
              Sizes
            </legend>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="r-top"
                  className="block text-xs text-[#5A5A5A] mb-1"
                >
                  Top
                </label>
                <select
                  id="r-top"
                  value={topSize}
                  onChange={(e) => setTopSize(e.target.value)}
                  required
                  className="w-full px-2 py-2 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                >
                  <option value="">--</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="r-bottom"
                  className="block text-xs text-[#5A5A5A] mb-1"
                >
                  Bottom
                </label>
                <select
                  id="r-bottom"
                  value={bottomSize}
                  onChange={(e) => setBottomSize(e.target.value)}
                  required
                  className="w-full px-2 py-2 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                >
                  <option value="">--</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="r-shoe"
                  className="block text-xs text-[#5A5A5A] mb-1"
                >
                  Shoe (opt.)
                </label>
                <select
                  id="r-shoe"
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                >
                  <option value="">--</option>
                  {["5","6","7","8","9","10","11","12","13"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Conditions */}
          <fieldset>
            <legend className="text-sm font-medium text-[#1A1A1A] mb-1">
              Conditions
            </legend>
            <p className="text-xs text-[#5A5A5A] mb-3">
              Optional. Used to filter product recommendations.
            </p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(({ value, label }) => {
                const checked = conditions.includes(value);
                return (
                  <label
                    key={value}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer motion-safe:transition-colors ${
                      checked
                        ? "border-[#7A8B75] bg-[#7A8B75]/10 text-[#1A1A1A] font-medium"
                        : "border-[#D4C9BA] text-[#5A5A5A] hover:border-[#9A9A9A]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleCondition(value)}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Notes */}
          <div>
            <label
              htmlFor="r-notes"
              className="block text-sm font-medium text-[#1A1A1A] mb-1"
            >
              Notes
            </label>
            <textarea
              id="r-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. prefers front-opening tops, care setting: memory care unit"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-[#D4C9BA]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#D4C9BA] text-sm text-[#5A5A5A] hover:bg-[#E8DFD2] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              {initial ? "Save changes" : "Add recipient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

Note: the `import { products } from "@/data/products"` line is in the file but not used yet; remove it from the final file since the saved items feature is handled in Task 10.

- [ ] **Step 2: Remove the unused import**

Edit `src/components/account/AddRecipientModal.tsx` and remove the line:
```
import { products } from "@/data/products";
```

- [ ] **Step 3: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/account/AddRecipientModal.tsx
git commit -m "feat: add AddRecipientModal (name, sizes, conditions, notes)"
```

---

### Task 9: CaregiverOnboarding + AgencyOnboarding components

**Files:**
- Create: `src/components/account/CaregiverOnboarding.tsx`
- Create: `src/components/account/AgencyOnboarding.tsx`

- [ ] **Step 1: Create CaregiverOnboarding**

```tsx
// src/components/account/CaregiverOnboarding.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Users } from "lucide-react";
import { updateCareRecipients } from "@/app/actions/account";
import { AddRecipientModal } from "./AddRecipientModal";
import type { CareRecipient } from "@/lib/types/account";

interface Props {
  initial: CareRecipient[];
}

export function CaregiverOnboarding({ initial }: Props) {
  const [recipients, setRecipients] = useState<CareRecipient[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSave(recipient: CareRecipient) {
    const next = recipients.some((r) => r.id === recipient.id)
      ? recipients.map((r) => (r.id === recipient.id ? recipient : r))
      : [...recipients, recipient];
    setRecipients(next);
    setModalOpen(false);
    setError("");
    startTransition(async () => {
      const result = await updateCareRecipients(next);
      if (!result.success) setError(result.error ?? "Failed to save");
    });
  }

  return (
    <section aria-labelledby="caregiver-onboarding-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="caregiver-onboarding-heading"
          className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest"
        >
          Care recipients
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C29E5F] hover:text-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
        >
          <Plus size={14} aria-hidden="true" />
          Add recipient
        </button>
      </div>

      {recipients.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-[#D4C9BA] rounded-xl">
          <Users size={28} className="text-[#D4C9BA] mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-[#5A5A5A]">No recipients yet.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-3 text-sm text-[#C29E5F] underline underline-offset-2 hover:text-[#a8874f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Add your first recipient
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2" aria-label="Care recipients">
          {recipients.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between px-4 py-3 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl"
            >
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {r.display_name}
                </p>
                <p className="text-xs text-[#5A5A5A] mt-0.5">
                  Top: {r.sizes.top}, Bottom: {r.sizes.bottom}
                  {r.conditions.length > 0 &&
                    ` — ${r.conditions.join(", ")}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setModalOpen(true);
                }}
                className="text-xs text-[#5A5A5A] underline underline-offset-2 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                aria-label={`Edit ${r.display_name}`}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {isPending && (
        <p className="text-xs text-[#9A9A9A] mt-2" aria-live="polite">
          Saving...
        </p>
      )}
      {error && (
        <p className="text-sm text-[#C4725A] mt-2" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-[#9A9A9A] mt-4">
        Manage recipients and quick reorder on the{" "}
        <a
          href="/account/caregiver"
          className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
        >
          Care recipients dashboard
        </a>
        .
      </p>

      <AddRecipientModal
        open={modalOpen}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
```

- [ ] **Step 2: Create AgencyOnboarding**

```tsx
// src/components/account/AgencyOnboarding.tsx
"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import type { AgencySettings } from "@/lib/types/account";

interface Props {
  initial: AgencySettings | null;
}

export function AgencyOnboarding({ initial }: Props) {
  const [facilityName, setFacilityName] = useState(
    initial?.facility_name ?? ""
  );
  const [bulkOrder, setBulkOrder] = useState(initial?.bulk_order ?? false);
  const [net30, setNet30] = useState(initial?.net30 ?? false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError("");
    startTransition(async () => {
      const result = await updateProfile({
        agency_settings: {
          facility_name: facilityName.trim(),
          bulk_order: bulkOrder,
          net30,
        },
      });
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Failed to save");
      }
    });
  }

  return (
    <section aria-labelledby="agency-onboarding-heading">
      <h2
        id="agency-onboarding-heading"
        className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
      >
        Agency settings
      </h2>
      <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="facility-name"
            className="block text-sm font-medium text-[#1A1A1A] mb-1"
          >
            Facility or agency name
          </label>
          <input
            id="facility-name"
            type="text"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            required
            placeholder="e.g. Sunrise Memory Care, Room 4B"
            className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-[#1A1A1A] mb-1">
            Purchasing preferences
          </legend>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={bulkOrder}
              onChange={(e) => setBulkOrder(e.target.checked)}
              className="mt-0.5 rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
            />
            <span className="text-sm text-[#1A1A1A]">
              Bulk order preferences
              <span className="block text-xs text-[#5A5A5A] font-normal">
                Contact us about volume pricing for orders of 10 or more items.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={net30}
              onChange={(e) => setNet30(e.target.checked)}
              className="mt-0.5 rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
            />
            <span className="text-sm text-[#1A1A1A]">
              Net-30 invoicing
              <span className="block text-xs text-[#5A5A5A] font-normal">
                Receive invoices payable within 30 days. Subject to approval.
              </span>
            </span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save agency settings"}
          </button>
          {saved && (
            <p className="text-sm text-[#7A8B75]" role="status" aria-live="polite">
              Saved
            </p>
          )}
          {error && (
            <p className="text-sm text-[#C4725A]" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/account/CaregiverOnboarding.tsx src/components/account/AgencyOnboarding.tsx
git commit -m "feat: add CaregiverOnboarding and AgencyOnboarding components"
```

---

### Task 10: Account main page

**Files:**
- Create: `src/app/account/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// src/app/account/page.tsx
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { AccountTypeSelector } from "@/components/account/AccountTypeSelector";
import { IndividualOnboarding } from "@/components/account/IndividualOnboarding";
import { CaregiverOnboarding } from "@/components/account/CaregiverOnboarding";
import { AgencyOnboarding } from "@/components/account/AgencyOnboarding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your account | Tempo",
};

export default async function AccountPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account");

  return (
    <div className="max-w-2xl">
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-8">
        Your profile
      </h1>

      <div className="flex flex-col gap-10">
        {/* Account type */}
        <AccountTypeSelector current={profile.account_type} />

        {/* Per-type onboarding section */}
        {profile.account_type === "individual" && (
          <IndividualOnboarding initial={profile.fit_profile} />
        )}
        {profile.account_type === "caregiver" && (
          <CaregiverOnboarding initial={profile.care_recipients} />
        )}
        {profile.account_type === "agency" && (
          <AgencyOnboarding initial={profile.agency_settings} />
        )}
      </div>
    </div>
  );
}
```

Note: `AccountTypeSelector` is a client component that updates account_type in real time via `useTransition`. When it calls `onChanged`, the page needs to re-render to show the correct onboarding section. Because the page is a server component, we need a thin client wrapper to handle the account type switch.

- [ ] **Step 2: Create a client wrapper for live account-type switching**

```tsx
// src/components/account/AccountPageClient.tsx
"use client";

import { useState } from "react";
import { AccountTypeSelector } from "./AccountTypeSelector";
import { IndividualOnboarding } from "./IndividualOnboarding";
import { CaregiverOnboarding } from "./CaregiverOnboarding";
import { AgencyOnboarding } from "./AgencyOnboarding";
import type { Profile } from "@/lib/types/account";
import type { AccountType } from "@/lib/types/account";

export function AccountPageClient({ profile }: { profile: Profile }) {
  const [accountType, setAccountType] = useState<AccountType>(
    profile.account_type
  );

  return (
    <div className="flex flex-col gap-10">
      <AccountTypeSelector
        current={accountType}
        onChanged={setAccountType}
      />

      {accountType === "individual" && (
        <IndividualOnboarding initial={profile.fit_profile} />
      )}
      {accountType === "caregiver" && (
        <CaregiverOnboarding initial={profile.care_recipients} />
      )}
      {accountType === "agency" && (
        <AgencyOnboarding initial={profile.agency_settings} />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update account page to use the client wrapper**

```tsx
// src/app/account/page.tsx  (updated)
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { AccountPageClient } from "@/components/account/AccountPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your account | Tempo",
};

export default async function AccountPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account");

  return (
    <div className="max-w-2xl">
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-8">
        Your profile
      </h1>
      <AccountPageClient profile={profile} />
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/account/page.tsx src/components/account/AccountPageClient.tsx
git commit -m "feat: add /account page with type selector and per-type onboarding"
```

---

### Task 11: RecipientCard component

**Files:**
- Create: `src/components/account/RecipientCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/account/RecipientCard.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, Pencil, Trash2, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { AddRecipientModal } from "./AddRecipientModal";
import type { CareRecipient } from "@/lib/types/account";

interface Props {
  recipient: CareRecipient;
  onUpdate: (updated: CareRecipient) => void;
  onDelete: (id: string) => void;
}

export function RecipientCard({ recipient, onUpdate, onDelete }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [reorderDone, setReorderDone] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleQuickReorder() {
    if (recipient.saved_items.length === 0) return;
    recipient.saved_items.forEach((item) => {
      addItem({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: 1,
      });
    });
    setReorderDone(true);
    setTimeout(() => setReorderDone(false), 3000);
  }

  return (
    <article
      aria-label={`Care recipient: ${recipient.display_name}`}
      className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-playfair text-lg font-bold text-[#1A1A1A]">
            {recipient.display_name}
          </h3>
          {recipient.conditions.length > 0 && (
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              {recipient.conditions.join(", ")}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            aria-label={`Edit ${recipient.display_name}`}
            className="p-1.5 rounded-lg text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#E8DFD2] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <Pencil size={14} aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(recipient.id)}
            aria-label={`Remove ${recipient.display_name}`}
            className="p-1.5 rounded-lg text-[#5A5A5A] hover:text-[#C4725A] hover:bg-[#C4725A]/8 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-[#9A9A9A] uppercase tracking-wide">Top</p>
          <p className="text-sm font-semibold text-[#1A1A1A]">
            {recipient.sizes.top || "--"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#9A9A9A] uppercase tracking-wide">Bottom</p>
          <p className="text-sm font-semibold text-[#1A1A1A]">
            {recipient.sizes.bottom || "--"}
          </p>
        </div>
        {recipient.sizes.shoe && (
          <div className="text-center">
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wide">Shoe</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">
              {recipient.sizes.shoe}
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      {recipient.notes && (
        <p className="text-xs text-[#5A5A5A] leading-relaxed mb-4 italic">
          {recipient.notes}
        </p>
      )}

      {/* Last order */}
      {recipient.last_order_date && (
        <p className="text-xs text-[#9A9A9A] mb-4">
          Last ordered: {new Date(recipient.last_order_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}

      {/* Quick reorder */}
      {recipient.saved_items.length > 0 ? (
        <button
          onClick={handleQuickReorder}
          aria-live="polite"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#C29E5F] text-[#C29E5F] text-sm font-medium hover:bg-[#C29E5F]/8 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          {reorderDone ? (
            <>
              <RotateCcw size={14} aria-hidden="true" />
              Added to cart
            </>
          ) : (
            <>
              <ShoppingCart size={14} aria-hidden="true" />
              Quick reorder ({recipient.saved_items.length}{" "}
              {recipient.saved_items.length === 1 ? "item" : "items"})
            </>
          )}
        </button>
      ) : (
        <p className="text-xs text-[#9A9A9A] text-center py-2">
          No saved items yet. Add items to enable quick reorder.
        </p>
      )}

      <AddRecipientModal
        open={editOpen}
        initial={recipient}
        onSave={(updated) => {
          onUpdate(updated);
          setEditOpen(false);
        }}
        onClose={() => setEditOpen(false)}
      />
    </article>
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/account/RecipientCard.tsx
git commit -m "feat: add RecipientCard with quick reorder via Zustand cart"
```

---

### Task 12: Caregiver dashboard page

**Files:**
- Create: `src/app/account/caregiver/page.tsx`

- [ ] **Step 1: Create the dashboard page**

```tsx
// src/app/account/caregiver/page.tsx
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { CaregiverDashboardClient } from "@/components/account/CaregiverDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care recipients | Tempo",
};

export default async function CaregiverPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account/caregiver");

  if (profile.account_type === "individual") {
    redirect("/account");
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-2">
        Care recipients
      </h1>
      <p className="text-sm text-[#5A5A5A] mb-8">
        Manage recipient profiles, sizes, and quick reorder shortcuts.
      </p>
      <CaregiverDashboardClient
        initialRecipients={profile.care_recipients}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create the client dashboard component**

```tsx
// src/components/account/CaregiverDashboardClient.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Users } from "lucide-react";
import { updateCareRecipients } from "@/app/actions/account";
import { RecipientCard } from "./RecipientCard";
import { AddRecipientModal } from "./AddRecipientModal";
import type { CareRecipient } from "@/lib/types/account";

interface Props {
  initialRecipients: CareRecipient[];
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function CaregiverDashboardClient({ initialRecipients }: Props) {
  const [recipients, setRecipients] = useState<CareRecipient[]>(initialRecipients);
  const [addOpen, setAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function persist(next: CareRecipient[]) {
    setRecipients(next);
    setError("");
    startTransition(async () => {
      const result = await updateCareRecipients(next);
      if (!result.success) setError(result.error ?? "Failed to save");
    });
  }

  function handleAdd(recipient: CareRecipient) {
    persist([...recipients, { ...recipient, id: recipient.id || generateId() }]);
    setAddOpen(false);
  }

  function handleUpdate(updated: CareRecipient) {
    persist(recipients.map((r) => (r.id === updated.id ? updated : r)));
  }

  function handleDelete(id: string) {
    persist(recipients.filter((r) => r.id !== id));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#5A5A5A]">
          {recipients.length === 0
            ? "No recipients yet."
            : `${recipients.length} recipient${recipients.length > 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <Plus size={14} aria-hidden="true" />
          Add recipient
        </button>
      </div>

      {recipients.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#D4C9BA] rounded-2xl">
          <Users
            size={36}
            className="text-[#D4C9BA] mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="text-sm text-[#5A5A5A] mb-4">
            Add a care recipient to manage their sizes and enable quick reorder.
          </p>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C29E5F] text-white text-sm font-medium hover:bg-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <Plus size={14} aria-hidden="true" />
            Add first recipient
          </button>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4" aria-label="Care recipient roster">
          {recipients.map((r) => (
            <li key={r.id}>
              <RecipientCard
                recipient={r}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      {isPending && (
        <p className="text-xs text-[#9A9A9A] mt-4" aria-live="polite">
          Saving...
        </p>
      )}
      {error && (
        <p className="text-sm text-[#C4725A] mt-4" role="alert">
          {error}
        </p>
      )}

      <AddRecipientModal
        open={addOpen}
        onSave={handleAdd}
        onClose={() => setAddOpen(false)}
      />
    </>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/account/caregiver/page.tsx src/components/account/CaregiverDashboardClient.tsx
git commit -m "feat: add /account/caregiver dashboard with recipient roster and quick reorder"
```

---

### Task 13: GDPR export API route

**Files:**
- Create: `src/app/api/account/export/route.ts`

- [ ] **Step 1: Create the export route**

```typescript
// src/app/api/account/export/route.ts
import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const admin = createServiceClient();

  const [profileRes, eventsRes, redemptionsRes, conversationsRes] =
    await Promise.all([
      admin.from("profiles").select("*").eq("id", user.id).single(),
      admin
        .from("point_events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      admin
        .from("redemptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      admin
        .from("fit_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    profile: profileRes.data,
    point_events: eventsRes.data ?? [],
    redemptions: redemptionsRes.data ?? [],
    fit_conversations: conversationsRes.data ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="tempo-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
```

- [ ] **Step 2: Verify**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/account/export/route.ts
git commit -m "feat: add GDPR data export API route (JSON download)"
```

---

### Task 14: Account settings page

**Files:**
- Create: `src/app/account/settings/page.tsx`

- [ ] **Step 1: Create the settings page**

```tsx
// src/app/account/settings/page.tsx
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { SettingsClient } from "@/components/account/SettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account settings | Tempo",
};

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account/settings");

  return (
    <div className="max-w-2xl">
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-8">
        Account settings
      </h1>
      <SettingsClient profile={profile} />
    </div>
  );
}
```

- [ ] **Step 2: Create SettingsClient**

```tsx
// src/components/account/SettingsClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, softDeleteAccount } from "@/app/actions/account";
import type { Profile } from "@/lib/types/account";
import { Download, Trash2 } from "lucide-react";

interface Props {
  profile: Profile;
}

export function SettingsClient({ profile }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [marketing, setMarketing] = useState(
    profile.email_preferences.marketing
  );
  const [orderUpdates, setOrderUpdates] = useState(
    profile.email_preferences.order_updates
  );
  const [pointAlerts, setPointAlerts] = useState(
    profile.email_preferences.point_alerts
  );
  const [publicLeaderboard, setPublicLeaderboard] = useState(
    profile.public_leaderboard
  );
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaved(false);
    setProfileError("");
    startTransition(async () => {
      const result = await updateProfile({
        display_name: displayName.trim() || undefined,
        email_preferences: {
          marketing,
          order_updates: orderUpdates,
          point_alerts: pointAlerts,
        },
        public_leaderboard: publicLeaderboard,
      });
      if (result.success) {
        setProfileSaved(true);
      } else {
        setProfileError(result.error ?? "Failed to save");
      }
    });
  }

  function handleDelete() {
    if (deleteConfirm !== "delete my account") {
      setDeleteError('Type "delete my account" to confirm.');
      return;
    }
    setDeleteError("");
    startDeleteTransition(async () => {
      const result = await softDeleteAccount();
      if (result.success) {
        router.push("/?deleted=1");
      } else {
        setDeleteError(result.error ?? "Failed to delete account");
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Profile form */}
      <section aria-labelledby="profile-settings-heading">
        <h2
          id="profile-settings-heading"
          className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
        >
          Profile
        </h2>
        <form
          onSubmit={(e) => void handleSaveProfile(e)}
          className="flex flex-col gap-5"
        >
          <div>
            <label
              htmlFor="display-name"
              className="block text-sm font-medium text-[#1A1A1A] mb-1"
            >
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you appear on the leaderboard"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">
              Email address
            </p>
            <p className="text-sm text-[#5A5A5A]">{profile.email}</p>
            <p className="text-xs text-[#9A9A9A] mt-1">
              To change your email, contact{" "}
              <a
                href="mailto:hello@tempo.style"
                className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                hello@tempo.style
              </a>
              .
            </p>
          </div>

          {/* Email preferences */}
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-[#1A1A1A] mb-1">
              Email preferences
            </legend>
            {[
              {
                id: "email-marketing",
                label: "Marketing and new arrivals",
                value: marketing,
                onChange: setMarketing,
              },
              {
                id: "email-orders",
                label: "Order confirmations and updates",
                value: orderUpdates,
                onChange: setOrderUpdates,
              },
              {
                id: "email-points",
                label: "TempoPoints alerts",
                value: pointAlerts,
                onChange: setPointAlerts,
              },
            ].map(({ id, label, value, onChange }) => (
              <label key={id} className="flex items-center gap-3 cursor-pointer">
                <input
                  id={id}
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
                />
                <span className="text-sm text-[#1A1A1A]">{label}</span>
              </label>
            ))}
          </fieldset>

          {/* Leaderboard privacy */}
          <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl px-4 py-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="leaderboard-public"
                type="checkbox"
                checked={publicLeaderboard}
                onChange={(e) => setPublicLeaderboard(e.target.checked)}
                className="mt-0.5 rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
              />
              <span>
                <span className="block text-sm font-medium text-[#1A1A1A]">
                  Show me on the TempoPoints leaderboard
                </span>
                <span className="block text-xs text-[#5A5A5A] mt-0.5">
                  Your display name and tier will appear publicly. Your email and
                  order history are never shown.
                </span>
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save settings"}
            </button>
            {profileSaved && (
              <p className="text-sm text-[#7A8B75]" role="status" aria-live="polite">
                Saved
              </p>
            )}
            {profileError && (
              <p className="text-sm text-[#C4725A]" role="alert">
                {profileError}
              </p>
            )}
          </div>
        </form>
      </section>

      {/* Data export */}
      <section
        aria-labelledby="export-heading"
        className="border-t border-[#D4C9BA] pt-8"
      >
        <h2
          id="export-heading"
          className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-3"
        >
          Your data
        </h2>
        <p className="text-sm text-[#5A5A5A] mb-4">
          Download a copy of all your Tempo data: profile, points history, orders,
          and fit conversations.
        </p>
        <a
          href="/api/account/export"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#D4C9BA] text-[#1A1A1A] text-sm font-medium hover:bg-[#E8DFD2] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <Download size={14} aria-hidden="true" />
          Download my data (JSON)
        </a>
      </section>

      {/* Account deletion */}
      <section
        aria-labelledby="delete-heading"
        className="border-t border-[#D4C9BA] pt-8"
      >
        <h2
          id="delete-heading"
          className="text-xs font-semibold text-[#C4725A] uppercase tracking-widest mb-3"
        >
          Delete account
        </h2>
        <p className="text-sm text-[#5A5A5A] mb-4">
          Your account will be soft-deleted. You have 30 days to restore it by
          signing in again. After 30 days, your data is permanently removed.
        </p>
        <div className="bg-[#FAFAF7] border border-[#C4725A]/30 rounded-xl px-4 py-4 flex flex-col gap-3">
          <label
            htmlFor="delete-confirm"
            className="block text-sm font-medium text-[#1A1A1A]"
          >
            Type{" "}
            <code className="text-[#C4725A] bg-[#C4725A]/8 px-1 py-0.5 rounded text-xs">
              delete my account
            </code>{" "}
            to confirm
          </label>
          <input
            id="delete-confirm"
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="delete my account"
            className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4725A]"
            aria-describedby={deleteError ? "delete-error" : undefined}
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || deleteConfirm !== "delete my account"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C4725A] text-white text-sm font-medium hover:bg-[#a85a44] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4725A] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} aria-hidden="true" />
            {isDeleting ? "Deleting..." : "Delete my account"}
          </button>
          {deleteError && (
            <p id="delete-error" className="text-sm text-[#C4725A]" role="alert">
              {deleteError}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/account/settings/page.tsx src/components/account/SettingsClient.tsx
git commit -m "feat: add /account/settings with display name, email prefs, privacy, export, delete"
```

---

### Task 15: Header auth link

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Read the current Header**

Read `src/components/layout/Header.tsx` to find where `PointsBadge` is rendered. The auth link should appear in the same area.

- [ ] **Step 2: Add server-side auth state import**

The `Header` is currently a server component (or mixed). Add a check for the current user to decide whether to show "Sign in" or "Account."

In `src/components/layout/Header.tsx`, locate the imports at the top and the JSX section that renders the right-side nav buttons. The current code renders `<PointsBadge />` and `<CartIcon />`.

Add a "Sign in" / "Account" link by fetching the user in the Header. If the Header is a server component, do:

```tsx
// At the top of the file, add the import:
import { createClient } from "@/lib/supabase/server";
import Link from "next/link"; // (already imported)

// Inside the server component, before return:
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

Then in the JSX where the right-side nav items are rendered, add the auth link:

```tsx
{user ? (
  <Link
    href="/account"
    className="hidden md:inline-flex items-center text-sm font-medium text-[#1A1A1A] hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded px-2 py-1"
  >
    Account
  </Link>
) : (
  <Link
    href="/login"
    className="hidden md:inline-flex items-center text-sm font-medium text-[#1A1A1A] hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded px-2 py-1"
  >
    Sign in
  </Link>
)}
```

- [ ] **Step 3: Read and update the actual file**

Read the full `src/components/layout/Header.tsx` then apply the two changes: (1) import `createClient`, (2) add the auth link in the right position in the JSX.

- [ ] **Step 4: Verify**

```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add Sign in / Account link to header nav"
```

---

### Task 16: Final build verification

- [ ] **Step 1: Run full verification**

```bash
pnpm lint && pnpm tsc --noEmit && pnpm build
```

Expected: "Compiled successfully", all routes listed including `/account`, `/account/caregiver`, `/account/settings`, `/login`.

- [ ] **Step 2: Manual verification — individual account**

  a. Go to `/login`, enter an email, click "Send magic link."
  b. Click the magic link in email. Confirm redirect to `/account`.
  c. Select "Individual" account type. Confirm it auto-saves.
  d. Fill in sizes (Top: M, Bottom: L), check "Arthritis," add a fit note. Click "Save fit profile." Confirm "Saved" appears.
  e. Go to `/account/settings`. Change display name. Click "Save settings." Confirm "Saved."
  f. Confirm "Show me on the TempoPoints leaderboard" toggle is unchecked by default.

- [ ] **Step 3: Manual verification — caregiver account with 2 recipients**

  a. In a private browser window (data isolation), go to `/login` with a different email.
  b. After sign-in, go to `/account`. Select "Caregiver."
  c. Click "Add recipient." Fill in: Name "Margaret K.", Top M, Bottom L, Arthritis. Save.
  d. Click "Add recipient" again. Fill in: Name "James P.", Top L, Bottom XL, Post-stroke. Save.
  e. Confirm both appear in the list on `/account`.
  f. Go to `/account/caregiver`. Confirm both recipient cards are shown.
  g. Confirm quick reorder button shows "No saved items yet" (no saved items added yet).

- [ ] **Step 4: Manual verification — data isolation**

  a. Open Supabase table editor, `profiles` table.
  b. Confirm individual account has `account_type = 'individual'` and `care_recipients = []`.
  c. Confirm caregiver account has `account_type = 'caregiver'` and `care_recipients` array with 2 objects.
  d. Confirm each row only shows its own data (RLS enforced).

- [ ] **Step 5: Manual verification — quick reorder**

  a. On the caregiver account, go to `/account/caregiver`.
  b. Click Edit on "Margaret K."
  c. The current modal doesn't have a "save items" UI — quick reorder will show "No saved items yet." This is correct; saving items to a recipient is a future enhancement (users will add items during/after checkout). The quick reorder infrastructure is wired and ready.

- [ ] **Step 6: Manual verification — account deletion**

  a. In `/account/settings`, scroll to "Delete account."
  b. Type "delete my account" in the confirmation field.
  c. Click "Delete my account."
  d. Confirm redirect to `/?deleted=1`.
  e. Confirm that signing in again within 30 days restores the account (the `deleted_at` column is set but the profile row still exists; the auth callback and `/account` layout do not block restored sessions by default; hard deletion after 30 days is a future cron job).

- [ ] **Step 7: Commit**

  No code changes in this task — just verification. If any bugs were found and fixed, commit them:

```bash
git add -p  # stage only bug fixes
git commit -m "fix: [description of any bugs found during verification]"
```

---

## Spec coverage self-review

| Requirement | Task(s) |
|---|---|
| `account_type` + `care_recipients` columns | Task 1 |
| Magic-link auth at `/login` | Task 4 |
| Account type selector | Task 6 |
| Individual onboarding (sizes, conditions, fit prefs) | Task 7 |
| Caregiver onboarding (add recipients, sizes, conditions) | Task 8, 9 |
| Agency onboarding (facility name, bulk prefs, net-30) | Task 9 |
| Caregiver dashboard at `/account/caregiver` | Task 12 |
| Recipient cards: size history, last order, notes | Task 11 |
| Quick reorder shortcuts | Task 11 |
| Display name + email settings | Task 14 |
| Leaderboard privacy toggle | Task 14 |
| GDPR data export | Task 13, 14 |
| Soft delete (30-day recovery) | Task 3, 14 |
| Header auth link | Task 15 |
| Full build verification | Task 16 |
