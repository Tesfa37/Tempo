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
  source: "Unsplash" | "Pexels" | "Disabled And Here" | "Commissioned";
  photographer: string;
  photographerUrl: string;
  license: string;
  blurDataURL: string;
}

const hashes = blurHashes as Record<string, string>;

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
  "Pexels",
  "SHVETS production",
  "https://www.pexels.com/@shvets-production",
  "Pexels License"
);

export const productImages: Record<string, ImageAsset> = {
  // ── TMP-001 Seated-Cut Trouser ──────────────────────────────────────────────
  "/images/products/tmp-001-1.jpg": asset(
    "/images/products/tmp-001-1.jpg",
    "Person at a cafe table, seated in a wheelchair, working on a laptop, wearing charcoal straight-leg trousers with a clean waistband",
    "Unsplash",
    "CDC",
    "https://unsplash.com/@cdc",
    "Unsplash License"
  ),
  "/images/products/tmp-001-2.jpg": asset(
    "/images/products/tmp-001-2.jpg",
    "Close-up of a hip-line magnetic closure on charcoal trousers, two aligned fabric panels with brushed-finish hardware",
    "Pexels",
    "Karolina Grabowska",
    "https://www.pexels.com/@karolina-grabowska",
    "Pexels License"
  ),
  "/images/products/tmp-001-3.jpg": asset(
    "/images/products/tmp-001-3.jpg",
    "Charcoal trouser flat lay on a neutral linen surface, showing tailored waistband and side-panel detail",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/5405644",
    "Pexels License"
  ),

  // ── TMP-002 Knotless Wrap Blouse ────────────────────────────────────────────
  "/images/products/tmp-002-1.jpg": asset(
    "/images/products/tmp-002-1.jpg",
    "Person at a bright kitchen counter wearing a soft-grey wrap-style blouse, one hand resting on the surface",
    "Pexels",
    "Tatiana Sozutova",
    "https://www.pexels.com/photo/11930568",
    "Pexels License"
  ),
  "/images/products/tmp-002-2.jpg": asset(
    "/images/products/tmp-002-2.jpg",
    "Close-up of a wrap blouse waistline showing a discreet magnetic overlap with smooth fabric-covered edges",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/7794365",
    "Pexels License"
  ),
  "/images/products/tmp-002-3.jpg": asset(
    "/images/products/tmp-002-3.jpg",
    "Knotless wrap blouse flat lay on a white surface, showing the draped wrap silhouette and brushed jersey texture",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/2237801",
    "Pexels License"
  ),

  // ── TMP-003 Magnetic-Front Cardigan ─────────────────────────────────────────
  "/images/products/tmp-003-1.jpg": asset(
    "/images/products/tmp-003-1.jpg",
    "Person seated at a wooden desk near a window wearing a structured mid-grey cardigan, tea mug in hand",
    "Pexels",
    "Yan Krukau",
    "https://www.pexels.com/@yan-krukau",
    "Pexels License"
  ),
  "/images/products/tmp-003-2.jpg": asset(
    "/images/products/tmp-003-2.jpg",
    "Close-up of a cardigan placket showing seven fabric-covered decorative buttons over concealed magnetic closures",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/4049148",
    "Pexels License"
  ),
  "/images/products/tmp-003-3.jpg": asset(
    "/images/products/tmp-003-3.jpg",
    "Grey cardigan flat lay on a neutral background, showing the seven-button placket and ribbed cuffs",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/4004222",
    "Pexels License"
  ),

  // ── TMP-004 Side-Zip Adaptive Jogger ────────────────────────────────────────
  "/images/products/tmp-004-1.jpg": asset(
    "/images/products/tmp-004-1.jpg",
    "Person in a bright living room, seated in a power wheelchair, wearing heather-grey jogger trousers with a clean side seam",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/4064339",
    "Pexels License"
  ),
  "/images/products/tmp-004-2.jpg": asset(
    "/images/products/tmp-004-2.jpg",
    "Close-up of a trouser side seam showing a flush YKK zipper running from hip toward ankle",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/206365",
    "Pexels License"
  ),
  "/images/products/tmp-004-3.jpg": asset(
    "/images/products/tmp-004-3.jpg",
    "Adaptive jogger flat lay on a white background with both legs fully unzipped and opened flat, showing full-width dressing access",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/28719728",
    "Pexels License"
  ),

  // ── TMP-005 Easy-Pull Dress ─────────────────────────────────────────────────
  "/images/products/tmp-005-1.jpg": asset(
    "/images/products/tmp-005-1.jpg",
    "Person standing at an office window holding a coffee mug, wearing a sage-green midi dress, morning light",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/10069885",
    "Pexels License"
  ),
  "/images/products/tmp-005-2.jpg": asset(
    "/images/products/tmp-005-2.jpg",
    "Close-up of a jersey midi dress neckline showing an engineered stretch opening with a clean finished edge",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/4862910",
    "Pexels License"
  ),
  "/images/products/tmp-005-3.jpg": asset(
    "/images/products/tmp-005-3.jpg",
    "Easy-pull midi dress flat lay on a cream background, showing A-line silhouette with no buttons or closures",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/5746100",
    "Pexels License"
  ),

  // ── TMP-006 Button-Free Linen Shirt ─────────────────────────────────────────
  "/images/products/tmp-006-1.jpg": asset(
    "/images/products/tmp-006-1.jpg",
    "Person on a park bench wearing a natural linen shirt with an open collar, sunlight filtering through trees",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/1882246",
    "Pexels License"
  ),
  "/images/products/tmp-006-2.jpg": asset(
    "/images/products/tmp-006-2.jpg",
    "Close-up of a linen shirt placket showing decorative buttons aligned over concealed magnetic snap pairs",
    "Pexels",
    "cottonbro studio",
    "https://www.pexels.com/@cottonbro",
    "Pexels License"
  ),
  "/images/products/tmp-006-3.jpg": asset(
    "/images/products/tmp-006-3.jpg",
    "Natural linen shirt flat lay on a weathered wood surface, showing placket detail and collar-stay positions",
    "Pexels",
    "Pexels",
    "https://www.pexels.com/photo/20817639",
    "Pexels License"
  ),

  // ── TMP-007 Women's Everyday Tee ─────────────────────────────────────────────
  '/images/editorial/product-tmp-007.png': asset(
    '/images/editorial/product-tmp-007.png',
    'Person in a cream organic cotton crew-neck t-shirt against a warm plaster wall in soft natural window light',
    'Commissioned',
    'Tempo Editorial',
    'https://tempo.style',
    'All Rights Reserved'
  ),

  // ── TMP-008 Women's Tailored Trouser ─────────────────────────────────────────
  '/images/editorial/product-tmp-008.png': asset(
    '/images/editorial/product-tmp-008.png',
    'Person walking in taupe cotton twill tailored trousers on a warm wooden floor, paired with a cream blouse',
    'Commissioned',
    'Tempo Editorial',
    'https://tempo.style',
    'All Rights Reserved'
  ),

  // ── TMP-009 Men's Crew Neck Tee ──────────────────────────────────────────────
  '/images/editorial/product-tmp-009.png': asset(
    '/images/editorial/product-tmp-009.png',
    'Person in a cream organic cotton crew-neck t-shirt standing in a stone interior with warm natural light',
    'Commissioned',
    'Tempo Editorial',
    'https://tempo.style',
    'All Rights Reserved'
  ),

  // ── TMP-010 Men's Straight Trouser ───────────────────────────────────────────
  '/images/editorial/product-tmp-010.png': asset(
    '/images/editorial/product-tmp-010.png',
    'Person in terracotta cotton twill trousers walking past a stone wall on cobblestone, warm morning light',
    'Commissioned',
    'Tempo Editorial',
    'https://tempo.style',
    'All Rights Reserved'
  ),

  // ── TMP-011 Adaptive Magnetic Button-Down ────────────────────────────────────
  '/images/editorial/product-tmp-011.png': asset(
    '/images/editorial/product-tmp-011.png',
    'Person in a soft blue cotton poplin button-down shirt in warm natural light, focused composition on the shirt construction',
    'Commissioned',
    'Tempo Editorial',
    'https://tempo.style',
    'All Rights Reserved'
  ),

  // ── TMP-012 Adaptive Pull-On Jean ────────────────────────────────────────────
  '/images/editorial/product-tmp-012.png': asset(
    '/images/editorial/product-tmp-012.png',
    'Person seated on a wooden chair wearing recycled cotton denim pull-on jeans paired with a cream knit top',
    'Commissioned',
    'Tempo Editorial',
    'https://tempo.style',
    'All Rights Reserved'
  ),
};

export const allImages: ImageAsset[] = [
  heroImage,
  ...Object.values(productImages),
];
