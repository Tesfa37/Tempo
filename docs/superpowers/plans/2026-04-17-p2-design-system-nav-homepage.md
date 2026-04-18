# P2 Design System, Navigation, and Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend Tempo's global design tokens, restructure navigation to Women/Men/Adaptive, rebuild the homepage with an editorial three-category architecture, and add gender filtering to the shop.

**Architecture:** CSS-first Tailwind v4 token additions in globals.css; Header rebuilt with new gender nav links (identical treatment for all three); page.tsx replaced section-by-section; ShopClient extended with a gender chip row that AND-stacks with existing filters.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind v4 (CSS-first, `@theme inline`), shadcn/ui, `next/font/google`, Lucide icons.

---

## File Map

**Modify:**
- `src/app/globals.css` — brand tokens, font-family utilities, body bg, .tempo-transition, fix circular font bug
- `src/components/layout/Header.tsx` — replace navLinks, add active-state logic, update colors
- `src/app/layout.tsx` — update body bg from hardcoded hex to `var(--bg-canvas)`
- `src/app/page.tsx` — full section rebuild (hero, tiles, rail, features, trust, newsletter)
- `src/app/shop/page.tsx` — read async `searchParams.gender`, pass to ShopClient
- `src/components/shop/ShopClient.tsx` — add gender chip row, gender filter logic, 4-col grid

**Create:**
- `public/placeholders/hero-editorial.svg`
- `public/placeholders/category-women.svg`
- `public/placeholders/category-men.svg`
- `public/placeholders/category-adaptive.svg`
- `public/placeholders/feature-matchset.svg`
- `public/placeholders/feature-virtualfit.svg`

---

## Task 1: Design tokens and globals.css

**Files:**
- Modify: `src/app/globals.css`

### Context

`globals.css` uses Tailwind v4's `@theme inline` block (lines 7-49) and a `:root` block (lines 51-96) for brand color vars. Two bugs exist:
- Line 10: `--font-sans: var(--font-sans)` is circular (references itself)
- Line 12: `--font-heading: var(--font-sans)` is also circular

The `prefers-reduced-motion` rule already exists at lines 156-163 with a correct, complete implementation. Do NOT add a duplicate.

### Steps

- [ ] **Step 1: Fix the circular font bug in `@theme inline` and add font-serif**

In `@theme inline` (lines 7-49), replace lines 10-12:

```css
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
```

with:

```css
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-playfair), ui-serif, Georgia, serif;
  --font-mono: var(--font-geist-mono);
```

This makes `font-sans` and `font-serif` Tailwind utilities resolve to the Google Fonts loaded in layout.tsx.

- [ ] **Step 2: Add brand color tokens to `:root`**

After the existing brand vars (after line 90, `--color-border: #D4C9BA;`), add:

```css
  /* P2 chromatic foundation */
  --bg-canvas: #FAFAF7;
  --bg-surface: #FFFFFF;
  --ink-primary: #1A1A1A;
  --ink-secondary: #6B6B6B;
  --accent-hover: #6F5738;

  /* Override shadcn defaults with brand values */
  --accent: #8B6F47;
  --accent-foreground: #FFFFFF;
  --border: #E8E4DC;
```

> **Note:** `--accent` and `--border` override shadcn's tokens. The `@theme inline` block maps `--color-accent: var(--accent)` and `--color-border: var(--border)`, so Tailwind's `bg-accent` and `border-border` utilities will resolve to the brand values. Visually verify shadcn Sheet (mobile filter drawer) still renders acceptably after this change.

- [ ] **Step 3: Update body background in `@layer base`**

In the `@layer base` block (lines 132-154), change the `html` element:

```css
  html {
    @apply font-sans;
    background-color: #E8DFD2;
    color: #1A1A1A;
    font-family: var(--font-inter), system-ui, sans-serif;
  }
```

to:

```css
  html {
    @apply font-sans;
    background-color: var(--bg-canvas);
    color: var(--ink-primary);
    font-family: var(--font-inter), system-ui, sans-serif;
  }
```

- [ ] **Step 4: Add `.tempo-transition` utility class**

In `@layer utilities` (lines 165-176), add at the end:

```css
  .tempo-transition {
    transition-property: color, background-color, border-color, opacity, box-shadow, transform;
    transition-duration: 400ms;
    transition-timing-function: ease-out;
  }
```

