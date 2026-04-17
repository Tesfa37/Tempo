# Imagery Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every CSS gradient placeholder across `/`, `/shop`, `/about` with real, accessible, disability-representative imagery, complete with Next.js Image optimization, blur placeholders, alt text enforcement, and a credits page.

**Architecture:** A central `imagery-manifest.ts` maps every image path to alt text, photographer attribution, license, and blur data URL. `ProductGallery` gains an `images`/`imageMeta` API replacing the old `imageCount`/`gradient` props. Home page hero becomes a 2-column layout with a real image at `lg` breakpoint. About page advisor/founder avatars use a new `AdvisorAvatar` SVG component. All image rendering uses Next.js `<Image>`. A `generate-blur-hashes.mts` script pre-computes blur data URLs from downloaded files.

**Tech Stack:** Next.js 15 `<Image>` (`next/image`), plaiceholder v3 + sharp (blur hashes), Unsplash License, Pexels License, Node.js/tsx for scripts.

**IMPORTANT NOTE ON SOURCES:** Disabled And Here (disabledandhere.com) requires a paid subscription — this plan sources images from Unsplash and Pexels (both free). The manifest includes a `source` field so D&H images can be swapped in for launch without code changes.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `public/images/hero/hero-main.jpg` | Create (download) | Hero lifestyle shot |
| `public/images/products/tmp-001-{1,2,3}.jpg` | Create (download) | TMP-001 images |
| `public/images/products/tmp-002-{1,2,3}.jpg` | Create (download) | TMP-002 images |
| `public/images/products/tmp-003-{1,2,3}.jpg` | Create (download) | TMP-003 images |
| `public/images/products/tmp-004-{1,2,3}.jpg` | Create (download) | TMP-004 images |
| `public/images/products/tmp-005-{1,2,3}.jpg` | Create (download) | TMP-005 images |
| `public/images/products/tmp-006-{1,2,3}.jpg` | Create (download) | TMP-006 images |
| `scripts/generate-blur-hashes.mts` | Create | Generates blur hashes JSON from downloaded images |
| `src/data/imagery-blur-hashes.json` | Create (generated) | Pre-computed blur data URLs (never edit by hand) |
| `src/data/imagery-manifest.ts` | Create | Canonical image registry: alt text, attribution, blur |
| `src/components/ui/AdvisorAvatar.tsx` | Create | SVG initials avatar (sm=48px, md=64px) |
| `src/components/product/ProductGallery.tsx` | Modify | Replace gradient placeholders with Next.js Image |
| `src/app/shop/[slug]/page.tsx` | Modify | Pass `images` + `imageMeta` to ProductGallery |
| `src/app/page.tsx` | Modify | Hero image + product card images via Next.js Image |
| `src/app/about/page.tsx` | Modify | Use AdvisorAvatar for founders + advisors |
| `src/app/credits/page.tsx` | Create | Full attribution for all images |
| `src/components/layout/Footer.tsx` | Modify | Add "Image credits" link to Resources |
| `src/data/products.ts` | Modify | Expand each product to 3 image paths |

---

### Task 1: Install dependencies and create directory structure

**Files:**
- Modify: `package.json` (via pnpm)
- Create: `public/images/products/` (directory)
- Create: `public/images/hero/` (directory)

- [ ] **Step 1: Install plaiceholder and sharp**

```bash
pnpm add -D plaiceholder sharp
```

Expected output: packages added to devDependencies.

- [ ] **Step 2: Create image directories**

```bash
mkdir -p public/images/products public/images/hero
```

- [ ] **Step 3: Verify plaiceholder imports correctly**

```bash
node -e "import('plaiceholder').then(m => console.log('ok:', typeof m.getPlaiceholder))"
```

