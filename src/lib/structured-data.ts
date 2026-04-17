import type { DigitalProductPassport } from "@/data/passports";

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

export function buildPassportSchema(passport: DigitalProductPassport): object {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "DigitalDocument"],
    "@id": `https://tempo.style/passport/${passport.sku}`,
    name: passport.productName,
    sku: passport.sku,
    gtin14: passport.gtin,
    url: `https://tempo.style/passport/${passport.sku}`,
    brand: {
      "@type": "Brand",
      name: "Tempo",
    },
    material: passport.materialComposition
      .map((m) => `${m.percentage}% ${m.fiber}${m.certified && m.certificationBody ? ` (${m.certificationBody})` : ""}`)
      .join(", "),
    additionalProperty: [
      ...passport.materialComposition.map((m) => ({
        "@type": "PropertyValue",
        name: `Material: ${m.fiber}`,
        value: `${m.percentage}%${m.certified && m.certificationBody ? `, certified by ${m.certificationBody}` : ""}`,
      })),
      {
        "@type": "PropertyValue",
        name: "Recycled Content",
        value: `${passport.recycledContent}%`,
      },
      {
        "@type": "PropertyValue",
        name: "Country of Origin",
        value: passport.countryOfOrigin,
      },
      {
        "@type": "PropertyValue",
        name: "Carbon Footprint (kg CO2e)",
        value: `${passport.carbonFootprint.total}`,
      },
      {
        "@type": "PropertyValue",
        name: "Recyclability Score",
        value: `${passport.recyclabilityScore}/100`,
      },
      {
        "@type": "PropertyValue",
        name: "Passport Version",
        value: passport.passportVersion,
      },
      {
        "@type": "PropertyValue",
        name: "GS1 Digital Link",
        value: passport.gs1DigitalLinkUrl,
      },
    ],
    hasCertification: passport.certifications.map((cert) => ({
      "@type": "Certification",
      name: cert.name,
      certificationIdentification: cert.certificateNumber,
      issuedBy: {
        "@type": "Organization",
        name: cert.certificationBody,
      },
      validFrom: passport.issueDate,
      validThrough: cert.validUntil,
    })),
    dateCreated: passport.issueDate,
    dateModified: passport.lastUpdated,
  };
}

export function buildCollectionPageSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Digital Product Passports",
    description:
      "ESPR-aligned digital product passports for every Tempo garment. Material composition, certifications, carbon footprint, and care instructions.",
    url: "https://tempo.style/passport",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://tempo.style" },
        { "@type": "ListItem", position: 2, name: "Passports", item: "https://tempo.style/passport" },
      ],
    },
  };
}

export function buildAdvisorsSchema(
  advisors: Array<{
    name: string;
    role: string;
    knowsAbout: string;
  }>
): object[] {
  return advisors.map((advisor) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: advisor.name,
    jobTitle: advisor.role,
    worksFor: {
      "@type": "Organization",
      name: "Tempo",
      url: "https://tempo.style",
    },
    knowsAbout: advisor.knowsAbout,
    url: "https://tempo.style/about#advisors",
  }));
}

export function buildAccessibilityPageSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://tempo.style/accessibility",
    name: "Accessibility Statement, Tempo",
    url: "https://tempo.style/accessibility",
    description:
      "Tempo's commitment to WCAG 2.1 AA conformance, accessibility features, known limitations, and how to report accessibility barriers.",
    accessibilityAPI: ["ARIA"],
    accessibilityFeature: [
      "keyboard",
      "alternativeText",
      "readingOrder",
      "highContrast",
      "structuredNavigation",
    ],
    accessibilitySummary:
      "This site targets WCAG 2.1 AA conformance. All interactive elements are keyboard reachable with visible focus indicators. Images have meaningful alt text. Dynamic updates are announced via ARIA live regions. No auto-playing media. Motion is suppressed when prefers-reduced-motion is set.",
    isPartOf: {
      "@type": "WebSite",
      name: "Tempo",
      url: "https://tempo.style",
    },
  };
}