- [ ] **Step 5: Add `.scrollbar-none` utility class**

In `@layer utilities`, also add:

```css
  .scrollbar-none {
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
```

- [ ] **Step 6: Run typecheck to confirm no CSS-level type errors, then commit**

```bash
pnpm typecheck
```

Expected: No errors.

```bash
git add src/app/globals.css
git commit -m "feat(design): establish global typography and color tokens"
```

---

## Task 2: SVG editorial placeholders

**Files:**
- Create: `public/placeholders/hero-editorial.svg`
- Create: `public/placeholders/category-women.svg`
- Create: `public/placeholders/category-men.svg`
- Create: `public/placeholders/category-adaptive.svg`
- Create: `public/placeholders/feature-matchset.svg`
- Create: `public/placeholders/feature-virtualfit.svg`

Each SVG is a warm abstract placeholder with `aria-hidden="true"`. The `<img>` tags that consume them carry the meaningful alt text.

- [ ] **Step 1: Create `public/placeholders/hero-editorial.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1008" aria-hidden="true">
  <rect width="1440" height="1008" fill="#E8E4DC"/>
  <ellipse cx="720" cy="600" rx="340" ry="480" fill="#D4CEC6" opacity="0.6"/>
  <ellipse cx="400" cy="700" rx="180" ry="300" fill="#C8C2BA" opacity="0.4"/>
  <ellipse cx="1040" cy="650" rx="200" ry="350" fill="#C8C2BA" opacity="0.4"/>
</svg>
```

