# TempoPoints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sustainability-weighted loyalty program backed by Supabase, with magic-link auth, guest-mode point queuing, and a full rewards dashboard.

**Architecture:** Server actions (service-role writes, user-session reads) handle all point mutations. Client components import server actions directly — Next.js 15 serializes the call over the network. Guest events are queued in localStorage and migrated on `SIGNED_IN` auth state change via `GuestPointsTracker` mounted in the root layout.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, @supabase/ssr v0.10, @supabase/supabase-js v2, sonner v2, Tailwind CSS 4, Vitest 4.

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `src/supabase/migrations/0001_tempopoints.sql` | Schema, RLS, trigger, RPC |
| `src/lib/points-catalog.ts` | POINTS_RULES, TIERS, REDEMPTIONS, calcTier, shared types |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server + service-role Supabase clients |
| `middleware.ts` | Session refresh on every request |
| `src/app/auth/callback/route.ts` | Magic-link code exchange |
| `src/app/actions/points.ts` | awardPoints, redeemReward, getPointsBalance, migratePoints |
| `src/components/points/EarnToast.tsx` | showEarnToast() helper |
| `src/components/points/TierProgressBar.tsx` | Presentational progress bar |
| `src/components/points/PointsBadge.tsx` | Self-fetching header badge |
| `src/components/points/AchievementGrid.tsx` | Four milestone badges |
| `src/components/points/GuestPointsTracker.tsx` | localStorage queue + migration on SIGNED_IN |
| `src/components/points/DppScanTracker.tsx` | One-shot passport mount trigger |
| `src/components/points/RedeemButton.tsx` | Client button calling redeemReward |
| `src/components/auth/AuthPrompt.tsx` | Magic-link sign-in form |
| `src/app/rewards/page.tsx` | Full dashboard (auth-gated) |
| `src/app/rewards/leaderboard/page.tsx` | Top-20 Architects opt-in leaderboard |
| `src/app/points/how-it-works/page.tsx` | Static sustainability ethos page |
| `vitest.config.ts` | Vitest path alias config |
| `src/lib/__tests__/points-catalog.test.ts` | calcTier unit tests |

### Modified files
| File | Change |
|---|---|
| `package.json` | Add `"test": "vitest run"` script |
| `src/app/layout.tsx` | Add `<Toaster />`, `<GuestPointsTracker />` |
| `src/components/layout/Header.tsx` | Add `<PointsBadge />` after nav links |
| `src/app/passport/[sku]/page.tsx` | Add `<DppScanTracker />` at page bottom |
| `src/components/product/FitConciergeButton.tsx` | Call awardPoints after stream completes |
| `src/components/tryon/TryOnClient.tsx` | Call awardPoints when stage → "active" |
| `src/components/product/ReviewsTabs.tsx` | Add review submission form with awardPoints |

---

## Task 1: Points catalog, types, and unit tests

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Create: `src/lib/points-catalog.ts`
- Create: `src/lib/__tests__/points-catalog.test.ts`

- [ ] **Step 1.1: Add vitest config**

Create `vitest.config.ts` at project root:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 1.2: Add test script to package.json**

In `package.json`, inside `"scripts"`, add after the `"lint"` entry:

```json
"test": "vitest run"
```

- [ ] **Step 1.3: Create points catalog**

Create `src/lib/points-catalog.ts`:

```ts
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
  event_type: string;
  points: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Redemption {
  id: string;
  reward_type: string;
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
```

- [ ] **Step 1.4: Write failing unit tests**

Create `src/lib/__tests__/points-catalog.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calcTier } from "../points-catalog";

describe("calcTier", () => {
  it("returns Advocate for 0 points", () => {
    expect(calcTier(0)).toBe("Advocate");
  });
  it("returns Advocate for 1 point", () => {
    expect(calcTier(1)).toBe("Advocate");
  });
  it("returns Advocate for 1499 points", () => {
    expect(calcTier(1499)).toBe("Advocate");
  });
  it("returns Advisor for exactly 1500 points", () => {
    expect(calcTier(1500)).toBe("Advisor");
  });
  it("returns Advisor for 4999 points", () => {
    expect(calcTier(4999)).toBe("Advisor");
  });
  it("returns Architect for exactly 5000 points", () => {
    expect(calcTier(5000)).toBe("Architect");
  });
  it("returns Architect for very large numbers", () => {
    expect(calcTier(999999)).toBe("Architect");
  });
});
```

- [ ] **Step 1.5: Run tests (they will fail until catalog is saved correctly)**

