# TempoPoints Design Spec
**Date:** 2026-04-17  
**Status:** Approved  
**Scope:** Sustainability-weighted loyalty program backed by Supabase

---

## 1. Overview

TempoPoints is a loyalty program where every earning action maps to a sustainability or community behavior — scanning a product passport, completing an AR try-on, submitting a wearer review, or returning a garment for Take-Back recycling. Points accumulate toward three tiers with progressively deeper community access. Redemptions fund disability rights donations, unlock co-design credits, and waive shipping on Take-Back returns.

Unauthenticated (guest) users can earn points queued in localStorage and have those events migrated to their account when they sign up. Authentication is Supabase magic link only.

---

## 2. Database Schema

File: `src/supabase/migrations/0001_tempopoints.sql`

### Tables

**`public.profiles`**
| Column | Type | Default | Notes |
|---|---|---|---|
| id | uuid | — | PK, references auth.users |
| email | text | — | |
| display_name | text | — | Used on leaderboard; never email |
| tier | text | 'Advocate' | CHECK in ('Advocate','Advisor','Architect') |
| points | integer | 0 | Running total |
| caregiver_mode | boolean | false | |
| public_leaderboard | boolean | false | Opt-in; required for leaderboard appearance |
| created_at | timestamptz | now() | |

**`public.point_events`**
| Column | Type | Default | Notes |
|---|---|---|---|
| id | uuid | gen_random_uuid() | PK |
| user_id | uuid | — | FK → profiles.id |
| event_type | text | — | NOT NULL |
| points | integer | — | NOT NULL |
| metadata | jsonb | — | e.g. `{ "sku": "TMP-001" }` |
| created_at | timestamptz | now() | |

Unique index: `(user_id, event_type, (metadata->>'sku'))` — enforces one `scan_dpp` award per user per SKU. Partial index (WHERE event_type = 'scan_dpp') keeps it narrow.

**`public.redemptions`**
| Column | Type | Default | Notes |
|---|---|---|---|
| id | uuid | gen_random_uuid() | PK |
| user_id | uuid | — | FK → profiles.id |
| reward_type | text | — | NOT NULL |
| points_spent | integer | — | NOT NULL |
| fulfilled | boolean | false | Set by admin |
| created_at | timestamptz | now() | |

### RLS Policies

| Table | Operation | Policy |
|---|---|---|
| profiles | SELECT | auth.uid() = id |
| profiles | UPDATE | auth.uid() = id |
| point_events | SELECT | auth.uid() = user_id |
| redemptions | SELECT | auth.uid() = user_id |

Server actions use the **service role key** for INSERT/UPDATE writes (bypasses RLS legitimately; service role never reaches the client).

### Postgres RPC

`decrement_points_if_sufficient(p_user_id uuid, p_amount integer) returns boolean`  
Atomically checks balance >= amount and decrements in a single transaction. Called by `redeemReward` to prevent double-spend.

---

## 3. Supabase Client Utilities

| File | Client type | Used by |
|---|---|---|
| `src/lib/supabase/client.ts` | `createBrowserClient` | Client components |
| `src/lib/supabase/server.ts` | `createServerClient` + `cookies()` | Server components, server actions |
| `middleware.ts` (project root) | `updateSession` | Every request — refreshes auth cookie |

---

## 4. Points Catalog

File: `src/lib/points-catalog.ts`

### Earning rules

| Event type | Points |
|---|---|
| scan_dpp | 100 |
| read_full_passport | 50 |
| write_wearer_review | 250 |
| write_caregiver_review | 250 |
| refer_caregiver | 500 |
| complete_fit_concierge | 50 |
| ar_tryon_session | 75 |
| take_back_return | 1000 |
| advocacy_share | 150 |
| quarterly_advocacy_action | 300 |
| purchase_per_dollar | 10 |

### Tier thresholds

