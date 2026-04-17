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
      "The Seated-Cut Trouser redefines what trousers can do for someone who spends most of their day seated. Our seat-relief tailoring adds 3cm of extra fabric at the back rise, eliminating the uncomfortable pull that standard trousers create in a wheelchair. The magnetic side-closure at both hips replaces buttons and zippers entirely — allowing single-handed dressing without the fifteen-minute struggle. Fabricated in GOTS-certified organic cotton twill with 5% elastane for shape retention, the trouser holds a clean silhouette from 8am to 8pm. Sensory-friendly flat seams throughout; no raised inseam to cause pressure points.",
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
      "The Knotless Wrap Blouse takes the timeless wrap silhouette and re-engineers its entire closure system. Where traditional wraps require two hands and fine motor precision to knot, ours uses a discreet magnetic overlap at the waist and a single hidden snap at the shoulder. The result is a blouse that looks professionally dressed and takes under two minutes to put on independently. Fabricated in GOTS-certified organic jersey with a brushed inner surface for sensory comfort — no scratchy labels, no irritating seam allowances. The weight and drape mirror conventional office-appropriate blouses, so the adaptive origin is entirely private if the wearer chooses.",
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
      "Fine motor challenges make traditional buttons a daily frustration for people with arthritis, post-stroke tremor, or limited hand strength. The Magnetic-Front Cardigan replaces every button with a paired neodymium magnet concealed behind a fabric-covered button aesthetic — the garment looks like a standard 7-button cardigan and fastens with a single sweeping motion. The structured mid-weight fabrication in recycled wool-cotton blend holds shape through repeated magnetic cycles. The front placket is cut with 2cm extra ease to accommodate edema or bandages. All trim is reclaimed from post-consumer textile waste.",
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
      "The Side-Zip Adaptive Jogger was designed in direct consultation with wheelchair users and the caregivers who assist with morning dressing. Full-length YKK zippers run from hip to ankle on both legs, allowing the trouser to be fully opened flat for assisted dressing — eliminating the need to lift or reposition the wearer. Once on, the zippers close flush and invisibly into the side seam. The elastic waist with internal grip tape prevents riding during transfers. Fabricated in GOTS organic cotton French terry — warm, breathable, and compliant with care facility laundry protocols.",
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
      "The Easy-Pull Dress was specifically designed in consultation with dementia care advisors who identified closure frustration as a leading source of distress during morning dressing. There are no closures on this dress — none. A thoughtfully engineered stretch neckline, side-step construction, and full-length cut mean the dress can be pulled on over the head and smoothed into place in under 90 seconds. The mid-length A-line cut works equally well seated or standing. Fabricated in GOTS organic cotton modal blend with four-way stretch — it moves with the body without constricting. Sensory-safe flat seams; no decorative hardware. The dress presents as a standard midi with no visible sign of adaptive engineering.",
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
      "We kept everything that makes a linen shirt desirable — the open weave, the natural texture, the collar, the cuffs — and replaced the only part that makes it inaccessible: the buttons. The Button-Free Linen Shirt uses seven concealed magnetic snap pairs along the placket, each covered by a fabric-covered decorative button that serves as aesthetic only. The magnets engage with a firm press or a single sweeping motion down the chest. Collar stays are magnetic as well, preventing collar tips from lifting. Fabricated in GOTS certified Belgian linen washed to a soft hand. The cuff buttons are functional magnetic snaps, closable with one hand. Post-stroke and arthritis communities were the primary design consultants for this garment.",
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