- [ ] **Step 2: Create `public/placeholders/category-women.svg`** (sand wash, #E8DFD2)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-hidden="true">
  <rect width="600" height="800" fill="#E8DFD2"/>
  <ellipse cx="300" cy="480" rx="160" ry="360" fill="#DDD6CA" opacity="0.7"/>
  <ellipse cx="300" cy="200" rx="80" ry="90" fill="#DDD6CA" opacity="0.5"/>
</svg>
```

- [ ] **Step 3: Create `public/placeholders/category-men.svg`** (stone wash, #D4D4D0)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-hidden="true">
  <rect width="600" height="800" fill="#D4D4D0"/>
  <rect x="200" y="160" width="200" height="500" rx="8" fill="#C8C8C4" opacity="0.6"/>
  <ellipse cx="300" cy="160" rx="90" ry="100" fill="#C8C8C4" opacity="0.5"/>
</svg>
```

- [ ] **Step 4: Create `public/placeholders/category-adaptive.svg`** (muted tan, #C9B896)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" aria-hidden="true">
  <rect width="600" height="800" fill="#C9B896"/>
  <ellipse cx="300" cy="480" rx="180" ry="320" fill="#BCA882" opacity="0.6"/>
  <ellipse cx="300" cy="200" rx="85" ry="95" fill="#BCA882" opacity="0.5"/>
  <ellipse cx="180" cy="600" rx="70" ry="30" fill="#BCA882" opacity="0.4"/>
  <ellipse cx="420" cy="600" rx="70" ry="30" fill="#BCA882" opacity="0.4"/>
</svg>
```

- [ ] **Step 5: Create `public/placeholders/feature-matchset.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" aria-hidden="true">
  <rect width="800" height="600" fill="#E8E4DC"/>
  <rect x="100" y="80" width="280" height="420" rx="6" fill="#DDD8D0" opacity="0.7"/>
  <rect x="420" y="140" width="200" height="320" rx="6" fill="#D4CFC8" opacity="0.6"/>
</svg>
```

- [ ] **Step 6: Create `public/placeholders/feature-virtualfit.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" aria-hidden="true">
  <rect width="800" height="600" fill="#E8E4DC"/>
  <rect x="280" y="80" width="240" height="420" rx="24" fill="#DDD8D0" opacity="0.7"/>
  <rect x="320" y="110" width="160" height="280" rx="8" fill="#C8C4BC" opacity="0.5"/>
  <ellipse cx="400" cy="440" rx="20" ry="8" fill="#C8C4BC" opacity="0.6"/>
</svg>
```

- [ ] **Step 7: Commit**

```bash
git add public/placeholders/
git commit -m "feat(assets): add P2 editorial SVG placeholders for hero, category tiles, and feature panels"
```

---

## Task 3: Header navigation restructure

**Files:**
- Modify: `src/components/layout/Header.tsx`

### Context

Current nav: `navLinks` array with `/shop`, `/passport`, `/about`, `/accessibility`.
New nav: Women (`/shop?gender=women`), Men (`/shop?gender=men`), Adaptive (`/shop?gender=adaptive`), Virtual Fitting (`/try-on`), Passports (`/passport`).
Voice: already a fixed floating button via `VoiceSearchButton` rendered in `layout.tsx`. Remove from nav entirely. No new button needed.
Active state: detect via `usePathname` + `useSearchParams`. Gender links are active when pathname === `/shop` AND the gender param matches.

- [ ] **Step 1: Add `usePathname` and `useSearchParams` imports and define new nav links**

Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PointsBadge } from "@/components/points/PointsBadge";
import { CartIcon } from "@/components/cart/CartIcon";

interface NavLink {
  href: string;
  label: string;
  ariaLabel?: string;
  matchGender?: string;
}

const PRIMARY_NAV: NavLink[] = [
  { href: "/shop?gender=women", label: "Women", matchGender: "women" },
  { href: "/shop?gender=men", label: "Men", matchGender: "men" },
  { href: "/shop?gender=adaptive", label: "Adaptive", matchGender: "adaptive" },
  { href: "/try-on", label: "Virtual Fitting" },
  {
    href: "/passport",
    label: "Passports",
    ariaLabel: "View Digital Product Passports",
  },
];

interface HeaderProps {
  isAuthed?: boolean;
}

export function Header({ isAuthed = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(link: NavLink): boolean {
    if (link.matchGender) {
      return pathname === "/shop" && searchParams.get("gender") === link.matchGender;
    }
    return pathname === link.href || pathname.startsWith(link.href + "/");
  }

  const linkClass = (link: NavLink) =>
    `inline-flex items-center gap-1.5 text-sm font-medium tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1 ${
      isActive(link)
        ? "text-[var(--accent)] font-semibold"
        : "text-[var(--ink-primary)] hover:text-[var(--accent)]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-canvas)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-playfair text-2xl font-bold text-[var(--ink-primary)] tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            aria-label="Tempo, home"
          >
            Tempo
          </Link>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Primary navigation"
          >
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                aria-current={isActive(link) ? "page" : undefined}
                className={linkClass(link)}
              >
                {link.label}
              </Link>
            ))}
            <PointsBadge />
            <CartIcon />
            {isAuthed ? (
              <Link
                href="/account"
                className="hidden md:inline-flex items-center text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-2 py-1"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-2 py-1"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/shop"
              className="bg-[var(--accent)] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[var(--accent-hover)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Shop the collection
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-[var(--bg-canvas)] border-t border-[var(--border)] px-4 pb-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.ariaLabel}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={`${linkClass(link)} py-2`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <CartIcon />
            </li>
            <li>
              {isAuthed ? (
                <Link
                  href="/account"
                  className="inline-flex items-center py-2 text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center py-2 text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/shop"
                className="block mt-2 bg-[var(--accent)] text-white text-sm font-medium px-4 py-2 rounded text-center hover:bg-[var(--accent-hover)] tempo-transition"
                onClick={() => setMenuOpen(false)}
              >
                Shop the collection
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
```

> **Why `useSearchParams` is safe here:** Header is a client component inside the root layout. Next.js wraps the root layout in Suspense automatically for `useSearchParams` usage.

- [ ] **Step 2: Update `src/app/layout.tsx` — body background and Suspense wrapper**

`useSearchParams` in a client component requires a `Suspense` boundary in Next.js 15 to avoid bailing out of static rendering. Wrap the Header and add `import { Suspense } from "react"`.

Replace the relevant lines in `layout.tsx`:

```tsx
import { Suspense } from "react";
// ... existing imports ...

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[var(--bg-canvas)] text-[var(--ink-primary)] antialiased">
        <StructuredData data={buildOrganization()} />
        <Suspense fallback={<div className="h-16 border-b border-[var(--border)]" />}>
          <Header isAuthed={!!user} />
        </Suspense>
        <main>{children}</main>
        <Footer />
        <PwaInit />
        <VoiceLayer />
        <Toaster position="bottom-right" richColors={false} />
        <GuestPointsTracker />
      </body>
    </html>
  );
}
```

The fallback `<div>` preserves layout height while the header hydrates, preventing layout shift.

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx src/app/layout.tsx
git commit -m "feat(nav): restructure header with Women, Men, Adaptive"
```

---

## Task 4: Homepage rebuild

**Files:**
- Modify: `src/app/page.tsx`

### Context

Current homepage: Hero (2-col) + Four Pillars + ValidatedByStrip + Featured Products + Newsletter.
New homepage: Hero (full-bleed 70vh) + Three-Category Tile Strip + New Arrivals Rail + Match Set Builder Feature + Virtual Fitting Feature + ValidatedByStrip + Newsletter.

The Four Pillars section and Featured Products row are deleted from this file only. Their component files (`ValidatedByStrip`, `NewsletterSection`) are preserved and reused.

The `pillars` data array and lucide icon imports can be removed.

### Steps

- [ ] **Step 1: Replace `src/app/page.tsx` entirely**

Use `next/image` (not `<img>`) for all images to satisfy the `@next/next/no-img-element` ESLint rule. SVG placeholders receive `unoptimized` since Next.js image optimization does not apply to vector files. Product JPEG images do not need `unoptimized`.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { ValidatedByStrip } from "@/components/home/ValidatedByStrip";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Tempo, Clothes that move at your pace",
  description:
    "Adaptive fashion built with disabled advisors. Sustainable materials, Digital Product Passports, and Caregiver Mode. Every garment a product you can trust completely.",
  alternates: {
    canonical: "/",
  },
};

const CATEGORY_TILES = [
  {
    slug: "women",
    label: "Women",
    img: "/placeholders/category-women.svg",
    alt: "Person in a tailored Tempo blazer at an outdoor table, morning light",
  },
  {
    slug: "men",
    label: "Men",
    img: "/placeholders/category-men.svg",
    alt: "Person in a Tempo button-front shirt boarding a train, bag on shoulder",
  },
  {
    slug: "adaptive",
    label: "Adaptive",
    img: "/placeholders/category-adaptive.svg",
    alt: "Person in a Tempo seated-cut trouser having coffee at a cafe counter",
  },
] as const;

function getNewArrivals() {
  const isNew = products.filter((p) => p.isNew);
  const rest = products.filter((p) => !p.isNew);
  return [...isNew, ...rest].slice(0, 8);
}

export default function LandingPage() {
  const newArrivals = getNewArrivals();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative h-[70vh] w-full overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* TODO: replace with licensed editorial photo */}
        <Image
          src="/placeholders/hero-editorial.svg"
          alt="Two people walking through a sun-drenched fabric market, one wearing a Tempo linen shirt"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/20 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            id="hero-heading"
            className="font-serif text-5xl md:text-7xl font-semibold text-white drop-shadow-sm mb-4"
          >
            Tempo. Fashion at your pace.
          </h1>
          <p className="font-sans text-lg md:text-xl font-normal text-white/90 mb-8">
            Women, Men, Adaptive. One standard.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] tempo-transition text-white font-medium px-8 py-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-base"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      {/* Three-Category Tile Strip */}
      <section aria-label="Shop by category">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={`/shop?gender=${tile.slug}`}
              className="relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-[500px] block group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
              aria-label={`Shop ${tile.label}`}
            >
              {/* TODO: replace with licensed editorial photo */}
              <Image
                src={tile.img}
                alt={tile.alt}
                fill
                className="object-cover tempo-transition group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
              <p className="absolute bottom-8 left-8 font-serif text-5xl font-semibold text-white drop-shadow-sm pointer-events-none">
                {tile.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Rail */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="new-arrivals-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="new-arrivals-heading"
            className="font-serif text-3xl font-semibold text-[var(--ink-primary)] mb-6"
          >
            New Arrivals
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {newArrivals.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="flex-none w-48 md:w-56 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                <div className="relative aspect-square bg-[var(--bg-surface)] overflow-hidden rounded-lg">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={`${product.name} product image`}
                      fill
                      className="object-cover tempo-transition group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 192px, 224px"
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-[var(--border)]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-2 font-sans text-sm font-medium text-[var(--ink-primary)] truncate">
                  {product.name}
                </p>
                <p className="font-sans text-sm font-normal text-[var(--ink-secondary)]">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Match Set Builder Feature */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface)]"
        aria-labelledby="matchset-heading"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2
              id="matchset-heading"
              className="font-serif text-4xl md:text-5xl font-semibold text-[var(--ink-primary)] mb-4"
            >
              Build your match set.
            </h2>
            <p className="font-sans text-base text-[var(--ink-secondary)] mb-8 leading-relaxed">
              Tempo&apos;s outfit pairing tool recommends tops and bottoms that
              work together across color, formality, and adaptive features.
              Build a look that fits your day, not just your wardrobe.
            </p>
            <Link
              href="/style/build"
              className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] tempo-transition text-white font-medium px-6 py-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-sm"
            >
              Start styling
            </Link>
          </div>
          <div className="relative order-1 md:order-2 aspect-[4/3] overflow-hidden rounded-2xl">
            {/* TODO: replace with licensed editorial photo */}
            <Image
              src="/placeholders/feature-matchset.svg"
              alt="Flatlay of a matched Tempo outfit on a neutral linen surface"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Virtual Fitting Feature */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="virtualfit-heading"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            {/* TODO: replace with licensed editorial photo */}
            <Image
              src="/placeholders/feature-virtualfit.svg"
              alt="Person holding a phone showing a Tempo jacket preview in a bright room"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div>
            <h2
              id="virtualfit-heading"
              className="font-serif text-4xl md:text-5xl font-semibold text-[var(--ink-primary)] mb-4"
            >
              See it before you buy it.
            </h2>
            <p className="font-sans text-base text-[var(--ink-secondary)] mb-8 leading-relaxed">
              Virtual Fitting uses on-device AI to preview any Tempo garment
              on your own image, with full support for seated and wheelchair
              positions. Your images never leave your device.
            </p>
            <Link
              href="/try-on"
              className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] tempo-transition text-white font-medium px-6 py-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-sm"
            >
              Try Virtual Fitting
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <ValidatedByStrip />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors. If `product.images[0]` gives a type error, check the `Product` type in `src/data/products.ts` — `images` is typed as `string[]`, so index access returns `string | undefined` in strict mode. The conditional `if (product.images[0])` handles this.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): rebuild homepage with three-category architecture"
```

---

## Task 5: Shop page gender filter

**Files:**
- Modify: `src/app/shop/page.tsx`
- Modify: `src/components/shop/ShopClient.tsx`

### Context

`shop/page.tsx` is a server component (19 lines). In Next.js 15, `searchParams` is a `Promise` and must be awaited.

`ShopClient.tsx` manages `FilterState` (category, conditions, sizes, price) via `useState`. Gender is kept as separate state (not inside `FilterState`) to avoid touching `FilterSidebar`'s interface. The gender chip row renders above the existing layout. `filterProducts` gains a gender parameter that applies AND-logic before the existing filters run.

- [ ] **Step 1: Update `src/app/shop/page.tsx`**

Replace the entire file:

```tsx
import { products } from "@/data/products";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop, Tempo Adaptive Fashion",
  description:
    "Browse the full Tempo collection. Adaptive clothing for wheelchair users, post-stroke recovery, sensory needs, arthritis, and dementia care.",
  alternates: {
    canonical: "/shop",
  },
};