```
pnpm test
```

Expected: 7 passing tests.

- [ ] **Step 1.6: Commit**

```bash
git add vitest.config.ts package.json src/lib/points-catalog.ts src/lib/__tests__/points-catalog.test.ts
git commit -m "feat: add points catalog, types, and calcTier unit tests"
```

---

## Task 2: Supabase migration SQL

**Files:**
- Create: `src/supabase/migrations/0001_tempopoints.sql`

- [ ] **Step 2.1: Create migration file**

Create `src/supabase/migrations/0001_tempopoints.sql`:

```sql
-- Profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  tier text default 'Advocate' check (tier in ('Advocate', 'Advisor', 'Architect')),
  points integer default 0,
  caregiver_mode boolean default false,
  public_leaderboard boolean default false,
  created_at timestamptz default now()
);

-- Point events
create table public.point_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  event_type text not null,
  points integer not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Unique partial index: one scan_dpp award per user per SKU
create unique index point_events_scan_dpp_unique
  on public.point_events (user_id, (metadata->>'sku'))
  where event_type = 'scan_dpp';

-- Redemptions
create table public.redemptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  reward_type text not null,
  points_spent integer not null,
  fulfilled boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.point_events enable row level security;
alter table public.redemptions enable row level security;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users read own events"
  on public.point_events for select using (auth.uid() = user_id);
create policy "Users read own redemptions"
  on public.redemptions for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic point decrement for redemptions (prevents double-spend)
create or replace function public.decrement_points_if_sufficient(
  p_user_id uuid,
  p_amount integer
) returns boolean
language plpgsql
security definer
as $$
declare
  current_points integer;
begin
  select points into current_points
  from public.profiles
  where id = p_user_id
  for update;

  if current_points is null or current_points < p_amount then
    return false;
  end if;

  update public.profiles
    set points = points - p_amount
    where id = p_user_id;

  return true;
end;
$$;
```

- [ ] **Step 2.2: Apply migration to your Supabase project**

Open the Supabase dashboard → SQL editor, paste the file contents, and run. Verify the three tables, trigger, and RPC function appear in the Table Editor / Functions panels.

- [ ] **Step 2.3: Commit**

```bash
git add src/supabase/migrations/0001_tempopoints.sql
git commit -m "feat: add Supabase migration for TempoPoints schema"
```

---

## Task 3: Supabase client utilities and session middleware

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `middleware.ts`

- [ ] **Step 3.1: Create browser client**

Create `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3.2: Create server client (user-session + service-role)**

Create `src/lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component context — cookies are read-only; ignore
          }
        },
      },
    }
  );
}

export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
    }
  );
}
```

- [ ] **Step 3.3: Create session refresh middleware**

Create `middleware.ts` at the project root (same level as `package.json`):

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session cookie — must be called on every request
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 3.4: Verify typecheck passes**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3.5: Commit**

```bash
git add src/lib/supabase/client.ts src/lib/supabase/server.ts middleware.ts
git commit -m "feat: add Supabase client utilities and session middleware"
```

---

## Task 4: Auth callback route

**Files:**
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 4.1: Create magic-link callback handler**

Create `src/app/auth/callback/route.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/rewards";

  if (!code) {
    return NextResponse.redirect(`${origin}/rewards?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/rewards?error=auth_error`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
```

- [ ] **Step 4.2: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4.3: Commit**

```bash
git add src/app/auth/callback/route.ts
git commit -m "feat: add magic-link auth callback route"
```

---

## Task 5: Server actions

**Files:**
- Create: `src/app/actions/points.ts`

- [ ] **Step 5.1: Create server actions file**

Create `src/app/actions/points.ts`:

```ts
"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  calcTier,
  type PointsEventType,
  type TierName,
  type PointsBalance,
  type GuestEvent,
} from "@/lib/points-catalog";

export interface AwardResult {
  success: boolean;
  newTotal?: number;
  tier?: TierName;
  tierChanged?: boolean;
  skipped?: boolean;
  error?: string;
}

export async function awardPoints(
  eventType: PointsEventType,
  points: number,
  metadata?: Record<string, unknown>
): Promise<AwardResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();

  // Idempotency: one scan_dpp award per user per SKU
  if (eventType === "scan_dpp" && metadata?.sku) {
    const { count } = await admin
      .from("point_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("event_type", "scan_dpp")
      .contains("metadata", { sku: metadata.sku });
    if ((count ?? 0) > 0) return { success: true, skipped: true };
  }

  const { error: insertError } = await admin.from("point_events").insert({
    user_id: user.id,
    event_type: eventType,
    points,
    metadata: metadata ?? null,
  });
  if (insertError) return { success: false, error: insertError.message };

  const { data: profile } = await admin
    .from("profiles")
    .select("points, tier")
    .eq("id", user.id)
    .single();

  const oldTotal = profile?.points ?? 0;
  const newTotal = oldTotal + points;
  const oldTier = (profile?.tier as TierName) ?? "Advocate";
  const newTier = calcTier(newTotal);

  await admin
    .from("profiles")
    .update({ points: newTotal, tier: newTier })
    .eq("id", user.id);

  return {
    success: true,
    newTotal,
    tier: newTier,
    tierChanged: newTier !== oldTier,
  };
}

export async function redeemReward(
  rewardType: string,
  pointsSpent: number
): Promise<{ success: boolean; newTotal?: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "unauthenticated" };

  const admin = createServiceClient();

  const { data: sufficient } = await admin.rpc(
    "decrement_points_if_sufficient",
    { p_user_id: user.id, p_amount: pointsSpent }
  );

  if (!sufficient) return { success: false, error: "insufficient_points" };

  await admin.from("redemptions").insert({
    user_id: user.id,
    reward_type: rewardType,
    points_spent: pointsSpent,
  });

  const { data: profile } = await admin
    .from("profiles")
    .select("points")
    .eq("id", user.id)
    .single();

  return { success: true, newTotal: profile?.points ?? 0 };
}

