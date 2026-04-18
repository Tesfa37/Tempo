# P2 Design Spec: Global Design System, Navigation, and Homepage Architecture

**Date:** 2026-04-17
**Phase:** P2 of pre-CICDC pivot
**Builds on:** Phase 3 (shipped through commit 81220fe)
**Constraint:** No breaking changes to existing routes, accessibility, or Caregiver Mode

---

## 0. Context

Phase 3 shipped 12 products (TMP-001 to TMP-012), a gender-tagged data model, PWA, SEO, and outfit-pairing helpers. P2 repositions Tempo's navigation and homepage from a single undifferentiated catalog into a Women / Men / Adaptive three-category architecture — the thesis for the CICDC pitch. Design system tokens are updated to reflect a more editorial, warmth-forward palette.

**Stack:** Next.js 15 App Router, TypeScript strict, Tailwind v4 (CSS-first, no tailwind.config.ts), shadcn/ui, Vercel.

---

## 1. Design System (globals.css)

### 1.1 Token additions

New CSS variables added inside the existing `@theme` block in `src/app/globals.css`. Existing tokens are preserved.

| Token | Value | Role |
|---|---|---|
| `--bg-canvas` | `#FAFAF7` | Default page background (replaces sand `#E8DFD2` on body) |
| `--bg-surface` | `#FFFFFF` | Card and panel backgrounds |
| `--ink-primary` | `#1A1A1A` | Primary text (already used implicitly, now tokenized) |
| `--ink-secondary` | `#6B6B6B` | Secondary/muted text |
| `--accent` | `#8B6F47` | Primary interactive color (buttons, active chips) |
| `--accent-hover` | `#6F5738` | Hover/focus state for accent elements |
| `--border` | `#E8E4DC` | Default border color |

