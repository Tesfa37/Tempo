# Catalog Taxonomy (P1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gender/productType/colorFamily/formality taxonomy to the Product type, backfill all 6 existing SKUs, add 6 new SKUs, create placeholder SVGs, and build Match-Set Builder helpers.

**Architecture:** All type changes live in `src/data/products.ts`; helper functions in a new `src/lib/products.ts`. Placeholder SVGs land in `public/placeholders/`. No passport data for new SKUs — ProductDetail shows "Passport loading" for TMP-007 through TMP-012.

**Tech Stack:** TypeScript strict, Next.js 15 App Router, no new dependencies.

---

## File Map

| File | Action |
|------|--------|
| `src/data/products.ts` | Modify — extend `Product` type, backfill existing SKUs, add TMP-007 to TMP-012 |
| `src/lib/products.ts` | Create — `getProductsByGender`, `getProductsByType`, `getAllGenders`, `getCompatibleBottoms`, `getCompatibleTops` |
| `public/placeholders/tmp-007.svg` … `tmp-012.svg` | Create — thin-outline placeholder SVGs |
| `src/app/shop/[slug]/page.tsx` | Possibly read — confirm "Passport loading" guard for new SKUs |

---

## Task 1: Extend Product type and backfill existing SKUs

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: Extend the Product interface**

Replace the `Product` interface in `src/data/products.ts`. Add four fields immediately after `isNew`:

```typescript
export interface Product {
  id: string;
  slug: string;
  sku: string;
  gtin: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  longDescription: string;
  adaptiveFeatures: AdaptiveFeature[];
  conditions: Condition[];
  materials: string;
  certifications: string[];
  timeToDressMinutes: number;
  sterilizationSafe: boolean;
  sterilizationNotes: string;
  variants: ProductVariant[];
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  gender: 'women' | 'men' | 'adaptive';
  productType?: 'top' | 'bottom' | 'outer' | 'accessory';
  colorFamily?: 'neutral' | 'warm' | 'cool' | 'earth';
  formality?: 'casual' | 'smart-casual' | 'formal';
}
```

- [ ] **Step 2: Add taxonomy fields to TMP-001 (Seated-Cut Trouser)**

Find the TMP-001 object. After `isNew: false,` add:

```typescript
    gender: 'adaptive',
    productType: 'bottom',
    colorFamily: 'neutral',
    formality: 'smart-casual',
```

- [ ] **Step 3: Add taxonomy fields to TMP-002 (Knotless Wrap Blouse)**

Find the TMP-002 object. After `isNew: true,` add:

```typescript
    gender: 'women',
    productType: 'top',
    colorFamily: 'neutral',
    formality: 'smart-casual',
```

- [ ] **Step 4: Add taxonomy fields to TMP-003 (Magnetic-Front Cardigan)**

Find the TMP-003 object. After `isNew: false,` add:

```typescript
    gender: 'adaptive',
    productType: 'outer',
    colorFamily: 'neutral',
    formality: 'smart-casual',
```

- [ ] **Step 5: Add taxonomy fields to TMP-004 (Side-Zip Adaptive Jogger)**

Find the TMP-004 object. After `isNew: false,` add:

```typescript
    gender: 'adaptive',
    productType: 'bottom',
    colorFamily: 'neutral',
    formality: 'casual',
```

- [ ] **Step 6: Add taxonomy fields to TMP-005 (Easy-Pull Dress)**

Find the TMP-005 object. After `isNew: true,` add:

```typescript
    gender: 'women',
    productType: 'top',
    colorFamily: 'warm',
    formality: 'smart-casual',
```

Note: `productType: 'top'` for a dress is a deliberate simplification — no 'dress' value exists in the union and a dress functions as a full-coverage top.

- [ ] **Step 7: Add taxonomy fields to TMP-006 (Button-Free Linen Shirt)**

Find the TMP-006 object. After `isNew: false,` add:

```typescript
    gender: 'adaptive',
    productType: 'top',
    colorFamily: 'earth',
    formality: 'smart-casual',
```

- [ ] **Step 8: Typecheck**