export async function getPointsBalance(): Promise<PointsBalance | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, eventsRes, redemptionsRes, dppRes, reviewRes, takebackRes, referralRes] =
    await Promise.all([
      supabase.from("profiles").select("points, tier").eq("id", user.id).single(),
      supabase
        .from("point_events")
        .select("id, event_type, points, metadata, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("redemptions")
        .select("id, reward_type, points_spent, fulfilled, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("event_type", "scan_dpp"),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("event_type", ["write_wearer_review", "write_caregiver_review"]),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("event_type", "take_back_return"),
      supabase
        .from("point_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("event_type", "refer_caregiver"),
    ]);

  if (!profileRes.data) return null;

  return {
    points: profileRes.data.points,
    tier: profileRes.data.tier as TierName,
    recentEvents: eventsRes.data ?? [],
    redemptions: redemptionsRes.data ?? [],
    achievements: {
      first_dpp_scan: (dppRes.count ?? 0) > 0,
      first_review: (reviewRes.count ?? 0) > 0,
      first_takeback: (takebackRes.count ?? 0) > 0,
      ten_caregiver_referrals: (referralRes.count ?? 0) >= 10,
    },
  };
}

export async function migratePoints(
  guestEvents: GuestEvent[]
): Promise<{ migrated: number }> {
  let migrated = 0;
  for (const event of guestEvents) {
    const result = await awardPoints(
      event.eventType,
      event.points,
      event.metadata
    );
    if (result.success && !result.skipped) migrated++;
  }
  return { migrated };
}
```

- [ ] **Step 5.2: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5.3: Commit**

```bash
git add src/app/actions/points.ts
git commit -m "feat: add server actions for TempoPoints (award, redeem, balance, migrate)"
```

---

## Task 6: EarnToast and TierProgressBar

**Files:**
- Create: `src/components/points/EarnToast.tsx`
- Create: `src/components/points/TierProgressBar.tsx`

- [ ] **Step 6.1: Create EarnToast helper**

Create `src/components/points/EarnToast.tsx`:

```tsx
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
```

- [ ] **Step 6.2: Create TierProgressBar**

Create `src/components/points/TierProgressBar.tsx`:

```tsx
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
```

- [ ] **Step 6.3: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6.4: Commit**

```bash
git add src/components/points/EarnToast.tsx src/components/points/TierProgressBar.tsx
git commit -m "feat: add EarnToast helper and TierProgressBar component"
```

---

## Task 7: PointsBadge

**Files:**
- Create: `src/components/points/PointsBadge.tsx`

- [ ] **Step 7.1: Create PointsBadge**

Create `src/components/points/PointsBadge.tsx`:

```tsx
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
```

- [ ] **Step 7.2: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7.3: Commit**

```bash
git add src/components/points/PointsBadge.tsx
git commit -m "feat: add PointsBadge header component"
```

---

## Task 8: AchievementGrid

**Files:**
- Create: `src/components/points/AchievementGrid.tsx`

- [ ] **Step 8.1: Create AchievementGrid**

Create `src/components/points/AchievementGrid.tsx`:

```tsx
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
```

- [ ] **Step 8.2: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8.3: Commit**

```bash
git add src/components/points/AchievementGrid.tsx
git commit -m "feat: add AchievementGrid component"
```

---

## Task 9: GuestPointsTracker, DppScanTracker

**Files:**
- Create: `src/components/points/GuestPointsTracker.tsx`
- Create: `src/components/points/DppScanTracker.tsx`

- [ ] **Step 9.1: Create GuestPointsTracker**

Create `src/components/points/GuestPointsTracker.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { migratePoints } from "@/app/actions/points";
import type { GuestEvent, PointsEventType } from "@/lib/points-catalog";

const GUEST_ID_KEY = "tempo_guest_id";
const GUEST_EVENTS_KEY = "tempo_guest_events";

export function queueGuestEvent(
  eventType: PointsEventType,
  points: number,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(GUEST_EVENTS_KEY);
  const events: GuestEvent[] = raw ? (JSON.parse(raw) as GuestEvent[]) : [];
  events.push({ eventType, points, metadata, queuedAt: new Date().toISOString() });
  localStorage.setItem(GUEST_EVENTS_KEY, JSON.stringify(events));
}

export function GuestPointsTracker() {
  useEffect(() => {
    if (!localStorage.getItem(GUEST_ID_KEY)) {
      localStorage.setItem(GUEST_ID_KEY, crypto.randomUUID());
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event !== "SIGNED_IN") return;
      const raw = localStorage.getItem(GUEST_EVENTS_KEY);
      if (!raw) return;
      const events: GuestEvent[] = JSON.parse(raw) as GuestEvent[];
      if (events.length === 0) return;
      await migratePoints(events);
      localStorage.removeItem(GUEST_EVENTS_KEY);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
```

- [ ] **Step 9.2: Create DppScanTracker**

Create `src/components/points/DppScanTracker.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { awardPoints } from "@/app/actions/points";
import { queueGuestEvent } from "./GuestPointsTracker";
import { showEarnToast, showTierUpToast } from "./EarnToast";

interface DppScanTrackerProps {
  sku: string;
  productName: string;
}

export function DppScanTracker({ sku, productName }: DppScanTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        queueGuestEvent("scan_dpp", 100, { sku });
        return;
      }

      const result = await awardPoints("scan_dpp", 100, { sku });
      if (result.success && !result.skipped) {
        showEarnToast(100, `Scanned ${productName} passport`);
        if (result.tierChanged && result.tier) {
          showTierUpToast(result.tier);
        }
      }
    })();
  }, [sku, productName]);

  return null;
}
```

- [ ] **Step 9.3: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9.4: Commit**

```bash
git add src/components/points/GuestPointsTracker.tsx src/components/points/DppScanTracker.tsx
git commit -m "feat: add GuestPointsTracker (localStorage queue + migration) and DppScanTracker"
```

---

## Task 10: AuthPrompt and RedeemButton

**Files:**
- Create: `src/components/auth/AuthPrompt.tsx`
- Create: `src/components/points/RedeemButton.tsx`

- [ ] **Step 10.1: Create AuthPrompt**

Create `src/components/auth/AuthPrompt.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthPrompt() {
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-3">
          Check your email
        </p>
        <p className="text-[#5A5A5A] text-sm">
          A sign-in link has been sent to{" "}
          <strong className="text-[#1A1A1A]">{email}</strong>. Click it to
          access your rewards.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-2">
        TempoPoints
      </h1>
      <p className="text-[#5A5A5A] mb-8 text-sm leading-relaxed">
        Sign in to track your sustainability impact, earn points, and redeem rewards. We use
        magic links, no password required.
      </p>
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="auth-email"
            className="block text-sm font-medium text-[#1A1A1A] mb-2"
          >
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 rounded-lg bg-[#C29E5F] text-white font-medium text-sm hover:bg-[#a8874f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending link..." : "Send magic link"}
        </button>
        {error && (
          <p className="text-sm text-[#C4725A]" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
```

- [ ] **Step 10.2: Create RedeemButton**

Create `src/components/points/RedeemButton.tsx`:

```tsx
"use client";

import { useState } from "react";
import { redeemReward } from "@/app/actions/points";
import { showEarnToast } from "./EarnToast";
import { toast } from "sonner";

interface RedeemButtonProps {
  rewardType: string;
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
      toast(`Redeemed: ${label}`, {
        description: `${cost.toLocaleString()} points spent. New balance: ${result.newTotal.toLocaleString()}`,
        duration: 5000,
      });
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
      className="text-xs font-medium px-3 py-1.5 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed bg-[#7A8B75] border-[#7A8B75] text-white hover:bg-[#6a7a65] disabled:bg-[#D4C9BA] disabled:border-[#D4C9BA] disabled:text-[#5A5A5A]"
    >
      {loading ? "Claiming..." : "Claim"}
    </button>
  );
}
```

- [ ] **Step 10.3: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10.4: Commit**

```bash
git add src/components/auth/AuthPrompt.tsx src/components/points/RedeemButton.tsx
git commit -m "feat: add AuthPrompt (magic link) and RedeemButton components"
```

---

## Task 11: /rewards page

**Files:**
- Create: `src/app/rewards/page.tsx`

- [ ] **Step 11.1: Create rewards page**

Create `src/app/rewards/page.tsx`:

```tsx
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
  ar_tryon_session: "AR try-on session",
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

export default function RewardsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<PointsBalance | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user);
      if (user) {
        getPointsBalance().then(setBalance).catch(() => null);
      }
    }).catch(() => setAuthed(false));
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
        <p className="text-[#5A5A5A] text-sm animate-pulse">Loading your rewards...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">

        {/* Balance + tier */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-1">
              TempoPoints
            </h1>
            <p className="text-[#5A5A5A] text-sm">
              Every point you earn maps to a sustainability or community action.
            </p>
          </div>
          <div className="text-right shrink-0">
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

        {/* Tier progress */}
        <section className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6" aria-labelledby="tier-progress-heading">
          <h2 id="tier-progress-heading" className="text-sm font-semibold text-[#1A1A1A] mb-4">
            Tier progress
          </h2>
          <TierProgressBar points={balance.points} tier={balance.tier} />
          <ul className="mt-4 space-y-1">
            {TIERS[balance.tier].perks.map((perk) => (
              <li key={perk} className="text-xs text-[#5A5A5A] flex items-center gap-1.5">
                <span className="text-[#7A8B75]" aria-hidden="true">✓</span>
                {perk}
              </li>
            ))}
          </ul>
        </section>

        {/* Recent activity */}
        <section aria-labelledby="activity-heading">
          <h2 id="activity-heading" className="font-playfair text-xl font-bold text-[#1A1A1A] mb-4">
            Recent activity
          </h2>
          {balance.recentEvents.length === 0 ? (
            <p className="text-sm text-[#5A5A5A] italic">
              No activity yet. Scan a passport or try on a garment to earn your first points.
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
                    <p className="text-xs text-[#5A5A5A]">{formatDate(event.created_at)}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#C29E5F]">
                    +{event.points}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Redemption catalog */}
        <section aria-labelledby="redeem-heading">
          <h2 id="redeem-heading" className="font-playfair text-xl font-bold text-[#1A1A1A] mb-4">
            Redeem rewards
          </h2>
          <ul className="flex flex-col gap-3" role="list" aria-label="Available rewards">
            {REDEMPTIONS.map((reward) => (
              <li
                key={reward.id}
                className="flex items-center justify-between bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{reward.label}</p>
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

        {/* Achievements */}
        <AchievementGrid achievements={balance.achievements} />

        {/* Footer links */}
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
```

- [ ] **Step 11.2: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11.3: Commit**

```bash
git add src/app/rewards/page.tsx
git commit -m "feat: add /rewards dashboard page"
```

---

## Task 12: Leaderboard and how-it-works pages

**Files:**
- Create: `src/app/rewards/leaderboard/page.tsx`
- Create: `src/app/points/how-it-works/page.tsx`

- [ ] **Step 12.1: Create leaderboard page**

Create `src/app/rewards/leaderboard/page.tsx`:

```tsx
import Link from "next/link";
import { Trophy } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Community Leaderboard — TempoPoints",
};

export default async function LeaderboardPage() {
  const admin = createServiceClient();
  const { data: leaders } = await admin
    .from("profiles")
    .select("display_name, points")
    .eq("tier", "Architect")
    .eq("public_leaderboard", true)
    .order("points", { ascending: false })
    .limit(20);

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-[#5A5A5A] mb-8">
          <Link href="/rewards" className="hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded">
            Rewards
          </Link>
          {" / "}
          <span className="text-[#1A1A1A]">Leaderboard</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-7 w-7 text-[#C4725A]" aria-hidden="true" />
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A]">
            Architect Leaderboard
          </h1>
        </div>

        <p className="text-sm text-[#5A5A5A] mb-8 leading-relaxed">
          Top 20 community members who have opted in to public recognition. Opt in from your rewards settings. Only display name and points are shown, never email.
        </p>

        {!leaders || leaders.length === 0 ? (
          <p className="text-sm text-[#5A5A5A] italic">
            No Architects have opted in yet. Be the first.
          </p>
        ) : (
          <ol className="flex flex-col gap-3" aria-label="Top 20 Architects by points">
            {leaders.map((leader, idx) => (
              <li
                key={`${leader.display_name}-${idx}`}
                className="flex items-center gap-4 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl px-5 py-4"
              >
                <span
                  className="text-lg font-bold tabular-nums text-[#C4725A] w-8 shrink-0"
                  aria-label={`Rank ${idx + 1}`}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-[#1A1A1A]">
                  {leader.display_name ?? "Anonymous"}
                </span>
                <span className="text-sm font-semibold text-[#C29E5F] tabular-nums">
                  {leader.points.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 12.2: Create how-it-works page**

Create `src/app/points/how-it-works/page.tsx`:

```tsx
import Link from "next/link";

export const metadata = {
  title: "How TempoPoints Work — Tempo",
};

const ACTIONS = [
  {
    event: "Scan a Digital Product Passport",
    points: 100,
    why: "Verifying material origins reduces information asymmetry and pushes brands toward supply-chain transparency. Every scan signals market demand for this data.",
  },
  {
    event: "Complete a Fit Concierge session",
    points: 50,
    why: "Getting fit right the first time reduces returns and the associated transport emissions.",
  },
  {
    event: "AR try-on session",
    points: 75,
    why: "Trying before buying — without physical shipping — is the lowest-emission path to a purchase decision.",
  },
  {
    event: "Submit a wearer or caregiver review",
    points: 250,
    why: "Honest adaptive reviews are rare and disproportionately valuable to other disabled shoppers navigating a market that rarely documents fit for non-normative bodies.",
  },
  {
    event: "Refer a caregiver",
    points: 500,
    why: "Expanding the caregiver network brings more people into a purchasing model that values functional design over aesthetic conformity.",
  },
  {
    event: "Take-Back return",
    points: 1000,
    why: "Returning a garment for recycling or resale is the single highest-impact act in a garment's lifecycle. A 1,000-point award reflects that.",
  },
  {
    event: "Advocacy share",
    points: 150,
    why: "Each share expands the audience for adaptive fashion — building the commercial case that makes continued investment possible.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-[#5A5A5A] mb-8">
          <Link href="/rewards" className="hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded">
            Rewards
          </Link>
          {" / "}
          <span className="text-[#1A1A1A]">How it works</span>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          How TempoPoints work
        </h1>
        <p className="text-[#5A5A5A] leading-relaxed mb-10">
          TempoPoints are not a spending reward. Every action in the catalog maps to a measurable sustainability or community outcome. The point values reflect impact weight, not purchase value.
        </p>

        <ul className="flex flex-col gap-6" role="list">
          {ACTIONS.map((action) => (
            <li
              key={action.event}
              className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-sm font-semibold text-[#1A1A1A]">{action.event}</p>
                <span className="shrink-0 text-sm font-bold text-[#C29E5F]">
                  {action.points} pts
                </span>
              </div>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{action.why}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-6 bg-[#7A8B75]/10 border border-[#7A8B75]/20 rounded-xl">
          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            Point values are reviewed annually by the Tempo advisor board, which includes disabled co-designers and sustainability researchers. Changes are published in the governance report at{" "}
            <Link href="/governance" className="text-[#7A8B75] underline underline-offset-2 hover:text-[#5a6b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded">
              tempo.style/governance
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12.3: Verify typecheck**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12.4: Commit**

```bash
git add src/app/rewards/leaderboard/page.tsx src/app/points/how-it-works/page.tsx
git commit -m "feat: add /rewards/leaderboard and /points/how-it-works pages"
```

---

## Task 13: Layout and Header wiring

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 13.1: Add Toaster and GuestPointsTracker to layout**

In `src/app/layout.tsx`, add these two imports after the existing imports:

```ts
import { Toaster } from "sonner";
import { GuestPointsTracker } from "@/components/points/GuestPointsTracker";
```

Then inside `<body>`, after `<Footer />`:

```tsx
<Toaster position="bottom-right" richColors={false} />
<GuestPointsTracker />
```

The full body becomes:
```tsx
<body className="bg-[#E8DFD2] text-[#1A1A1A] antialiased">
  <Header />
  <main>{children}</main>
  <Footer />
  <VoiceLayer />
  <Toaster position="bottom-right" richColors={false} />
  <GuestPointsTracker />
</body>
```

- [ ] **Step 13.2: Add PointsBadge to Header**

In `src/components/layout/Header.tsx`:

Add this import after the existing imports:
```ts
import { PointsBadge } from "@/components/points/PointsBadge";
```

In the desktop nav `<nav>`, add `<PointsBadge />` between the nav links and the "Shop the collection" button. The nav becomes:

```tsx
<nav
  className="hidden md:flex items-center gap-8"
  aria-label="Primary navigation"
>
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      aria-label={link.ariaLabel}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A] hover:text-[#C29E5F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded px-1"
    >
      {link.label}
      {link.badge && (
        <span className="text-xs bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">
          {link.badge}
        </span>
      )}
    </Link>
  ))}
  <PointsBadge />
  <Link
    href="/shop"
    className="bg-[#7A8B75] text-[#FAFAF7] text-sm font-medium px-4 py-2 rounded hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
  >
    Shop the collection
  </Link>
</nav>
```

- [ ] **Step 13.3: Verify typecheck and lint**

```
npx tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 13.4: Commit**

```bash
git add src/app/layout.tsx src/components/layout/Header.tsx
git commit -m "feat: wire Toaster, GuestPointsTracker, and PointsBadge into layout and header"
```

---

## Task 14: Touchpoint triggers in existing components

**Files:**
- Modify: `src/app/passport/[sku]/page.tsx`
- Modify: `src/components/product/FitConciergeButton.tsx`
- Modify: `src/components/tryon/TryOnClient.tsx`
- Modify: `src/components/product/ReviewsTabs.tsx`

- [ ] **Step 14.1: Add DppScanTracker to passport page**

In `src/app/passport/[sku]/page.tsx`, add this import after the existing imports:
```ts
import { DppScanTracker } from "@/components/points/DppScanTracker";
```

At the very bottom of the returned JSX, before the closing `</div>` of the outermost wrapper, add:

```tsx
<DppScanTracker sku={passport.sku} productName={passport.productName} />
```

The exact location: find the final `</div>` that closes the outermost `<div className="bg-[#E8DFD2] min-h-screen">` (or equivalent) and insert `<DppScanTracker ...>` just before it.

- [ ] **Step 14.2: Award points on Fit Concierge completion**

In `src/components/product/FitConciergeButton.tsx`, add these two new imports after the existing imports:

```ts
import { awardPoints } from "@/app/actions/points";
import { showEarnToast, showTierUpToast } from "@/components/points/EarnToast";
```

In the `handleAsk` function, after the streaming `while (true)` loop completes (just before `} catch`), add:

```ts
// Award points after successful concierge response
const result = await awardPoints("complete_fit_concierge", 50);
if (result.success && !result.skipped) {
  showEarnToast(50, "Used the Fit Concierge");
  if (result.tierChanged && result.tier) showTierUpToast(result.tier);
}
```

The modified `handleAsk` section after the while loop:

```ts
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  fullText += decoder.decode(value, { stream: true });
  setResponse(fullText);
}
// Award points after successful concierge response
const pointResult = await awardPoints("complete_fit_concierge", 50);
if (pointResult.success && !pointResult.skipped) {
  showEarnToast(50, "Used the Fit Concierge");
  if (pointResult.tierChanged && pointResult.tier) showTierUpToast(pointResult.tier);
}
```

- [ ] **Step 14.3: Award points when AR try-on becomes active**

In `src/components/tryon/TryOnClient.tsx`, add these imports at the top:

```ts
import { awardPoints } from "@/app/actions/points";
import { showEarnToast, showTierUpToast } from "@/components/points/EarnToast";
```

In the `handleProceed` callback, after `setStage("active")`, add:

```ts
// Award AR try-on points
awardPoints("ar_tryon_session", 75).then((result) => {
  if (result.success && !result.skipped) {
    showEarnToast(75, "AR try-on session");
    if (result.tierChanged && result.tier) showTierUpToast(result.tier);
  }
}).catch(() => null);
```

The modified `handleProceed`:

```ts
const handleProceed = useCallback(async () => {
  setStage("requesting");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    setStage("active");
    awardPoints("ar_tryon_session", 75).then((result) => {
      if (result.success && !result.skipped) {
        showEarnToast(75, "AR try-on session");
        if (result.tierChanged && result.tier) showTierUpToast(result.tier);
      }
    }).catch(() => null);
  } catch {
    setStage("denied");
  }
}, []);
```

- [ ] **Step 14.4: Add review submission form to ReviewsTabs**

In `src/components/product/ReviewsTabs.tsx`, add these imports:

```ts
import { useState } from "react";
import { awardPoints } from "@/app/actions/points";
import { showEarnToast, showTierUpToast } from "@/components/points/EarnToast";
import { createClient } from "@/lib/supabase/client";
import { queueGuestEvent } from "@/components/points/GuestPointsTracker";
```

Add this new component above the `ReviewsTabs` export:

```tsx
function WriteReviewForm({ type }: { type: "wearer" | "caregiver" }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const eventType =
    type === "wearer" ? "write_wearer_review" : "write_caregiver_review";
  const points = 250;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      queueGuestEvent(eventType, points);
    } else {
      const result = await awardPoints(eventType, points);
      if (result.success && !result.skipped) {
        showEarnToast(points, `Submitted a ${type} review`);
        if (result.tierChanged && result.tier) showTierUpToast(result.tier);
      }
    }
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-[#7A8B75] font-medium mt-4">
        Thank you for your review.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mt-6 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5"
    >
      <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
        Share your experience
      </p>
      <label htmlFor={`review-text-${type}`} className="sr-only">
        Write your {type} review
      </label>
      <textarea
        id={`review-text-${type}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={
          type === "wearer"
            ? "Describe how this garment works for your body and situation."
            : "Describe the experience from a care perspective."
        }
        className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#E8DFD2]/50 text-sm text-[#1A1A1A] placeholder-[#9A9A9A] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
      />
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-[#5A5A5A]">Earns 250 Tempo Points</p>
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="text-xs font-medium px-4 py-2 rounded bg-[#7A8B75] text-white hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </form>
  );
}
```

At the end of the `<TabsContent value="wearer">` div, before its closing tag, add:
```tsx
<WriteReviewForm type="wearer" />
```

At the end of the `<TabsContent value="caregiver">` div, before its closing tag, add:
```tsx
<WriteReviewForm type="caregiver" />
```

- [ ] **Step 14.5: Verify typecheck and lint**

```
npx tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 14.6: Commit**

```bash
git add src/app/passport/\[sku\]/page.tsx src/components/product/FitConciergeButton.tsx src/components/tryon/TryOnClient.tsx src/components/product/ReviewsTabs.tsx
git commit -m "feat: wire TempoPoints event triggers into passport, concierge, try-on, and reviews"
```

---

## Task 15: Final build verification

- [ ] **Step 15.1: Run all checks**

```
pnpm lint && npx tsc --noEmit && pnpm test && pnpm build
```

Expected:
- `pnpm lint` — no errors
- `npx tsc --noEmit` — no errors
- `pnpm test` — 7 calcTier tests passing
- `pnpm build` — clean build, all static params routes resolve

- [ ] **Step 15.2: Manual verification checklist**

With `pnpm dev` running:

1. **Sign up**: Visit `/rewards`. Enter your email. Click "Send magic link". Check inbox, click link. Confirm redirect to `/rewards` and balance shows `0 pts — Advocate`.

2. **Scan DPP + toast**: Visit `/passport/TMP-001`. Within 2 seconds, a dark toast should appear: "+100 Tempo Points: Scanned Seated-Cut Trouser passport". Reload the page — no second toast (idempotency).

3. **Check balance**: Visit `/rewards`. Balance shows `100`. Recent activity shows "Scanned a passport".

4. **Redeem reward**: With 100 points you can't afford anything. In the Supabase dashboard, manually update your profile to `points = 500`. Reload `/rewards`. Click "Claim" on the 500-point Take-Back reward. Toast confirms redemption. Balance drops to 0.

5. **RLS check**: Open a second browser session. Sign in as a different user. Verify you cannot see the first user's events or redemptions (no direct query access — Supabase enforces this via RLS at the API level).

6. **Guest mode**: Sign out. Visit `/passport/TMP-002`. Check `localStorage.tempo_guest_events` in DevTools — should contain one `scan_dpp` entry for TMP-002. Sign in. Verify the event migrates and balance reflects it.

- [ ] **Step 15.3: Final commit**

```bash
git add -A
git commit -m "feat: TempoPoints rewards program complete"
```
