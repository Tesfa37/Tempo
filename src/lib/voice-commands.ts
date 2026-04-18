import { products } from "@/data/products";

export type CommandIntent =
  | { type: "navigate"; href: string; description: string }
  | { type: "filter"; href: string; description: string }
  | { type: "concierge"; query: string }
  | { type: "unknown" };

const CATEGORY_MAP: Record<string, string> = {
  tops: "tops",
  top: "tops",
  shirt: "tops",
  shirts: "tops",
  blouse: "tops",
  jacket: "tops",
  bottoms: "bottoms",
  bottom: "bottoms",
  trousers: "bottoms",
  trouser: "bottoms",
  pants: "bottoms",
  dress: "dresses",
  dresses: "dresses",
  outerwear: "outerwear",
  coat: "outerwear",
  coats: "outerwear",
};

const CONDITION_MAP: Record<string, string> = {
  wheelchair: "wheelchair",
  "wheelchair user": "wheelchair",
  stroke: "post-stroke",
  "post-stroke": "post-stroke",
  sensory: "sensory",
  arthritis: "arthritis",
  dementia: "dementia",
  "limited mobility": "limited-mobility",
  "limited-mobility": "limited-mobility",
};

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim();
}

function matchProduct(text: string) {
  const lower = normalize(text);
  return products.find(
    (p) =>
      lower.includes(normalize(p.name)) ||
      lower.includes(p.slug.replace(/-/g, " ")) ||
      lower.includes(p.sku.toLowerCase())
  );
}

function matchCategory(text: string): string | undefined {
  const lower = normalize(text);
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val;
  }
}

function matchCondition(text: string): string | undefined {
  const lower = normalize(text);
  for (const [key, val] of Object.entries(CONDITION_MAP)) {
    if (lower.includes(key)) return val;
  }
}

export function parseVoiceCommand(transcript: string): CommandIntent {
  const text = normalize(transcript);

  // "go to [page]" / "open [page]" / "take me to [page]"
  if (/\b(go to|open|take me to|navigate to|show me)\b/.test(text)) {
    if (text.includes("passport")) {
      return { type: "navigate", href: "/passport", description: "Digital Product Passports" };
    }
    if (text.includes("about")) {
      return { type: "navigate", href: "/about", description: "About Tempo" };
    }
    if (text.includes("financial") || text.includes("support") || text.includes("hsa") || text.includes("fsa")) {
      return { type: "navigate", href: "/financial-support", description: "Financial Support" };
    }
    if (text.includes("governance")) {
      return { type: "navigate", href: "/governance", description: "Advisor Governance" };
    }
    if (text.includes("shop") || text.includes("store")) {
      return { type: "navigate", href: "/shop", description: "Shop" };
    }
    if (text.includes("home")) {
      return { type: "navigate", href: "/", description: "Home" };
    }
    if (text.includes("accessibility")) {
      return { type: "navigate", href: "/accessibility", description: "Accessibility Statement" };
    }

    // "show me [category]"
    const cat = matchCategory(text);
    if (cat) {
      return { type: "filter", href: `/shop?category=${cat}`, description: `${cat} category` };
    }

    // "show me [product]"
    const product = matchProduct(text);
    if (product) {
      return { type: "navigate", href: `/shop/${product.slug}`, description: product.name };
    }
  }

  // "filter by [condition]"
  if (/\b(filter|show|find|search)\b/.test(text)) {
    const condition = matchCondition(text);
    if (condition) {
      return { type: "filter", href: `/shop?condition=${condition}`, description: condition };
    }
    const cat = matchCategory(text);
    if (cat) {
      return { type: "filter", href: `/shop?category=${cat}`, description: `${cat} category` };
    }
    const product = matchProduct(text);
    if (product) {
      return { type: "navigate", href: `/shop/${product.slug}`, description: product.name };
    }
  }

  // "try on [product]"
  if (/\b(try on|try)\b/.test(text)) {
    const product = matchProduct(text);
    if (product) {
      return { type: "navigate", href: `/fit/${product.slug}`, description: `AI Virtual Fitting for ${product.name}` };
    }
  }

  // "passport for [product/sku]"
  if (/\bpassport\b/.test(text)) {
    const product = matchProduct(text);
    if (product) {
      return { type: "navigate", href: `/passport/${product.sku}`, description: `Passport for ${product.name}` };
    }
    return { type: "navigate", href: "/passport", description: "Digital Product Passports" };
  }

  // Anything remaining that sounds like a fit question → Concierge
  if (
    /\b(fit|fitting|need|help|recommend|suggestion|wear|dress|wheelchair|stroke|condition)\b/.test(text)
  ) {
    return { type: "concierge", query: transcript };
  }

  return { type: "unknown" };
}