Existing `--color-amber` (#C29E5F), `--color-sage` (#7A8B75), `--color-sand` (#E8DFD2), `--color-charcoal`, `--color-terracotta` are left untouched for semantic uses (Caregiver Mode badges, passport status, etc.).

### 1.2 Font utilities

`@theme` block gains two font-family mappings so Tailwind utilities `font-sans` and `font-serif` resolve to the already-loaded Google Fonts:

```css
--font-family-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
--font-family-serif: var(--font-playfair), ui-serif, Georgia, serif;
```

`layout.tsx` is not changed - Inter and Playfair Display are already loaded with the correct CSS variable names.

### 1.3 Body background

`body` background changes from `#E8DFD2` (sand) to `var(--bg-canvas)`. Applied in the base layer of `globals.css`.

### 1.4 Heading defaults

`h1`, `h2`, `h3` default to `font-serif` (Playfair Display). `body` defaults to `font-sans` (Inter). Applied in the base layer.

### 1.5 Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Global transition default on interactive elements: `transition-all duration-[400ms] ease-out`. Applied per-component, not globally via *, to avoid performance regression.

### 1.6 Scope

No changes to: dark mode vars, shadcn component tokens (--primary, --secondary, --muted, --destructive, --ring, sidebar tokens, chart tokens), radius tokens, or any Phase 3 utility classes (`.text-amber`, `.bg-sand`, etc.).

---

## 2. Header Navigation

**File:** `src/components/layout/Header.tsx`

### 2.1 Primary nav link order

| Label | Route | Notes |
|---|---|---|
| Women | `/shop?gender=women` | Standard link |
| Men | `/shop?gender=men` | Standard link |
| Adaptive | `/shop?gender=adaptive` | Identical visual treatment |
| Virtual Fitting | `/try-on` | P4 renames route to `/fit` |
| Passports | Existing route | Unchanged |
| Voice | Existing route | Phase 3 voice is a layout-level overlay with no dedicated route; implementer to confirm target href before shipping (likely `/#voice` or a trigger button rather than a nav link) |

**Critical:** Women, Men, and Adaptive use identical `className`. No conditional styling, no visual weight difference, no badge, no subtitle. The equal treatment is the positioning thesis.

### 2.2 Utility rail (right side)

Caregiver Mode toggle, Cart icon, Account state — preserved exactly as shipped in Phase 3.

### 2.3 Mobile

Hamburger toggle opens dropdown. Gender category links (Women, Men, Adaptive) appear at the top of the dropdown list. Virtual Fitting, Passports, Voice follow. Utility actions at the bottom.

### 2.4 Active state

Active link (matching current pathname + search params) gets `font-medium` and `text-[var(--accent)]`. All others are `text-[var(--ink-primary)]` with hover `text-[var(--accent)]`.

---

## 3. Homepage Rebuild

**File:** `src/app/page.tsx` — full replacement of section content. Component imports for `ValidatedByStrip` and `NewsletterSection` are preserved.

### 3.1 Section order

```
Hero
Three-Category Tile Strip
New Arrivals Rail
Match Set Builder Feature
Virtual Fitting Feature
Trust Strip (ValidatedByStrip)
Newsletter (NewsletterSection)
```

### 3.2 Hero

- Full viewport width, ~70vh height (`h-[70vh]`)
- Positioned: `relative overflow-hidden`
- Background: SVG editorial placeholder (see Section 5), `object-cover w-full h-full`
- Overlay: `absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/20 to-transparent` (20% bottom vignette only)
- Headline: Playfair Display, `text-5xl md:text-7xl font-semibold`, white, `drop-shadow-sm`
  - Copy: "Tempo. Fashion at your pace."
- Subheadline: Inter, `text-lg md:text-xl font-normal`, white/90
  - Copy: "Women, Men, Adaptive. One standard."
- CTA: Button with `bg-[var(--accent)] hover:bg-[var(--accent-hover)]` text white
  - Label: "Shop the collection" → `/shop`
- No carousel. No auto-play. No parallax.

### 3.3 Three-Category Tile Strip

- Full width, `w-full`, zero outer padding/margin
- `grid grid-cols-1 md:grid-cols-3 gap-2` (8px gutter)
- Order: Women, Men, Adaptive
- Each tile:
  - `relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-[500px]`
  - Full-bleed SVG placeholder image, `object-cover w-full h-full`
  - Label: `absolute bottom-8 left-8`, Playfair, `text-5xl font-semibold text-white`
  - Entire tile is an `<a>` → `/shop?gender={slug}`
  - `aria-label="Shop {Label}"` on the anchor
- Mobile: tiles stack vertically (grid-cols-1 handles this)

### 3.4 New Arrivals Rail

- Section heading: "New Arrivals" (Playfair, `text-3xl`)
- Horizontal scroll container: `flex gap-2 overflow-x-auto pb-4` with `scrollbar-width: none` and `::-webkit-scrollbar { display: none }` applied via a CSS class (no plugin required)
- Products: `isNew === true` products first, padded to 8 with first-available products. If fewer than 8 `isNew`, fill from remaining products sorted by id.
- Each card:
  - `flex-none w-48 md:w-56`
  - Image area: `aspect-square bg-[var(--bg-surface)] overflow-hidden`
  - Name: Inter, `text-sm font-medium text-[var(--ink-primary)] mt-2`
  - Price: Inter, `text-sm font-normal text-[var(--ink-secondary)]`
  - No badges, no hover overlays
  - Card links to `/shop/{slug}`

### 3.5 Match Set Builder Feature

- `grid grid-cols-1 md:grid-cols-2`, section padding `py-16 md:py-24`
- Desktop: copy left, image right. Mobile: image top, copy bottom.
- Headline: Playfair, `text-4xl md:text-5xl`, `text-[var(--ink-primary)]`
  - Copy: "Build your match set."
- Body: Inter, `text-base`, max 2 sentences about outfit pairing
- CTA: "Start styling" → `/style/build` (page does not exist yet; P3 builds it)
- Image: SVG placeholder with alt "Flatlay of a matched Tempo outfit on a neutral surface"

### 3.6 Virtual Fitting Feature

- Same split grid as 3.5 but mirrored: image left, copy right on desktop
- Headline: "See it before you buy it."
- Body: 2 sentences covering AI fitting, wheelchair mode, on-device privacy
- CTA: "Try Virtual Fitting" → `/try-on`
- Image: SVG placeholder with alt "Person using a phone to preview a Tempo jacket in augmented reality"

### 3.7 Trust Strip and Newsletter

`ValidatedByStrip` and `NewsletterSection` components imported and rendered unchanged. Newsletter copy "Add me to the pilot" is already in the Phase 3 component.

### 3.8 Removed from homepage

- Four Pillars section (delete from page.tsx only; component file untouched)
- Featured Products row (delete from page.tsx only; component logic untouched)
- Founder narrative (was not present in Phase 3 homepage; no action needed)
- Sustainability numbers block (was not present in Phase 3 homepage; no action needed)

---

## 4. Shop Page Gender Filter

**Files:** `src/app/shop/page.tsx`, `src/components/shop/ShopClient.tsx`

### 4.1 URL contract

`src/app/shop/page.tsx` reads `searchParams.gender` (Next.js 15 async searchParams) and passes it as a prop to `ShopClient`. Type: `'women' | 'men' | 'adaptive' | undefined`.

### 4.2 Filter chip row

- Rendered above the filter sidebar, full width
- Chips: All, Women, Men, Adaptive
- Active chip: `bg-[var(--accent)] text-white border-[var(--accent)]`
- Inactive chips: `bg-transparent text-[var(--ink-primary)] border-[var(--border)]`
- Clicking a chip calls `router.push` to update `?gender=` query param (or removes it for "All")
- Chips are `<button>` elements with `aria-pressed` reflecting active state

### 4.3 Filter stacking logic

Gender filter is AND-logic with existing filters:
- Gender chip → filters `product.gender`
- Caregiver Mode conditions → filters `product.conditions` (OR within conditions)
- Category, size, price → existing logic unchanged
- All filters compose: `adaptive + wheelchair = products where gender==='adaptive' AND conditions.includes('wheelchair')`

### 4.4 Grid

- `grid grid-cols-2 md:grid-cols-4 gap-2` (8px gutters, 4-col desktop, 2-col tablet+mobile)
- Product card: image, name (Inter 14px medium), price (Inter 14px regular). No sale badges, no hover overlays.
- Caregiver Mode extras (time-to-dress, sterilization, adaptive features) preserved when toggle is on.

### 4.5 Empty state

Existing "No products match" + reset filters button is preserved. Reset button clears gender chip to "All" in addition to existing filter resets.

---

## 5. Image Placeholder Strategy

No external image fetches at build time.

**New SVG placeholders needed:**
- `hero-editorial.svg` — for homepage hero
- `category-women.svg` — for Women tile
- `category-men.svg` — for Men tile  
- `category-adaptive.svg` — for Adaptive tile
- `feature-matchset.svg` — for Match Set Builder
- `feature-virtualfit.svg` — for Virtual Fitting

Each SVG:
- Warm neutral fill (`#E8E4DC`), silhouette or abstract editorial shape
- `aria-hidden="true"` on decorative SVG elements; descriptive alt on the `<img>` tag
- Code comment: `{/* TODO: replace with licensed editorial photo */}`
- Stored in `/public/placeholders/`

Alt text examples (scene-first, no condition-leading):
- Hero: "Two people walking through a sun-drenched fabric market, one wearing a Tempo linen shirt"
- Women tile: "Person in a tailored Tempo blazer at an outdoor table, morning light"
- Men tile: "Person in a Tempo button-front shirt boarding a train, bag on shoulder"
- Adaptive tile: "Person in a Tempo seated-cut trouser having coffee at a cafe counter"
- Match Set: "Flatlay of a matched Tempo outfit on a neutral linen surface"
- Virtual Fitting: "Person holding a phone showing a Tempo jacket preview in a bright room"

---

## 6. Constraints Carried Forward

- No em dashes in any copy
- Adaptive category: identical visual treatment to Women and Men, zero exceptions
- All existing routes stay alive: `/shop`, `/try-on`, `/passports`, `/about`, `/accessibility`, `/faq`, `/search`
- All interactive elements keyboard-reachable with visible focus rings
- `prefers-reduced-motion` honored globally
- WCAG 2.1 AA minimum on all new UI

---

## 7. Verification Checklist

- [ ] `pnpm lint` green
- [ ] `pnpm typecheck` green
- [ ] `pnpm build` green
- [ ] Load `/` — Playfair loads on headings, Inter on body, bg is `#FAFAF7`
- [ ] Tab through entire homepage — every interactive element shows focus ring
- [ ] Load `/shop?gender=adaptive` — only adaptive products render
- [ ] Load `/shop?gender=women` — gender chip shows Women active
- [ ] Mobile 375px — category tiles stack vertically
- [ ] DevTools prefers-reduced-motion toggle — animations disabled
- [ ] Navigate to `/try-on` — still works
- [ ] Navigate to `/passports` — still works with Phase 3 styling
- [ ] Navigate to `/accessibility` — still works

---

## 8. Commit Plan

```
feat(design): establish global typography and color tokens
feat(nav): restructure header with Women, Men, Adaptive
feat(home): rebuild homepage with three-category architecture
feat(shop): add gender filter with query param
```
