export type Condition =
  | "post-stroke"
  | "wheelchair"
  | "sensory"
  | "arthritis"
  | "dementia"
  | "limited-mobility";

export type Category = "tops" | "bottoms" | "dresses" | "outerwear";

export interface AdaptiveFeature {
  name: string;
  description: string;
  icon: string; // lucide icon name
}

export interface ProductVariant {
  size: string;
  inStock: boolean;
}

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
  materials: string; // e.g. "95% GOTS organic cotton, 5% elastane"
  certifications: string[];
  timeToDressMinutes: number; // estimated dressing time
  sterilizationSafe: boolean;
  sterilizationNotes: string;
  variants: ProductVariant[];
  images: string[]; // placeholder paths
  isFeatured: boolean;
  isNew: boolean;
  gender: 'women' | 'men' | 'adaptive';
  productType?: 'top' | 'bottom' | 'outer' | 'accessory';
  colorFamily?: 'neutral' | 'warm' | 'cool' | 'earth';
  formality?: 'casual' | 'smart-casual' | 'formal';
}

export const products: Product[] = [
  {
    id: "tmp-001",
    slug: "seated-cut-trouser-charcoal",
    sku: "TMP-001",
    gtin: "09780000000014",
    name: "Seated-Cut Trouser",
    category: "bottoms",
    price: 89,
    description:
      "Engineered for seated wear with magnetic side-closure and seat-relief tailoring. One-handed dressing in under 3 minutes.",
    longDescription:
      "The Seated-Cut Trouser redefines what trousers can do for someone who spends most of their day seated. Our seat-relief tailoring adds 3cm of extra fabric at the back rise, eliminating the uncomfortable pull that standard trousers create in a wheelchair. The magnetic side-closure at both hips replaces buttons and zippers entirely, allowing single-handed dressing without the fifteen-minute struggle. Fabricated in GOTS-certified organic cotton twill with 5% elastane for shape retention, the trouser holds a clean silhouette from 8am to 8pm. Sensory-friendly flat seams throughout; no raised inseam to cause pressure points.",
    adaptiveFeatures: [
      {
        name: "Magnetic Side-Closure",
        description:
          "Neodymium magnets at both hip closures. Single-handed dressing, no buttons or zippers.",
        icon: "magnet",
      },
      {
        name: "Seat-Relief Tailoring",
        description:
          "3cm extra back rise eliminates bunching and pressure for full-time wheelchair users.",
        icon: "armchair",
      },
      {
        name: "Flat-Felled Seams",
        description:
          "All interior seams are flat-felled, eliminating raised ridges that cause skin irritation.",
        icon: "layers",
      },
      {
        name: "One-Handed Dressing",
        description:
          "Designed for independent dressing with post-stroke or limited right-hand use.",
        icon: "hand",
      },
    ],
    conditions: ["post-stroke", "wheelchair"],
    materials: "95% GOTS organic cotton twill, 5% elastane",
    certifications: ["GOTS", "Fair Trade", "OEKO-TEX Standard 100"],
    timeToDressMinutes: 3,
    sterilizationSafe: true,
    sterilizationNotes:
      "Machine washable at 60°C. Compatible with hospital-grade laundry protocols. No bleach; tumble dry low.",
    variants: [
      { size: "XS", inStock: true },
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: false },
    ],
    images: [
      "/images/products/tmp-001-1.jpg",
      "/images/products/tmp-001-2.jpg",
      "/images/products/tmp-001-3.jpg",
    ],
    isFeatured: true,
    isNew: false,
    gender: 'adaptive',
    productType: 'bottom',
    colorFamily: 'neutral',
    formality: 'smart-casual',
  },
  {
    id: "tmp-002",
    slug: "knotless-wrap-blouse",
    sku: "TMP-002",
    gtin: "09780000000021",
    name: "Knotless Wrap Blouse",
    category: "tops",
    price: 72,
    description:
      "A wrap silhouette secured by hidden magnets. No knot, no tie, no fine motor skill required. Sensory-friendly fabric.",
    longDescription:
      "The Knotless Wrap Blouse takes the timeless wrap silhouette and re-engineers its entire closure system. Where traditional wraps require two hands and fine motor precision to knot, ours uses a discreet magnetic overlap at the waist and a single hidden snap at the shoulder. The result is a blouse that looks professionally dressed and takes under two minutes to put on independently. Fabricated in GOTS-certified organic jersey with a brushed inner surface for sensory comfort, no scratchy labels, no irritating seam allowances. The weight and drape mirror conventional office-appropriate blouses, so the adaptive origin is entirely private if the wearer chooses.",
    adaptiveFeatures: [
      {
        name: "Magnetic Wrap Closure",
        description:
          "Hidden magnets secure the wrap overlap at waist. No tying required.",
        icon: "magnet",
      },
      {
        name: "Sensory-Friendly Jersey",
        description:
          "Brushed organic cotton interior. All labels are printed, not sewn.",
        icon: "shirt",
      },
      {
        name: "One-Shoulder Snap",
        description:
          "Single hidden snap at shoulder prevents wrap from opening during transfers.",
        icon: "lock",
      },
    ],
    conditions: ["post-stroke", "sensory"],
    materials: "100% GOTS organic cotton jersey",
    certifications: ["GOTS", "Fair Trade"],
    timeToDressMinutes: 2,
    sterilizationSafe: false,
    sterilizationNotes:
      "Machine wash cold, gentle cycle. Not suitable for 60°C hospital laundry due to fabric weight. Suitable for home care environments.",
    variants: [
      { size: "XS", inStock: true },
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/images/products/tmp-002-1.jpg",
      "/images/products/tmp-002-2.jpg",
      "/images/products/tmp-002-3.jpg",
    ],
    isFeatured: false,
    isNew: true,
    gender: 'women',
    productType: 'top',
    colorFamily: 'neutral',
    formality: 'smart-casual',
  },
  {
    id: "tmp-003",
    slug: "magnetic-front-cardigan",
    sku: "TMP-003",
    gtin: "09780000000038",
    name: "Magnetic-Front Cardigan",
    category: "outerwear",
    price: 125,
    description:
      "A structured cardigan with magnetic button-replacement closures. Full range of motion for arthritic hands. Sterilization-safe.",
    longDescription:
      "Fine motor challenges make traditional buttons a daily frustration for people with arthritis, post-stroke tremor, or limited hand strength. The Magnetic-Front Cardigan replaces every button with a paired neodymium magnet concealed behind a fabric-covered button aesthetic, the garment looks like a standard 7-button cardigan and fastens with a single sweeping motion. The structured mid-weight fabrication in recycled wool-cotton blend holds shape through repeated magnetic cycles. The front placket is cut with 2cm extra ease to accommodate edema or bandages. All trim is reclaimed from post-consumer textile waste.",
    adaptiveFeatures: [
      {
        name: "Magnetic Button System",
        description:
          "7 magnetic closures replace standard buttons. Looks identical, requires no pinch grip.",
        icon: "magnet",
      },
      {
        name: "Edema-Ease Placket",
        description: "2cm additional ease in front placket for swelling or bandages.",
        icon: "expand",
      },
      {
        name: "Reclaimed Trim",
        description: "All trim sourced from post-consumer textile waste.",
        icon: "recycle",
      },
    ],
    conditions: ["arthritis", "post-stroke", "limited-mobility"],
    materials: "60% recycled wool, 35% organic cotton, 5% elastane",
    certifications: ["Global Recycled Standard", "Fair Trade", "OEKO-TEX Standard 100"],
    timeToDressMinutes: 2,
    sterilizationSafe: true,
    sterilizationNotes:
      "Machine washable at 60°C wool cycle. Tumble dry low. Magnets maintain integrity through 200+ wash cycles.",
    variants: [
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: false },
    ],
    images: [
      "/images/products/tmp-003-1.jpg",
      "/images/products/tmp-003-2.jpg",
      "/images/products/tmp-003-3.jpg",
    ],
    isFeatured: false,
    isNew: false,
    gender: 'adaptive',
    productType: 'outer',
    colorFamily: 'neutral',
    formality: 'smart-casual',
  },
  {
    id: "tmp-004",
    slug: "side-zip-adaptive-jogger",
    sku: "TMP-004",
    gtin: "09780000000045",
    name: "Side-Zip Adaptive Jogger",
    category: "bottoms",
    price: 95,
    description:
      "Full-length side zips from hip to ankle for assisted dressing. Sensory-safe seams, elastic waist, wheelchair silhouette.",
    longDescription:
      "The Side-Zip Adaptive Jogger was designed in direct consultation with wheelchair users and the caregivers who assist with morning dressing. Full-length YKK zippers run from hip to ankle on both legs, allowing the trouser to be fully opened flat for assisted dressing, eliminating the need to lift or reposition the wearer. Once on, the zippers close flush and invisibly into the side seam. The elastic waist with internal grip tape prevents riding during transfers. Fabricated in GOTS organic cotton French terry, warm, breathable, and compliant with care facility laundry protocols.",
    adaptiveFeatures: [
      {
        name: "Full-Length Side Zips",
        description:
          "YKK zippers from hip to ankle open each leg flat for assisted dressing.",
        icon: "zip",
      },
      {
        name: "Grip-Tape Elastic Waist",
        description:
          "Silicone grip tape on inner waistband prevents riding during transfers.",
        icon: "move-vertical",
      },
      {
        name: "Flat-Lock Seams",
        description:
          "Sport flat-lock seaming throughout. Zero raised ridges for pressure points.",
        icon: "layers",
      },
    ],
    conditions: ["wheelchair", "sensory", "limited-mobility"],
    materials: "92% GOTS organic cotton French terry, 8% elastane",
    certifications: ["GOTS", "Fair Trade"],
    timeToDressMinutes: 4,
    sterilizationSafe: true,
    sterilizationNotes:
      "Machine washable at 60°C. YKK zippers rated for 100+ care facility wash cycles. Tumble dry low.",
    variants: [
      { size: "XS", inStock: true },
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/images/products/tmp-004-1.jpg",
      "/images/products/tmp-004-2.jpg",
      "/images/products/tmp-004-3.jpg",
    ],
    isFeatured: false,
    isNew: false,
    gender: 'adaptive',
    productType: 'bottom',
    colorFamily: 'neutral',
    formality: 'casual',
  },
  {
    id: "tmp-005",
    slug: "easy-pull-dress",
    sku: "TMP-005",
    gtin: "09780000000052",
    name: "Easy-Pull Dress",
    category: "dresses",
    price: 110,
    description:
      "A pull-on midi dress with no closures, no zippers, no frustration. Dementia-friendly design. Looks elegant, dresses in 90 seconds.",
    longDescription:
      "The Easy-Pull Dress was specifically designed in consultation with dementia care advisors who identified closure frustration as a leading source of distress during morning dressing. There are no closures on this dress, none. A thoughtfully engineered stretch neckline, side-step construction, and full-length cut mean the dress can be pulled on over the head and smoothed into place in under 90 seconds. The mid-length A-line cut works equally well seated or standing. Fabricated in GOTS organic cotton modal blend with four-way stretch, it moves with the body without constricting. Sensory-safe flat seams; no decorative hardware. The dress presents as a standard midi with no visible sign of adaptive engineering.",
    adaptiveFeatures: [
      {
        name: "Zero-Closure Construction",
        description:
          "No buttons, zippers, hooks, or snaps. One motion: pull over head and smooth.",
        icon: "circle-off",
      },
      {
        name: "Engineered Stretch Neckline",
        description:
          "Reinforced neckline stretches 40% for easy on/off and returns to shape.",
        icon: "stretch-horizontal",
      },
      {
        name: "Dementia-Friendly Design",
        description:
          "No decision points during dressing. Reviewed by dementia care occupational therapists.",
        icon: "brain",
      },
      {
        name: "Seated/Standing Silhouette",
        description:
          "A-line cut with 4cm front-length adjustment hangs correctly both seated and standing.",
        icon: "person-standing",
      },
    ],
    conditions: ["dementia", "sensory", "limited-mobility"],
    materials: "70% GOTS organic cotton, 25% Tencel Modal, 5% elastane",
    certifications: ["GOTS", "Fair Trade", "OEKO-TEX Standard 100"],
    timeToDressMinutes: 2,
    sterilizationSafe: false,
    sterilizationNotes:
      "Machine wash cold, gentle cycle. Tencel Modal requires low-heat care. Not suitable for institutional hot wash.",
    variants: [
      { size: "XS", inStock: true },
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: false },
    ],
    images: [
      "/images/products/tmp-005-1.jpg",
      "/images/products/tmp-005-2.jpg",
      "/images/products/tmp-005-3.jpg",
    ],
    isFeatured: false,
    isNew: true,
    gender: 'women',
    colorFamily: 'warm',
    formality: 'smart-casual',
  },
  {
    id: "tmp-006",
    slug: "adaptive-button-free-linen-shirt",
    sku: "TMP-006",
    gtin: "09780000000069",
    name: "Button-Free Linen Shirt",
    category: "tops",
    price: 98,
    description:
      "The visual language of a classic linen shirt, re-engineered with hidden snap magnets. Post-stroke and arthritis tested.",
    longDescription:
      "We kept everything that makes a linen shirt desirable, the open weave, the natural texture, the collar, the cuffs, and replaced the only part that makes it inaccessible: the buttons. The Button-Free Linen Shirt uses seven concealed magnetic snap pairs along the placket, each covered by a fabric-covered decorative button that serves as aesthetic only. The magnets engage with a firm press or a single sweeping motion down the chest. Collar stays are magnetic as well, preventing collar tips from lifting. Fabricated in GOTS certified Belgian linen washed to a soft hand. The cuff buttons are functional magnetic snaps, closable with one hand. Post-stroke and arthritis communities were the primary design consultants for this garment.",
    adaptiveFeatures: [
      {
        name: "Hidden Magnetic Placket",
        description:
          "7 concealed magnetic pairs under decorative buttons. Looks standard, functions adaptively.",
        icon: "magnet",
      },
      {
        name: "Magnetic Collar Stays",
        description:
          "Concealed collar-stay magnets prevent collar tips from lifting.",
        icon: "shirt",
      },
      {
        name: "Single-Hand Cuff Closure",
        description:
          "Magnetic cuff snaps closable with one hand pressed against thigh.",
        icon: "hand",
      },
    ],
    conditions: ["post-stroke", "arthritis"],
    materials: "100% GOTS certified Belgian linen",
    certifications: ["GOTS", "Fair Trade"],
    timeToDressMinutes: 3,
    sterilizationSafe: false,
    sterilizationNotes:
      "Machine wash cold or hand wash. Lay flat to dry. Linen softens with every wash.",
    variants: [
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/images/products/tmp-006-1.jpg",
      "/images/products/tmp-006-2.jpg",
      "/images/products/tmp-006-3.jpg",
    ],
    isFeatured: false,
    isNew: false,
    gender: 'adaptive',
    productType: 'top',
    colorFamily: 'earth',
    formality: 'smart-casual',
  },
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
      "The Women's Everyday Tee is built on a relaxed-fit block with a slightly longer back hem for coverage during seated and active movement. Fabricated in 100% GOTS-certified organic cotton jersey with a tagless printed interior, nothing scratches, nothing itches. The neckline has gentle stretch for easy on/off. A wardrobe foundation that pairs with every bottom in the Tempo collection.",
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
      'The Adaptive Magnetic Button-Down carries the visual language of a standard poplin shirt with every button replaced by a concealed magnetic closure. Seven magnetic pairs along the placket, magnetic cuff snaps, and a magnetic collar point, all closable with one hand or a single sweeping press. Fabricated in 100% organic cotton poplin with a soft hand finish. The unisex fit is cut generously through the shoulder and chest to accommodate assistive devices, prosthetics, and varied body shapes.',
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
      'The Adaptive Pull-On Jean is fabricated in 92% recycled cotton denim with 8% elastane, enough stretch to pull on and off independently without a button or zipper. The full elastic waistband has a flat inner face (no digging) and a back rise cut generously for seated and active wear. Five-pocket styling with two functioning front pockets and a back patch pocket. The denim weight and finish read as a standard mid-wash jean at a distance.',
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
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}

export function getFeaturedProduct(): Product {
  return products.find((p) => p.isFeatured) ?? products[0]!;
}
