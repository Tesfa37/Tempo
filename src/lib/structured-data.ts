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