type GenderParam = "women" | "men" | "adaptive";
const VALID_GENDERS: GenderParam[] = ["women", "men", "adaptive"];

function parseGender(raw: string | undefined): GenderParam | undefined {
  return VALID_GENDERS.includes(raw as GenderParam)
    ? (raw as GenderParam)
    : undefined;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string }>;
}) {
  const params = await searchParams;
  const initialGender = parseGender(params.gender);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <ShopClient products={products} initialGender={initialGender} />
    </div>
  );
}
```

- [ ] **Step 2: Update `src/components/shop/ShopClient.tsx`**

`useSearchParams` is not needed. We build the gender URL from local state directly, which avoids needing a Suspense boundary for ShopClient.

Replace the entire file:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar, type FilterState } from "@/components/shop/FilterSidebar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Product } from "@/data/products";

type GenderFilter = "women" | "men" | "adaptive";

const GRADIENTS = [
  "from-[#C29E5F] to-[#E8DFD2]",
  "from-[#7A8B75] to-[#E8DFD2]",
  "from-[#C4725A] to-[#E8DFD2]",
  "from-[#D4C9BA] to-[#FAFAF7]",
  "from-[#C29E5F] to-[#7A8B75]",
  "from-[#1A1A1A] to-[#5A5A5A]",
];

function gradientForIndex(index: number): string {
  return GRADIENTS[index % GRADIENTS.length] ?? GRADIENTS[0]!;
}

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  conditions: [],
  sizes: [],
  price: "any",
};

function matchesPrice(price: number, range: FilterState["price"]): boolean {
  switch (range) {
    case "under80":
      return price < 80;
    case "80to100":
      return price >= 80 && price <= 100;
    case "100to130":
      return price > 100 && price <= 130;
    case "130plus":
      return price > 130;
    default:
      return true;
  }
}

function filterProducts(
  products: Product[],
  filters: FilterState,
  gender: GenderFilter | undefined
): Product[] {
  return products.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (filters.category !== "all" && p.category !== filters.category) return false;
    if (
      filters.conditions.length > 0 &&
      !filters.conditions.some((c) => p.conditions.includes(c))
    )
      return false;
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some((s) => p.variants.some((v) => v.size === s))
    )
      return false;
    if (!matchesPrice(p.price, filters.price)) return false;
    return true;
  });
}

function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.category !== "all") count++;
  count += filters.conditions.length;
  count += filters.sizes.length;
  if (filters.price !== "any") count++;
  return count;
}

interface ShopClientProps {
  products: Product[];
  initialGender?: GenderFilter;
}

const GENDER_CHIPS: { label: string; value: GenderFilter | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Adaptive", value: "adaptive" },
];

export function ShopClient({ products, initialGender }: ShopClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [gender, setGender] = useState<GenderFilter | undefined>(initialGender);
  const [caregiverMode, setCaregiverMode] = useState(false);
  const router = useRouter();

  function handleGenderChip(value: GenderFilter | undefined) {
    setGender(value);
    if (value) {
      router.push(`/shop?gender=${value}`, { scroll: false });
    } else {
      router.push("/shop", { scroll: false });
    }
  }

  function resetAll() {
    setFilters(DEFAULT_FILTERS);
    setGender(undefined);
    router.push("/shop", { scroll: false });
  }

  const filtered = filterProducts(products, filters, gender);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-[var(--ink-primary)]">Shop</h1>
          <p className="text-[var(--ink-secondary)] text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Caregiver mode toggle, top right */}
        <div className="flex items-center gap-3">
          <span
            id="caregiver-toggle-label"
            className="text-sm font-medium text-[var(--ink-primary)]"
          >
            Caregiver Mode
          </span>
          <button
            role="switch"
            aria-checked={caregiverMode}
            aria-labelledby="caregiver-toggle-label"
            onClick={() => setCaregiverMode(!caregiverMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              caregiverMode ? "bg-[#7A8B75]" : "bg-[#D4C9BA]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white tempo-transition ${
                caregiverMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Gender chip row */}
      <div
        className="flex gap-2 mb-6 flex-wrap"
        role="group"
        aria-label="Filter by category"
      >
        {GENDER_CHIPS.map((chip) => {
          const active = chip.value === gender;
          return (
            <button
              key={chip.label}
              onClick={() => handleGenderChip(chip.value)}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                active
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-transparent text-[var(--ink-primary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button + Sheet */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-medium text-[var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] hover:bg-[#E8DFD2] tempo-transition"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filter
                {activeCount > 0 && (
                  <span className="ml-1 bg-[var(--accent)] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-playfair text-lg text-[var(--ink-primary)]">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4 overflow-y-auto">
                  <FilterSidebar filters={filters} onChange={setFilters} />
                  {activeCount > 0 && (
                    <button
                      onClick={resetAll}
                      className="mt-6 flex items-center gap-1.5 text-sm text-[#C4725A] hover:text-[#a85a44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                    >
                      <X size={14} aria-hidden="true" />
                      Clear all filters
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop clear filters */}
          {(activeCount > 0 || gender) && (
            <div className="hidden lg:flex items-center gap-2 mb-4">
              <span className="text-sm text-[var(--ink-secondary)]">
                {activeCount + (gender ? 1 : 0)} active{" "}
                {activeCount + (gender ? 1 : 0) === 1 ? "filter" : "filters"}
              </span>
              <button
                onClick={resetAll}
                className="text-sm text-[#C4725A] hover:text-[#a85a44] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[var(--ink-secondary)] text-lg">
                No products match these filters.
              </p>
              <button
                onClick={resetAll}
                className="mt-4 text-sm text-[#7A8B75] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
              role="list"
              aria-label="Products"
            >
              {filtered.map((product, index) => {
                const originalIndex = products.indexOf(product);
                return (
                  <div key={product.id} role="listitem">
                    <ProductCard
                      product={product}
                      caregiverMode={caregiverMode}
                      gradientClass={gradientForIndex(originalIndex >= 0 ? originalIndex : index)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors. If `p.gender` gives a type error, confirm `gender` is typed on the `Product` interface in `src/data/products.ts` as `'women' | 'men' | 'adaptive'`. It was added in Phase 3.

- [ ] **Step 4: Commit**

```bash
git add src/app/shop/page.tsx src/components/shop/ShopClient.tsx
git commit -m "feat(shop): add gender filter with query param"
```

---

## Task 6: Verify

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: No errors or warnings.

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

- [ ] **Step 3: Run build**

```bash
pnpm build
```

Expected: Build completes successfully. Watch for any RSC / async searchParams warnings.

- [ ] **Step 4: Start dev server and verify homepage**

```bash
pnpm dev
```

Open `http://localhost:3000`. Confirm:
- Page background is warm off-white (`#FAFAF7`), not sand
- Hero section fills ~70vh, Playfair headline visible over SVG placeholder
- Three category tiles appear side by side on desktop, stack on mobile (resize to 375px)
- "Women", "Men", "Adaptive" tile labels all appear in identical Playfair type with no visual differentiation
- New Arrivals scrolls horizontally, cards show image + name + price with no badges
- Match Set Builder: copy left, image right on desktop; stacked on mobile
- Virtual Fitting: image left, copy right on desktop; stacked on mobile
- Tab through the entire page: every Link and button receives a visible focus ring