Expected: `ok: function`

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install plaiceholder and sharp for blur-hash generation"
```

---

### Task 2: Source and download images

**Files:**
- Create: `public/images/hero/hero-main.jpg`
- Create: `public/images/products/tmp-001-1.jpg` through `tmp-006-3.jpg` (18 files)

This task uses WebSearch and curl to find and download free-licensed images. For each slot, search Unsplash or Pexels, select an appropriate photo, download it, and record the photographer name and profile URL for the manifest in Task 4.

**Image slots:**

| Path | Search strategy | Notes |
|---|---|---|
| `hero/hero-main.jpg` | Unsplash: "wheelchair outdoor morning light" or "person cane park sunlight" | Wide/landscape crop, authentic lifestyle |
| `tmp-001-1.jpg` | Unsplash: "person wheelchair working laptop" | Seated lifestyle, bottom half visible |
| `tmp-001-2.jpg` | Unsplash: "clothing seam close-up fabric waist" | Any fabric closure detail |
| `tmp-001-3.jpg` | Unsplash: "trousers flat lay neutral background" | Product flat lay |
| `tmp-002-1.jpg` | Unsplash: "woman blouse kitchen natural light" | Top lifestyle shot |
| `tmp-002-2.jpg` | Unsplash: "fabric wrap overlap detail close-up" | Detail shot |
| `tmp-002-3.jpg` | Unsplash: "blouse top flat lay white background" | Flat lay |
| `tmp-003-1.jpg` | Unsplash: "person cardigan window seated reading" | Outerwear lifestyle |
| `tmp-003-2.jpg` | Unsplash: "cardigan button close-up detail" | Button/closure detail |
| `tmp-003-3.jpg` | Unsplash: "cardigan flat lay neutral background" | Flat lay |
| `tmp-004-1.jpg` | Unsplash: "person wheelchair home relaxed" | Seated lifestyle, lower body |
| `tmp-004-2.jpg` | Unsplash: "zipper seam pants close-up" | Side zipper detail |
| `tmp-004-3.jpg` | Unsplash: "jogger pants flat lay white" | Flat lay, full length |
| `tmp-005-1.jpg` | Unsplash: "person dress office morning standing" | Dress lifestyle |
| `tmp-005-2.jpg` | Unsplash: "jersey fabric neckline close-up knit" | Fabric/neckline detail |
| `tmp-005-3.jpg` | Unsplash: "midi dress flat lay cream" | Flat lay |
| `tmp-006-1.jpg` | Unsplash: "person linen shirt outdoor bench" | Shirt lifestyle |
| `tmp-006-2.jpg` | Unsplash: "shirt collar button close-up detail" | Placket/button detail |
| `tmp-006-3.jpg` | Unsplash: "linen shirt flat lay wood" | Flat lay |

- [ ] **Step 1: Search for and download the hero image**

Use WebSearch to find a suitable Unsplash or Pexels photo. Download:

```bash
curl -L "ACTUAL_URL_FROM_SEARCH" -o "public/images/hero/hero-main.jpg"
```

Record: photographer name, photographer profile URL, license.

- [ ] **Step 2: Download all 18 product images**

For each slot in the table, use WebSearch then curl:

```bash
curl -L "URL" -o "public/images/products/tmp-001-1.jpg"
curl -L "URL" -o "public/images/products/tmp-001-2.jpg"
curl -L "URL" -o "public/images/products/tmp-001-3.jpg"
curl -L "URL" -o "public/images/products/tmp-002-1.jpg"
curl -L "URL" -o "public/images/products/tmp-002-2.jpg"
curl -L "URL" -o "public/images/products/tmp-002-3.jpg"
curl -L "URL" -o "public/images/products/tmp-003-1.jpg"
curl -L "URL" -o "public/images/products/tmp-003-2.jpg"
curl -L "URL" -o "public/images/products/tmp-003-3.jpg"
curl -L "URL" -o "public/images/products/tmp-004-1.jpg"
curl -L "URL" -o "public/images/products/tmp-004-2.jpg"
curl -L "URL" -o "public/images/products/tmp-004-3.jpg"
curl -L "URL" -o "public/images/products/tmp-005-1.jpg"
curl -L "URL" -o "public/images/products/tmp-005-2.jpg"
curl -L "URL" -o "public/images/products/tmp-005-3.jpg"
curl -L "URL" -o "public/images/products/tmp-006-1.jpg"
curl -L "URL" -o "public/images/products/tmp-006-2.jpg"
curl -L "URL" -o "public/images/products/tmp-006-3.jpg"
```

Record photographer name, profile URL, and license (Unsplash License or Pexels License) for every image.

- [ ] **Step 3: Verify all 19 files are present and non-empty**

```bash
ls -lh public/images/hero/ public/images/products/
```

Expected: 1 file in hero/, 18 files in products/, all > 0 bytes.

- [ ] **Step 4: Update src/data/products.ts — 3 images per product**

Read `src/data/products.ts`. Products TMP-002 through TMP-006 currently have 2 image paths. Update each to 3:

```typescript
// TMP-002
images: [
  "/images/products/tmp-002-1.jpg",
  "/images/products/tmp-002-2.jpg",
  "/images/products/tmp-002-3.jpg",
],

