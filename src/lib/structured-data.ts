export function buildOrganization(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://tempo.style/#organization",
    name: "Tempo",
    url: "https://tempo.style",
    logo: {
      "@type": "ImageObject",
      url: "https://tempo.style/og-logo.png",
      width: 512,
      height: 512,
    },
    description:
      "Sustainable adaptive fashion brand. Adaptive-first design, GOTS-certified materials, Digital Product Passports, and a Caregiver-First shopping experience.",
    sameAs: [
      "https://instagram.com/tempoadaptive",
      "https://twitter.com/tempoadaptive",
      "https://linkedin.com/company/tempo-adaptive",
    ],
    founder: [
      {
        "@type": "Person",
        name: "Tesfa Desta",
        jobTitle: "Co-Founder",
        url: "https://tempo.style/about",
      },
      {
        "@type": "Person",
        name: "Bityana Yishak",
        jobTitle: "Co-Founder",
        url: "https://tempo.style/about",
      },
    ],
    accessibilityStatement: "https://tempo.style/accessibility",
  };
}

import type { Product } from "@/data/products";

export function buildBreadcrumbList(
  items: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildProductSchema(product: Product): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: product.sku,
    gtin14: product.gtin,
    image: product.images.map((img) => `https://tempo.style${img}`),
    brand: {
      "@type": "Brand",
      name: "Tempo",
    },
    additionalProperty: product.adaptiveFeatures.map((f) => ({
      "@type": "PropertyValue",
      name: f.name,
      value: f.description,
    })),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.variants.some((v) => v.inStock)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: "2026-12-31",
      url: `https://tempo.style/shop/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Tempo",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5,
      reviewCount: 4,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Diane S." },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        reviewBody:
          "I've been putting on pants by myself for the first time in two years. The magnetic closure is genuinely invisible when dressed.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Renata M." },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        reviewBody:
          "The seated cut is the real innovation here. These fit as if they were measured for me.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Marcus, Home Care Aide" },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        reviewBody:
          "These reduce my morning dressing time by about 8 minutes per client. That's real.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Jennifer, Occupational Therapist" },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        reviewBody:
          "I recommend these to every post-stroke client I see now. The magnetic closure opens reliably with one hand.",
      },
    ],
  };
}