- [ ] **Step 5: Verify header**

- Nav shows: Women, Men, Adaptive, Virtual Fitting, Passports
- No "Voice" link in nav
- Clicking Women → URL becomes `/shop?gender=women`, Women chip is active (filled accent color)
- Clicking Adaptive → URL becomes `/shop?gender=adaptive`
- On mobile (375px): hamburger opens, Women/Men/Adaptive appear first in dropdown list

- [ ] **Step 6: Verify shop gender filter**

- Load `/shop?gender=adaptive` directly: Adaptive chip is active, only adaptive products render
- Load `/shop?gender=women`: Women chip active, only women products render
- Click "All" chip: gender removed from URL, all products render
- Enable Caregiver Mode + select Adaptive: only adaptive products that have condition tags appear (AND-logic)
- Click "Reset filters" from empty state: both gender and sidebar filters clear

- [ ] **Step 7: Verify existing routes still work**

- `/try-on` loads (P4 will rename)
- `/passport` loads
- `/accessibility` loads
- `/faq` loads

- [ ] **Step 8: Verify motion preference**

In Chrome DevTools, open Rendering panel, enable "Emulate CSS media feature prefers-reduced-motion: reduce". Reload. Verify category tile hover scale and all `tempo-transition` elements are instant (0.01ms).

- [ ] **Step 9: Verify Voice trigger**

Voice floating button (Mic icon) is visible bottom-right on the homepage. It is NOT in the primary nav. Activating it opens the voice overlay.

---

## Self-Review Notes

- **Spec Section 1.3 (body bg):** Handled in Task 3 Step 2 (layout.tsx) and Task 1 Step 3 (html in globals.css). Two locations, both updated.
- **Spec Section 2.4 (active state):** Implemented in `isActive()` in Header using `usePathname` + `useSearchParams`.
- **Spec Section 3.3 (scale cap 1.02):** Category tile images and New Arrivals cards use `group-hover:scale-[1.02]` - within the 1.02 cap. Tiles use `scale-[1.02]` not scale-105.
- **Spec Section 4.5 (reset clears gender):** `resetAll()` function in ShopClient clears both `FilterState` and `gender` state and pushes `/shop` with no params.
- **Spec Section 6 (constraints):** No em dashes in any copy. Adaptive tile has identical CSS class to Women and Men. All CTAs are keyboard-reachable `<Link>` or `<button>` elements.