// TMP-003
images: [
  "/images/products/tmp-003-1.jpg",
  "/images/products/tmp-003-2.jpg",
  "/images/products/tmp-003-3.jpg",
],

// TMP-004
images: [
  "/images/products/tmp-004-1.jpg",
  "/images/products/tmp-004-2.jpg",
  "/images/products/tmp-004-3.jpg",
],

// TMP-005
images: [
  "/images/products/tmp-005-1.jpg",
  "/images/products/tmp-005-2.jpg",
  "/images/products/tmp-005-3.jpg",
],

// TMP-006
images: [
  "/images/products/tmp-006-1.jpg",
  "/images/products/tmp-006-2.jpg",
  "/images/products/tmp-006-3.jpg",
],
```

TMP-001 already has 3 paths — no change needed.

- [ ] **Step 5: Commit**

```bash
git add public/images/ src/data/products.ts
git commit -m "feat: download 19 authentic lifestyle images and add third image path per product"
```

---

### Task 3: Generate blur data URLs

**Files:**
- Create: `scripts/generate-blur-hashes.mts`
- Create: `src/data/imagery-blur-hashes.json`

- [ ] **Step 1: Write the generation script**

Create `scripts/generate-blur-hashes.mts`:

```typescript
import { getPlaiceholder } from "plaiceholder";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const results: Record<string, string> = {};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory()
      ? walk(full)
      : /\.(jpg|jpeg|png|webp)$/i.test(name)
      ? [full]
      : [];
  });
}

for (const imgPath of walk("public/images")) {
  const buffer = readFileSync(imgPath);
  const { base64 } = await getPlaiceholder(buffer);
  const webPath = "/" + relative("public", imgPath).replace(/\\/g, "/");
  results[webPath] = base64;
  console.log(`ok ${webPath}`);
}

writeFileSync(
  "src/data/imagery-blur-hashes.json",
  JSON.stringify(results, null, 2)
);
console.log(`\nGenerated ${Object.keys(results).length} blur hashes.`);
```

- [ ] **Step 2: Run the script**

```bash
npx tsx scripts/generate-blur-hashes.mts
```

Expected output: 19 `ok /images/...` lines followed by `Generated 19 blur hashes.`

- [ ] **Step 3: Verify the JSON was created**

```bash
node -e "const j = require('./src/data/imagery-blur-hashes.json'); console.log(Object.keys(j).length, 'keys')"
```

Expected: `19 keys`

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-blur-hashes.mts src/data/imagery-blur-hashes.json
git commit -m "feat: add blur-hash generation script and pre-computed hashes for all 19 images"
```

---

### Task 4: Create imagery-manifest.ts

**Files:**
- Create: `src/data/imagery-manifest.ts`

Replace every `PHOTOGRAPHER_NAME`, `PROFILE_URL`, and `LICENSE` placeholder below with the actual values recorded during Task 2. Every field must be real before committing.

**Alt text rules** (enforced via comment at top of file):
- Describe action: "Person at a coffee shop, wearing the Seated-Cut Trouser"
- Disability is incidental: "Person at a cafe table, seated in a wheelchair, working on a laptop" — never "wheelchair user at a cafe"
- Never: "suffers from", "confined to", "afflicted"
- Describe visible garment features: "close-up of the hip magnetic closure"