| Tier | Min | Max | Perks |
|---|---|---|---|
| Advocate | 0 | 1,499 | Early access to drops; free domestic shipping over $75 |
| Advisor | 1,500 | 4,999 | All Advocate perks; quarterly advisor-board Q&A; free returns; 10% off next order |
| Architect | 5,000 | ∞ | All Advisor perks; $200 credit toward co-designed piece; named credit on next pattern; annual advisor retreat invite |

### Redemption catalog

| Cost | Reward |
|---|---|
| 500 pts | Free Take-Back shipping label |
| 1,000 pts | Advisor meet-and-greet (quarterly) |
| 2,000 pts | $25 off next order |
| 3,000 pts | Named donation to Disability Rights Education Fund |
| 5,000 pts | Early access to next product drop |

---

## 5. Server Actions

File: `src/app/actions/points.ts` — `"use server"` directive

All writes use the service-role client. All reads use the user-session client (RLS enforced).

### `awardPoints(eventType, points, metadata?)`

1. Resolve user from session cookie via server client.
2. For `scan_dpp`: check unique index; skip silently if already awarded for this SKU.
3. Insert into `point_events`.
4. Increment `profiles.points` by `points`.
5. Recalculate tier via pure `calcTier(newTotal)` helper; update `profiles.tier` if changed.
6. Return `{ newTotal, tier, tierChanged }`.

### `redeemReward(rewardType, pointsSpent)`

1. Call RPC `decrement_points_if_sufficient` — returns false if balance insufficient.
2. On success: insert into `redemptions`; recalculate tier.
3. Return `{ success, newTotal }`.

### `getPointsBalance(userId?)`

Returns `{ points, tier, recentEvents: PointEvent[10], redemptions: Redemption[] }`.  
If no userId passed, resolves from session cookie.

### `migratePoints(guestEvents: GuestEvent[])`

Called once on `SIGNED_IN` auth state change.  
Iterates guest events, calls `awardPoints` for each with the new user's session.  
Idempotency: same unique index as above prevents double-award if called more than once.

---

## 6. Guest Mode

Component: `src/components/points/GuestPointsTracker.tsx` — mounted in `layout.tsx`.

**Earning path (unauthenticated):**
- On first load, check localStorage for `tempo_guest_id`; create a UUID if absent.
- Point-earning touchpoints call `queueGuestEvent(eventType, points, metadata)` (a client-side function) instead of `awardPoints`.
- Events stored in `localStorage.tempo_guest_events` as a JSON array.

**Migration path (after signup):**
- `GuestPointsTracker` subscribes to `supabase.auth.onAuthStateChange`.
- On `SIGNED_IN`: reads `tempo_guest_events`, calls `migratePoints`, clears localStorage.

---

## 7. Components

| Component | File | Notes |
|---|---|---|
| PointsBadge | `src/components/points/PointsBadge.tsx` | Client, self-fetching; amber pill; links to /rewards; hidden when unauthenticated |
| EarnToast | `src/components/points/EarnToast.tsx` | Exports `showEarnToast(points, label)` — calls sonner `toast()` |
| TierProgressBar | `src/components/points/TierProgressBar.tsx` | Presentational; props: `{ points, tier }` |
| AchievementGrid | `src/components/points/AchievementGrid.tsx` | Four badges: First DPP Scan, First Review, First Take-Back, 10 Caregiver Referrals |
| GuestPointsTracker | `src/components/points/GuestPointsTracker.tsx` | Client; manages localStorage queue + migration |

`<Toaster />` from sonner and `<GuestPointsTracker />` both added to `src/app/layout.tsx`.  
`<PointsBadge />` added to `src/components/layout/Header.tsx` after nav links.

---

## 8. Auth