```bash
pnpm typecheck
```

Expected: 0 errors. If TypeScript complains that existing products are missing `gender`, you haven't saved all 6 additions yet.

- [ ] **Step 9: Commit**

```bash
git add src/data/products.ts
git commit -m "feat(data): extend Product type with gender, productType, colorFamily, formality and backfill TMP-001 to TMP-006"
```

---

## Task 2: Add 6 new SKUs (TMP-007 to TMP-012)

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: Append TMP-007 (Women's Everyday Tee)**

Append inside the `products` array, after the TMP-006 closing brace:

```typescript
  {
    id: 'tmp-007',
    slug: 'womens-everyday-tee',
    sku: 'TMP-007',
    gtin: '09780000000076',
    name: "Women's Everyday Tee",
    category: 'tops',
    price: 48,
    description:
      'A relaxed everyday tee cut for comfort and ease of movement. GOTS-certified organic cotton jersey, tagless finish.',
    longDescription:
      "The Women's Everyday Tee is built on a relaxed-fit block with a slightly longer back hem for coverage during seated and active movement. Fabricated in 100% GOTS-certified organic cotton jersey with a tagless printed interior — nothing scratches, nothing itches. The neckline has gentle stretch for easy on/off. A wardrobe foundation that pairs with every bottom in the Tempo collection.",
    adaptiveFeatures: [],
    conditions: [],
    materials: '100% organic cotton jersey, GOTS certified',
    certifications: ['GOTS', 'Fair Trade'],
    timeToDressMinutes: 1,
    sterilizationSafe: false,
    sterilizationNotes: 'Machine wash cold, gentle cycle. Tumble dry low.',
    variants: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
      { size: '2XL', inStock: true },
    ],
    images: ['/placeholders/tmp-007.svg'],
    isFeatured: false,
    isNew: true,
    gender: 'women',
    productType: 'top',
    colorFamily: 'neutral',
    formality: 'casual',
  },
```

- [ ] **Step 2: Append TMP-008 (Women's Tailored Trouser)**

```typescript
  {
    id: 'tmp-008',
    slug: 'womens-tailored-trouser',
    sku: 'TMP-008',
    gtin: '09780000000083',
    name: "Women's Tailored Trouser",
    category: 'bottoms',
    price: 128,
    description:
      'A clean-lined tailored trouser in cotton twill with a hint of stretch. Polished enough for the office, comfortable enough for the commute.',
    longDescription:
      "The Women's Tailored Trouser is cut in a mid-rise straight leg with a flat front and clean finish at the hem. The 98% cotton twill gives structure while 2% elastane ensures the trouser moves with the body through a full working day. A concealed elasticated back waistband provides comfort without sacrificing the front silhouette. Two side seam pockets and one back welt pocket. Pairs with any top in the Tempo women's range.",
    adaptiveFeatures: [],
    conditions: [],
    materials: '98% cotton twill, 2% elastane',
    certifications: ['Fair Trade', 'OEKO-TEX Standard 100'],
    timeToDressMinutes: 2,
    sterilizationSafe: false,
    sterilizationNotes: 'Machine wash cold. Hang to dry or tumble dry low.',
    variants: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
      { size: '2XL', inStock: false },
    ],
    images: ['/placeholders/tmp-008.svg'],
    isFeatured: false,
    isNew: true,
    gender: 'women',
    productType: 'bottom',
    colorFamily: 'neutral',
    formality: 'smart-casual',
  },
```

- [ ] **Step 3: Append TMP-009 (Men's Crew Neck Tee)**

```typescript
  {
    id: 'tmp-009',
    slug: 'mens-crew-neck-tee',
    sku: 'TMP-009',
    gtin: '09780000000090',
    name: "Men's Crew Neck Tee",
    category: 'tops',
    price: 48,
    description:
      'A well-proportioned crew neck tee in 100% GOTS organic cotton jersey. Tagless, seam-tape shoulder, relaxed fit.',
    longDescription:
      "The Men's Crew Neck Tee is cut to a relaxed fit with a slightly dropped shoulder for ease of movement. 100% GOTS-certified organic cotton jersey with a tagless printed interior. Reinforced shoulder seam tape prevents the neckline from losing shape through repeated wear and washing. A clean, versatile foundation that pairs with every bottom in the Tempo men's range.",
    adaptiveFeatures: [],
    conditions: [],
    materials: '100% organic cotton jersey, GOTS certified',
    certifications: ['GOTS', 'Fair Trade'],
    timeToDressMinutes: 1,
    sterilizationSafe: false,
    sterilizationNotes: 'Machine wash cold. Tumble dry low.',
    variants: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
      { size: '2XL', inStock: true },
    ],
    images: ['/placeholders/tmp-009.svg'],
    isFeatured: false,
    isNew: true,
    gender: 'men',
    productType: 'top',
    colorFamily: 'neutral',
    formality: 'casual',
  },
```

- [ ] **Step 4: Append TMP-010 (Men's Straight Trouser)**

```typescript
  {
    id: 'tmp-010',
    slug: 'mens-straight-trouser',
    sku: 'TMP-010',
    gtin: '09780000000106',
    name: "Men's Straight Trouser",
    category: 'bottoms',
    price: 128,
    description:
      'A straight-leg trouser in cotton twill with a warm earth tone. Clean front, two side pockets, concealed elastic back waist.',
    longDescription:
      "The Men's Straight Trouser is cut in a straight leg from a mid-rise waistband. The 98% cotton twill has enough body to hold a crease while 2% elastane keeps the trouser comfortable through a full day. The concealed elasticated back waistband provides ease without changing the front silhouette. Available in a warm earth tone that pairs with any top in the Tempo men's and adaptive range.",
    adaptiveFeatures: [],
    conditions: [],
    materials: '98% cotton twill, 2% elastane',
    certifications: ['Fair Trade', 'OEKO-TEX Standard 100'],
    timeToDressMinutes: 2,
    sterilizationSafe: false,
    sterilizationNotes: 'Machine wash cold. Hang to dry or tumble dry low.',
    variants: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
      { size: '2XL', inStock: true },
    ],
    images: ['/placeholders/tmp-010.svg'],
    isFeatured: false,
    isNew: true,
    gender: 'men',
    productType: 'bottom',
    colorFamily: 'earth',
    formality: 'smart-casual',
  },
```

- [ ] **Step 5: Append TMP-011 (Adaptive Magnetic Button-Down)**

```typescript
  {
    id: 'tmp-011',
    slug: 'adaptive-magnetic-button-down',
    sku: 'TMP-011',
    gtin: '09780000000113',
    name: 'Adaptive Magnetic Button-Down',
    category: 'tops',
    price: 98,
    description:
      'A classic button-down shirt with hidden magnetic closures throughout. Dresses independently in under 2 minutes. Unisex fit.',
    longDescription:
      'The Adaptive Magnetic Button-Down carries the visual language of a standard poplin shirt with every button replaced by a concealed magnetic closure. Seven magnetic pairs along the placket, magnetic cuff snaps, and a magnetic collar point — all closable with one hand or a single sweeping press. Fabricated in 100% organic cotton poplin with a soft hand finish. The unisex fit is cut generously through the shoulder and chest to accommodate assistive devices, prosthetics, and varied body shapes.',
    adaptiveFeatures: [
      {
        name: 'Hidden Magnetic Closures',
        description:
          'Seven magnetic pairs along the placket plus cuff snaps. No pinch grip required.',
        icon: 'magnet',
      },
      {
        name: 'One-Handed Dressing',
        description: 'Every closure operable with a single hand press.',
        icon: 'hand',
      },
    ],
    conditions: ['post-stroke', 'arthritis', 'limited-mobility'],
    materials: '100% organic cotton poplin, hidden magnetic closures',
    certifications: ['GOTS', 'Fair Trade'],
    timeToDressMinutes: 2,
    sterilizationSafe: false,
    sterilizationNotes: 'Machine wash cold, gentle cycle. Lay flat to dry.',
    variants: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
      { size: '2XL', inStock: true },
    ],
    images: ['/placeholders/tmp-011.svg'],
    isFeatured: false,
    isNew: true,
    gender: 'adaptive',
    productType: 'top',
    colorFamily: 'cool',
    formality: 'smart-casual',
  },
```

- [ ] **Step 6: Append TMP-012 (Adaptive Pull-On Jean)**

```typescript
  {
    id: 'tmp-012',
    slug: 'adaptive-pull-on-jean',
    sku: 'TMP-012',
    gtin: '09780000000120',
    name: 'Adaptive Pull-On Jean',
    category: 'bottoms',
    price: 118,
    description:
      'The look of a classic jean with an elastic waistband and 8% elastane for full-day ease. No button, no zip, no frustration.',
    longDescription:
      'The Adaptive Pull-On Jean is fabricated in 92% recycled cotton denim with 8% elastane — enough stretch to pull on and off independently without a button or zipper. The full elastic waistband has a flat inner face (no digging) and a back rise cut generously for seated and active wear. Five-pocket styling with two functioning front pockets and a back patch pocket. The denim weight and finish read as a standard mid-wash jean at a distance.',
    adaptiveFeatures: [
      {
        name: 'Elastic Waistband',
        description:
          'Full elastic waistband with flat inner face. Pull-on in under 60 seconds.',
        icon: 'move-vertical',
      },
      {
        name: 'Seat-Relief Cut',
        description: 'Generous back rise for comfort during seated wear.',
        icon: 'armchair',
      },
    ],
    conditions: ['wheelchair', 'arthritis', 'limited-mobility'],
    materials: '92% recycled cotton denim, 8% elastane, elastic waistband',
    certifications: ['Global Recycled Standard', 'Fair Trade'],
    timeToDressMinutes: 1,
    sterilizationSafe: false,
    sterilizationNotes: 'Machine wash cold. Tumble dry low.',
    variants: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: true },
      { size: '2XL', inStock: true },
    ],
    images: ['/placeholders/tmp-012.svg'],
    isFeatured: false,
    isNew: true,
    gender: 'adaptive',
    productType: 'bottom',
    colorFamily: 'cool',
    formality: 'casual',
  },
```

- [ ] **Step 7: Typecheck**

```bash
pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 8: Commit**

```bash
git add src/data/products.ts
git commit -m "feat(data): add TMP-007 through TMP-012 to product catalog"
```

---

## Task 3: Create placeholder SVGs

**Files:**
- Create: `public/placeholders/tmp-007.svg` through `public/placeholders/tmp-012.svg`

Each SVG is a thin-outline garment silhouette on an off-white (#F5F0E8) background, 400×500 viewBox.

- [ ] **Step 1: Create public/placeholders directory**

```bash
mkdir -p public/placeholders
```

- [ ] **Step 2: Create tmp-007.svg (Women's Everyday Tee)**

Create `public/placeholders/tmp-007.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Outline silhouette of a relaxed-fit women's crew neck tee">
  <rect width="400" height="500" fill="#F5F0E8"/>
  <!-- crew neck tee silhouette -->
  <path d="M130 80 L100 140 L60 120 L80 200 L100 200 L100 380 L300 380 L300 200 L320 200 L340 120 L300 140 L270 80 Q250 60 200 60 Q150 60 130 80Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
  <text x="200" y="430" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#666">TMP-007 — Women's Everyday Tee</text>
</svg>
```

- [ ] **Step 3: Create tmp-008.svg (Women's Tailored Trouser)**

Create `public/placeholders/tmp-008.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Outline silhouette of women's tailored straight-leg trousers">
  <rect width="400" height="500" fill="#F5F0E8"/>
  <!-- trouser silhouette -->
  <path d="M130 80 L270 80 L280 240 L240 420 L210 420 L200 260 L190 420 L160 420 L120 240Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
  <line x1="130" y1="80" x2="270" y2="80" stroke="#333" stroke-width="2"/>
  <text x="200" y="460" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#666">TMP-008 — Women's Tailored Trouser</text>
</svg>
```

- [ ] **Step 4: Create tmp-009.svg (Men's Crew Neck Tee)**

Create `public/placeholders/tmp-009.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Outline silhouette of a men's relaxed-fit crew neck tee">
  <rect width="400" height="500" fill="#F5F0E8"/>
  <path d="M120 80 L90 150 L50 130 L70 210 L100 210 L100 390 L300 390 L300 210 L330 210 L350 130 L310 150 L280 80 Q260 58 200 58 Q140 58 120 80Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
  <text x="200" y="440" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#666">TMP-009 — Men's Crew Neck Tee</text>
</svg>
```

- [ ] **Step 5: Create tmp-010.svg (Men's Straight Trouser)**

Create `public/placeholders/tmp-010.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Outline silhouette of men's straight-leg trousers">
  <rect width="400" height="500" fill="#F5F0E8"/>
  <path d="M120 75 L280 75 L295 245 L260 430 L225 430 L200 255 L175 430 L140 430 L105 245Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
  <line x1="120" y1="75" x2="280" y2="75" stroke="#333" stroke-width="2"/>
  <text x="200" y="468" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#666">TMP-010 — Men's Straight Trouser</text>
</svg>
```

- [ ] **Step 6: Create tmp-011.svg (Adaptive Magnetic Button-Down)**

Create `public/placeholders/tmp-011.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Outline silhouette of an adaptive button-down shirt with collar and placket detail">
  <rect width="400" height="500" fill="#F5F0E8"/>
  <!-- shirt body -->
  <path d="M130 90 L95 150 L55 130 L75 210 L105 210 L105 390 L295 390 L295 210 L325 210 L345 130 L305 150 L270 90 L240 60 L200 70 L160 60Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
  <!-- collar -->
  <path d="M160 60 L200 90 L240 60" fill="none" stroke="#333" stroke-width="2"/>
  <!-- placket centre line -->
  <line x1="200" y1="90" x2="200" y2="390" stroke="#333" stroke-width="1" stroke-dasharray="6 4"/>
  <text x="200" y="435" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#666">TMP-011 — Adaptive Magnetic Button-Down</text>
</svg>
```

- [ ] **Step 7: Create tmp-012.svg (Adaptive Pull-On Jean)**

Create `public/placeholders/tmp-012.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="Outline silhouette of adaptive pull-on jeans with elastic waistband">
  <rect width="400" height="500" fill="#F5F0E8"/>
  <path d="M120 80 L280 80 L295 250 L258 435 L222 435 L200 258 L178 435 L142 435 L105 250Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
  <!-- elastic waistband indicator -->
  <line x1="120" y1="80" x2="280" y2="80" stroke="#333" stroke-width="3"/>
  <line x1="118" y1="95" x2="282" y2="95" stroke="#333" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="200" y="468" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#666">TMP-012 — Adaptive Pull-On Jean</text>
</svg>
```

- [ ] **Step 8: Commit**

```bash
git add public/placeholders/
git commit -m "feat(assets): add placeholder SVG silhouettes for TMP-007 through TMP-012"
```

---

## Task 4: Create src/lib/products.ts with Match-Set helpers

**Files:**
- Create: `src/lib/products.ts`

- [ ] **Step 1: Create the file**

Create `src/lib/products.ts`:

```typescript
import { products } from '@/data/products';
import type { Product } from '@/data/products';

export type Gender = Product['gender'];
export type ProductType = NonNullable<Product['productType']>;
export type ColorFamily = NonNullable<Product['colorFamily']>;
export type Formality = NonNullable<Product['formality']>;

export function getProductsByGender(gender: Gender): Product[] {
  return products.filter((p) => p.gender === gender);
}

export function getProductsByType(type: ProductType): Product[] {
  return products.filter((p) => p.productType === type);
}

export interface GenderCategory {
  label: string;
  slug: Gender;
  count: number;
}

export function getAllGenders(): GenderCategory[] {
  const genders: Gender[] = ['women', 'men', 'adaptive'];
  return genders.map((g) => ({
    label: g.charAt(0).toUpperCase() + g.slice(1),
    slug: g,
    count: products.filter((p) => p.gender === g).length,
  }));
}

const COLOR_COMPATIBILITY: Record<ColorFamily, ColorFamily[]> = {
  neutral: ['neutral', 'warm', 'cool', 'earth'],
  warm: ['warm', 'neutral', 'earth'],
  cool: ['cool', 'neutral'],
  earth: ['earth', 'neutral', 'warm'],
};

function pairingScore(top: Product, bottom: Product): number {
  let score = 0;
  if (top.gender === bottom.gender) score += 3;
  if (
    top.colorFamily &&
    bottom.colorFamily &&
    COLOR_COMPATIBILITY[top.colorFamily]?.includes(bottom.colorFamily)
  )
    score += 2;
  if (top.formality && bottom.formality && top.formality === bottom.formality)
    score += 2;
  if (top.gender === 'adaptive' && bottom.gender === 'adaptive') score += 1;
  return score;
}

export function getCompatibleBottoms(topSku: string): Product[] {
  const top = products.find((p) => p.sku === topSku);
  if (!top) return [];
  const bottoms = products.filter((p) => p.productType === 'bottom');
  return bottoms.sort(
    (a, b) => pairingScore(top, b) - pairingScore(top, a),
  );
}

export function getCompatibleTops(bottomSku: string): Product[] {
  const bottom = products.find((p) => p.sku === bottomSku);
  if (!bottom) return [];
  const tops = products.filter((p) => p.productType === 'top');
  return tops.sort(
    (a, b) => pairingScore(a, bottom) - pairingScore(b, bottom),
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/products.ts
git commit -m "feat(lib): add getProductsByGender, getProductsByType, getAllGenders, getCompatibleBottoms, getCompatibleTops"
```

---

## Task 5: Passport guard for new SKUs and full verification

**Files:**
- Read: `src/app/shop/[slug]/page.tsx` — confirm whether passport section needs a guard

- [ ] **Step 1: Read the product detail page**

Read `src/app/shop/[slug]/page.tsx` and search for any passport rendering. If a passport block renders unconditionally (i.e. it assumes `passports.ts` has an entry for every SKU), add a guard:

Look in `src/data/passports.ts` for whether TMP-007 through TMP-012 exist. If they don't, find the component or page section that renders passport data and wrap it:

```tsx
{hasPassport ? (
  <PassportSection passport={passport} />
) : (
  <p className="text-sm text-muted-foreground">Passport loading</p>
)}
```

Where `hasPassport` is derived from whether the passport lookup returned a value. Do not create any stubs in passports.ts — leave that for Phase P4.5.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: exits 0, no type errors in output.

- [ ] **Step 5: Verify shop renders 12 products**

Start dev server:
```bash
pnpm dev
```

Open `http://localhost:3000/shop` in a browser. Confirm:
- 12 product cards visible
- No console errors
- New placeholder SVGs render (off-white background, thin outline silhouette)

- [ ] **Step 6: Commit if passport guard was needed**

If Step 1 required code changes:

```bash
git add src/app/shop/[slug]/page.tsx
git commit -m "feat(shop): show 'Passport loading' for products without passport data"
```

---

## Self-Review Notes

**Spec coverage:**
- [x] Product type extended with all 4 fields — Task 1, Step 1
- [x] All 6 existing SKUs backfilled — Task 1, Steps 2-7
- [x] 6 new SKUs added with all fields explicit — Task 2
- [x] Placeholder SVGs created — Task 3
- [x] `getProductsByGender` — Task 4
- [x] `getProductsByType` — Task 4
- [x] `getAllGenders` returning `{label, slug, count}` — Task 4
- [x] `getCompatibleBottoms(topSku)` with pairing score — Task 4
- [x] `getCompatibleTops(bottomSku)` mirror — Task 4
- [x] Passport guard for new SKUs — Task 5
- [x] lint + typecheck + build verification — Task 5

**Placeholder scan:** No TBDs, TODOs, or incomplete steps.

**Type consistency:** `Gender`, `ProductType`, `ColorFamily`, `Formality` are derived from the Product type in Task 4 — no drift possible.