- [ ] **Step 1: Create the manifest**

Create `src/data/imagery-manifest.ts`:

```typescript
// ALT TEXT RULES enforced in this file:
// - Describe action: "Person at a coffee shop, wearing the Seated-Cut Trouser"
// - Never describe the disability as the subject: avoid "wheelchair user wearing Tempo"
// - If disability is incidental, mention it incidentally: "Person at a cafe, seated in a wheelchair, wearing the Cardigan"
// - Never use "suffers from", "confined to", or "afflicted"
// - Describe visible garment features: "close-up of the hip magnetic closure showing brushed-steel trim"

import blurHashes from "./imagery-blur-hashes.json";

export interface ImageAsset {
  path: string;
  alt: string;
  source: "Unsplash" | "Pexels" | "Disabled And Here";
  photographer: string;
  photographerUrl: string;
  license: string;
  blurDataURL: string;
}

const hashes = blurHashes as Record<string, string>;

// 1x1 transparent PNG — only shown if a hash is missing (should not happen after Task 3)
const DEFAULT_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8fO3qfwAIlANA5m6MXQAAAABJRU5ErkJggg==";

function asset(
  path: string,
  alt: string,
  source: ImageAsset["source"],
  photographer: string,
  photographerUrl: string,
  license: string
): ImageAsset {
  return {
    path,
    alt,
    source,
    photographer,
    photographerUrl,
    license,
    blurDataURL: hashes[path] ?? DEFAULT_BLUR,
  };
}

export const heroImage = asset(
  "/images/hero/hero-main.jpg",
  "Person seated in a wheelchair at a sunlit outdoor cafe, morning light, wearing warm-toned trousers and a structured cardigan",
  "Unsplash",
  "PHOTOGRAPHER_NAME",
  "PROFILE_URL",
  "Unsplash License"
);

export const productImages: Record<string, ImageAsset> = {
  // ── TMP-001 Seated-Cut Trouser ──────────────────────────────────────────────
  "/images/products/tmp-001-1.jpg": asset(
    "/images/products/tmp-001-1.jpg",
    "Person at a cafe table, seated in a wheelchair, working on a laptop, wearing charcoal straight-leg trousers with a clean waistband",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-001-2.jpg": asset(
    "/images/products/tmp-001-2.jpg",
    "Close-up of a hip-line magnetic closure on charcoal trousers, two aligned fabric panels with brushed-finish hardware",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-001-3.jpg": asset(
    "/images/products/tmp-001-3.jpg",
    "Charcoal trouser flat lay on a neutral linen surface, showing tailored waistband and side-panel detail",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),

  // ── TMP-002 Knotless Wrap Blouse ────────────────────────────────────────────
  "/images/products/tmp-002-1.jpg": asset(
    "/images/products/tmp-002-1.jpg",
    "Person at a bright kitchen counter wearing a soft-grey wrap-style blouse, one hand resting on the surface",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-002-2.jpg": asset(
    "/images/products/tmp-002-2.jpg",
    "Close-up of a wrap blouse waistline showing a discreet magnetic overlap with smooth fabric-covered edges",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-002-3.jpg": asset(
    "/images/products/tmp-002-3.jpg",
    "Knotless wrap blouse flat lay on a white surface, showing the draped wrap silhouette and brushed jersey texture",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),

  // ── TMP-003 Magnetic-Front Cardigan ─────────────────────────────────────────
  "/images/products/tmp-003-1.jpg": asset(
    "/images/products/tmp-003-1.jpg",
    "Person seated at a wooden desk near a window wearing a structured mid-grey cardigan, tea mug in hand",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-003-2.jpg": asset(
    "/images/products/tmp-003-2.jpg",
    "Close-up of a cardigan placket showing seven fabric-covered decorative buttons over concealed magnetic closures",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-003-3.jpg": asset(
    "/images/products/tmp-003-3.jpg",
    "Grey cardigan flat lay on a neutral background, showing the seven-button placket and ribbed cuffs",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),

  // ── TMP-004 Side-Zip Adaptive Jogger ────────────────────────────────────────
  "/images/products/tmp-004-1.jpg": asset(
    "/images/products/tmp-004-1.jpg",
    "Person in a bright living room, seated in a power wheelchair, wearing heather-grey jogger trousers with a clean side seam",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-004-2.jpg": asset(
    "/images/products/tmp-004-2.jpg",
    "Close-up of a trouser side seam showing a flush YKK zipper running from hip toward ankle",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-004-3.jpg": asset(
    "/images/products/tmp-004-3.jpg",
    "Adaptive jogger flat lay on a white background with both legs fully unzipped and opened flat, showing full-width dressing access",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),

  // ── TMP-005 Easy-Pull Dress ─────────────────────────────────────────────────
  "/images/products/tmp-005-1.jpg": asset(
    "/images/products/tmp-005-1.jpg",
    "Person standing at an office window holding a coffee mug, wearing a sage-green midi dress, morning light",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-005-2.jpg": asset(
    "/images/products/tmp-005-2.jpg",
    "Close-up of a jersey midi dress neckline showing an engineered stretch opening with a clean finished edge",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-005-3.jpg": asset(
    "/images/products/tmp-005-3.jpg",
    "Easy-pull midi dress flat lay on a cream background, showing A-line silhouette with no buttons or closures",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),

  // ── TMP-006 Button-Free Linen Shirt ─────────────────────────────────────────
  "/images/products/tmp-006-1.jpg": asset(
    "/images/products/tmp-006-1.jpg",
    "Person on a park bench wearing a natural linen shirt with an open collar, sunlight filtering through trees",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-006-2.jpg": asset(
    "/images/products/tmp-006-2.jpg",
    "Close-up of a linen shirt placket showing decorative buttons aligned over concealed magnetic snap pairs",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
  "/images/products/tmp-006-3.jpg": asset(
    "/images/products/tmp-006-3.jpg",
    "Natural linen shirt flat lay on a weathered wood surface, showing placket detail and collar-stay positions",
    "Unsplash",
    "PHOTOGRAPHER_NAME",
    "PROFILE_URL",
    "Unsplash License"
  ),
};

export const allImages: ImageAsset[] = [
  heroImage,
  ...Object.values(productImages),
];
```