Flow:
1. Unauthenticated user visits `/rewards` → server component renders `<AuthPrompt />` inline (email input + "Send magic link" button).
2. `AuthPrompt` calls `supabase.auth.signInWithOtp({ email })` client-side.
3. User clicks email link → lands on `/auth/callback` route handler.
4. `/auth/callback/route.ts` exchanges the code, sets session cookie, redirects to `/rewards`.
5. `GuestPointsTracker` detects `SIGNED_IN` and migrates any queued guest events.

No separate `/login` page. Magic link only. Passwords never used.

---

## 9. Pages

### `/rewards`

Server component. Auth-gated (shows `AuthPrompt` if no session).

Sections:
- Points balance + tier badge
- `TierProgressBar` to next tier
- Recent activity feed (last 10 `point_events`)
- Redemption catalog: cards with cost, description, "Claim" button (calls `redeemReward` server action; disabled if balance insufficient)
- `AchievementGrid`
- Link to `/points/how-it-works`

### `/rewards/leaderboard`

Server component. Public (no auth required).  
Queries: `profiles WHERE tier = 'Architect' AND public_leaderboard = true ORDER BY points DESC LIMIT 20`.  
Displays: rank, `display_name`, points. Never exposes `email` or `id`.

### `/points/how-it-works`

Static. Explains why each earning action is sustainability-weighted (DPP scans reduce greenwashing, Take-Back reduces landfill, caregiver referrals grow inclusive access). No auth required.

---

## 10. Touchpoint Triggers

| Touchpoint | Event | Points | How |
|---|---|---|---|
| `/passport/[sku]` page mount | `scan_dpp` | 100 | `<DppScanTracker sku={sku} />` client component mounts, calls `awardPoints` once |
| Fit Concierge response received | `complete_fit_concierge` | 50 | `FitConciergeButton` calls `awardPoints` after streaming completes |
| AR try-on camera granted | `ar_tryon_session` | 75 | `TryOnClient` calls `awardPoints` when stage transitions to `"active"` |
| Review submitted | `write_wearer_review` | 250 | `ReviewsTabs` calls `awardPoints` on form submit |
| Caregiver referral link shared | `refer_caregiver` | 500 | Share button calls `awardPoints('advocacy_share', 150)` immediately; `refer_caregiver` awarded server-side when referral completes sign-up (future: auth webhook) |

---

## 11. Files to Create or Modify

### New files
- `src/supabase/migrations/0001_tempopoints.sql`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/points-catalog.ts`
- `src/app/actions/points.ts`
- `src/app/auth/callback/route.ts`
- `src/app/rewards/page.tsx`
- `src/app/rewards/leaderboard/page.tsx`
- `src/app/points/how-it-works/page.tsx`
- `src/components/points/PointsBadge.tsx`
- `src/components/points/EarnToast.tsx`
- `src/components/points/TierProgressBar.tsx`
- `src/components/points/AchievementGrid.tsx`
- `src/components/points/GuestPointsTracker.tsx`
- `src/components/points/DppScanTracker.tsx`
- `src/components/auth/AuthPrompt.tsx`
- `middleware.ts`

### Modified files
- `src/app/layout.tsx` — add `<Toaster />`, `<GuestPointsTracker />`
- `src/components/layout/Header.tsx` — add `<PointsBadge />`
- `src/app/passport/[sku]/page.tsx` — add `<DppScanTracker />`
- `src/components/product/FitConciergeButton.tsx` — call `awardPoints` on completion
- `src/components/tryon/TryOnClient.tsx` — call `awardPoints` on stage = "active"
- `src/components/product/ReviewsTabs.tsx` — call `awardPoints` on submit

---

## 12. Open Items / Out of Scope for This Build

- `refer_caregiver` (500 pts) requires a signup webhook; the share action awards `advocacy_share` (150 pts) immediately as a proxy. Full referral tracking is a follow-up.
- Admin fulfillment UI for `redemptions.fulfilled` — manual database update for now.
- Stripe purchase points (`purchase_per_dollar`) — wired when checkout is built.
- `take_back_return` — wired when Take-Back shipping flow is built.