- [ ] **Step 2: Replace all PHOTOGRAPHER_NAME and PROFILE_URL placeholders**

Go through each entry and fill in the actual photographer name and Unsplash/Pexels profile URL recorded in Task 2. No `PHOTOGRAPHER_NAME` or `PROFILE_URL` strings may remain in the committed file.

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/imagery-manifest.ts
git commit -m "feat: create imagery manifest with alt text, attribution, and blur hashes"
```

---

### Task 5: Create AdvisorAvatar.tsx

**Files:**
- Create: `src/components/ui/AdvisorAvatar.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/ui/AdvisorAvatar.tsx`:

```tsx
interface AdvisorAvatarProps {
  initials: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  size?: "sm" | "md";
}

export function AdvisorAvatar({
  initials,
  name,
  avatarBg,
  avatarText,
  size = "md",
}: AdvisorAvatarProps) {
  const dim = size === "sm" ? 48 : 64;
  const fontSize = size === "sm" ? 14 : 18;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
      className="shrink-0 rounded-full"
    >
      <circle cx={dim / 2} cy={dim / 2} r={dim / 2} fill={avatarBg} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={avatarText}
        fontFamily="Georgia, 'Playfair Display', serif"
        fontWeight="bold"
        fontSize={fontSize}
      >
        {initials}
      </text>
    </svg>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/AdvisorAvatar.tsx
git commit -m "feat: add AdvisorAvatar SVG component for advisory board portraits"
```

---

### Task 6: Update ProductGallery to use Next.js Image

**Files:**
- Modify: `src/components/product/ProductGallery.tsx`
- Modify: `src/app/shop/[slug]/page.tsx`

Current `ProductGallery` props: `{ productName, imageCount, gradient }` — CSS gradient only.
New props: `{ productName, images, imageMeta }` — real images with alt text and blur data.

- [ ] **Step 1: Overwrite ProductGallery.tsx**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export interface ImageMeta {
  alt: string;
  blurDataURL: string;
}

interface ProductGalleryProps {
  productName: string;
  images: string[];
  imageMeta: ImageMeta[];
}

export function ProductGallery({
  productName,
  images,
  imageMeta,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    }
  }

  const activeSrc = images[activeIndex];
  const activeMeta = imageMeta[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main display */}
      <div className="relative h-96 rounded-xl overflow-hidden border border-[#D4C9BA]">
        {activeSrc && activeMeta ? (
          <Image
            src={activeSrc}
            alt={activeMeta.alt}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={activeMeta.blurDataURL}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={activeIndex === 0}
          />
        ) : (
          <div
            className="h-full bg-[#E8DFD2] flex items-center justify-center"
            role="img"
            aria-label={`${productName} — image unavailable`}
          >
            <span className="font-playfair text-xl text-[#5A5A5A] text-center px-6">
              {productName}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex gap-3" role="group" aria-label="Product views">
          {images.map((src, i) => {
            const meta = imageMeta[i];
            return (
              <button
                key={src}
                type="button"
                aria-label={`View ${productName} — ${meta?.alt ?? `angle ${i + 1}`}`}
                aria-pressed={activeIndex === i}
                onClick={() => setActiveIndex(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
                  activeIndex === i
                    ? "border-[#C29E5F]"
                    : "border-[#D4C9BA] opacity-60 hover:opacity-100"
                }`}
              >
                {meta && (
                  <Image
                    src={src}
                    alt={meta.alt}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={meta.blurDataURL}
                    sizes="80px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update src/app/shop/[slug]/page.tsx**

Add import after existing imports:
```tsx
import { productImages } from "@/data/imagery-manifest";
```

Remove these two lines (they were only for the old gradient prop):
```tsx
const isFeatured = product.isFeatured;
const gradient = isFeatured
  ? "from-[#C29E5F] to-[#E8DFD2]"
  : "from-[#7A8B75] to-[#E8DFD2]";
```

Replace the `<ProductGallery ...>` call:
```tsx
<ProductGallery
  productName={product.name}
  images={product.images}
  imageMeta={product.images.map((p) => ({
    alt: productImages[p]?.alt ?? product.name,
    blurDataURL: productImages[p]?.blurDataURL ?? "",
  }))}
/>
```

Note: `isFeatured` is still used lower in the page for the sterilization badge styling — if the linter complains about an unused variable, it's because you removed the wrong `isFeatured` assignment. Keep the one used in the sterilization section. Check: `product.sterilizationSafe` is used directly — `isFeatured` was only used for `gradient`. Safe to remove both lines.

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/product/ProductGallery.tsx src/app/shop/[slug]/page.tsx
git commit -m "feat: migrate ProductGallery to Next.js Image with blur placeholder and real alt text"
```

---

### Task 7: Update home page — hero image and product card images

**Files:**
- Modify: `src/app/page.tsx`

The home page is `"use client"` because of `NewsletterSection`. Two changes: (1) hero becomes 2-column at `lg` with a real image on the right, (2) each product card replaces its gradient div with a Next.js Image.

- [ ] **Step 1: Add imports at the top of src/app/page.tsx**

After the existing imports, add:
```tsx
import Image from "next/image";
import { heroImage, productImages } from "@/data/imagery-manifest";
```

- [ ] **Step 2: Remove the gradients array**

Delete lines:
```tsx
const gradients = [
  "from-[#C29E5F] to-[#E8DFD2]",
  "from-[#7A8B75] to-[#E8DFD2]",
  "from-[#C4725A] to-[#E8DFD2]",
  "from-[#D4C9BA] to-[#FAFAF7]",
  "from-[#C29E5F] to-[#7A8B75]",
  "from-[#1A1A1A] to-[#5A5A5A]",
];
```

- [ ] **Step 3: Replace the hero section**

Replace the current hero `<section>` (the one with `aria-labelledby="hero-heading"` containing `max-w-4xl`) with:

```tsx
<section
  className="bg-[#E8DFD2] py-24 px-4 sm:px-6 lg:px-8"
  aria-labelledby="hero-heading"
>
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <h1
        id="hero-heading"
        className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1A1A1A] leading-tight mb-6"
      >
        Clothes that move<br className="hidden sm:block" /> at your pace.
      </h1>
      <p className="text-[#5A5A5A] text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
        Every morning, for 90 hours a year, a pair of ordinary pants stood
        between dignity and independence. Tempo was built to give those
        minutes back. Adaptive design, sustainable materials, every garment
        a product you can trust completely.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Link
          href="/shop"
          className="inline-block bg-[#7A8B75] text-white font-medium px-8 py-4 rounded-lg hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] text-base"
        >
          Shop the collection
        </Link>
        <Link
          href="/about"
          className="inline-block text-[#C29E5F] font-medium px-2 py-4 underline underline-offset-4 hover:text-[#a8874f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded text-base"
        >
          Learn about our mission
        </Link>
      </div>
    </div>
    <div className="relative h-80 lg:h-[520px] rounded-2xl overflow-hidden">
      <Image
        src={heroImage.path}
        alt={heroImage.alt}
        fill
        className="object-cover"
        placeholder="blur"
        blurDataURL={heroImage.blurDataURL}
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 4: Replace the product card image placeholder**

In the `products.map` block, change the `.map` callback from `(product, index) =>` to `(product) =>`.

Replace the gradient placeholder div inside each card:
```tsx
{/* Placeholder image */}
<div
  className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}
  aria-hidden="true"
>
  {product.isFeatured && (
    <span className="bg-[#C29E5F] text-white text-xs font-medium px-3 py-1 rounded-full">
      Featured
    </span>
  )}
</div>
```

With:
```tsx
<div className="relative h-48 overflow-hidden">
  {(() => {
    const src = product.images[0];
    const meta = src ? productImages[src] : undefined;
    return src && meta ? (
      <Image
        src={src}
        alt={meta.alt}
        fill
        className="object-cover"
        placeholder="blur"
        blurDataURL={meta.blurDataURL}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    ) : (
      <div className="h-full bg-[#E8DFD2]" aria-hidden="true" />
    );
  })()}
  {product.isFeatured && (
    <span className="absolute top-3 left-3 bg-[#C29E5F] text-white text-xs font-medium px-3 py-1 rounded-full z-10">
      Featured
    </span>
  )}
</div>
```

- [ ] **Step 5: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: replace gradient placeholders with real hero and product card images on home page"
```

---

### Task 8: Update about page to use AdvisorAvatar

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Add import**

At the top of `src/app/about/page.tsx`, add after the existing imports:
```tsx
import { AdvisorAvatar } from "@/components/ui/AdvisorAvatar";
```

- [ ] **Step 2: Replace Tesfa Desta founder avatar**

In the founders section, find the Tesfa Desta card. Replace:
```tsx
<div
  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-[#1A1A1A] shrink-0"
  style={{ backgroundColor: "#C29E5F" }}
  aria-hidden="true"
>
  T.D.
</div>
```

With:
```tsx
<AdvisorAvatar
  initials="T.D."
  name="Tesfa Desta"
  avatarBg="#C29E5F"
  avatarText="#1A1A1A"
  size="md"
/>
```

- [ ] **Step 3: Replace Bityana Yishak founder avatar**

Find the Bityana Yishak card. Replace:
```tsx
<div
  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-[#FAFAF7] shrink-0"
  style={{ backgroundColor: "#7A8B75" }}
  aria-hidden="true"
>
  B.Y.
</div>
```

With:
```tsx
<AdvisorAvatar
  initials="B.Y."
  name="Bityana Yishak"
  avatarBg="#7A8B75"
  avatarText="#FAFAF7"
  size="md"
/>
```

- [ ] **Step 4: Replace all advisor avatars in the board section**

In the `advisors.map` block, find the advisor avatar div:
```tsx
<div
  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
  style={{
    backgroundColor: advisor.avatarBg,
    color: advisor.avatarText,
  }}
  aria-hidden="true"
>
  {advisor.initials}
</div>
```

Replace with:
```tsx
<AdvisorAvatar
  initials={advisor.initials}
  name={advisor.name}
  avatarBg={advisor.avatarBg}
  avatarText={advisor.avatarText}
  size="sm"
/>
```

- [ ] **Step 5: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: replace styled-div initials with AdvisorAvatar SVG on /about"
```

---

### Task 9: Create credits page

**Files:**
- Create: `src/app/credits/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/credits/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { allImages, type ImageAsset } from "@/data/imagery-manifest";

export const metadata: Metadata = {
  title: "Image Credits — Tempo",
  description:
    "Attribution for all photography used on the Tempo website, including photographer credits, image sources, and license information.",
};

function CreditsList({ images, source }: { images: ImageAsset[]; source: string }) {
  const filtered = images.filter((i) => i.source === source);
  if (filtered.length === 0) return null;

  const licenseHref =
    source === "Unsplash"
      ? "https://unsplash.com/license"
      : source === "Pexels"
      ? "https://www.pexels.com/license/"
      : "https://affecttheverb.com/disabledandhere/";

  const licenseNote =
    source === "Unsplash"
      ? "Free to use, attribution appreciated."
      : source === "Pexels"
      ? "Free to use, attribution appreciated."
      : "Disability-representative photography by and for the disabled community.";

  return (
    <section aria-labelledby={`${source.toLowerCase().replace(" ", "-")}-heading`} className="mb-12">
      <h2
        id={`${source.toLowerCase().replace(" ", "-")}-heading`}
        className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-2"
      >
        {source}
      </h2>
      <p className="text-sm text-[#5A5A5A] mb-6">
        Used under the{" "}
        <a
          href={licenseHref}
          className="underline underline-offset-2 text-[#C29E5F] hover:text-[#a8874f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          {source} License
        </a>
        . {licenseNote}
      </p>
      <ul className="flex flex-col gap-4">
        {filtered.map((img) => (
          <li
            key={img.path}
            className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg p-4"
          >
            <p className="text-xs font-mono text-[#9A9A9A] mb-1">{img.path}</p>
            <p className="text-sm text-[#1A1A1A] mb-1">{img.alt}</p>
            <p className="text-sm text-[#5A5A5A]">
              Photo by{" "}
              <a
                href={img.photographerUrl}
                className="text-[#C29E5F] underline underline-offset-2 hover:text-[#a8874f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                {img.photographer}
              </a>{" "}
              on {source}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CreditsPage() {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[#5A5A5A]">
            <li>
              <Link
                href="/"
                className="hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-[#1A1A1A] font-medium" aria-current="page">
                Image credits
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          Image credits
        </h1>
        <p className="text-[#5A5A5A] leading-relaxed mb-12">
          All photography on this site is used under the terms of the original
          source license. We are grateful to the photographers who made their
          work freely available.
        </p>

        <CreditsList images={allImages} source="Unsplash" />
        <CreditsList images={allImages} source="Pexels" />
        <CreditsList images={allImages} source="Disabled And Here" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/credits/page.tsx
git commit -m "feat: add /credits page with full image attribution"
```

---

### Task 10: Update footer with credits link

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add credits entry to Resources**

In `src/components/layout/Footer.tsx`, change the `Resources` array in `footerLinks`:

```typescript
Resources: [
  { href: "/passport", label: "Digital Product Passport" },
  { href: "/financial-support", label: "Financial support" },
  { href: "/accessibility", label: "WCAG 2.1 AA compliance" },
  { href: "/credits", label: "Image credits" },
],
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add image credits link to footer Resources section"
```

---

### Task 11: Final verification

**Files:** None (verification only)

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Run tests**

```bash
pnpm test --run
```

Expected: all existing tests pass (19+).

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: BUILD SUCCESS. `/credits` should appear as a static route.

- [ ] **Step 5: Verify all 19 images are present**

```bash
find public/images -type f | wc -l
```

Expected: 19

- [ ] **Step 6: Verify no gradient placeholder divs remain in main pages**

```bash
grep -rn "bg-gradient-to-br" src/app/page.tsx src/app/shop src/app/about/page.tsx
```

Expected: 0 matches.
