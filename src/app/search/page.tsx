import type { Metadata } from "next";
import { products } from "@/data/products";
import { passports } from "@/data/passports";
import { FAQ_CATEGORIES } from "@/data/faq";
import { SearchClient, type SearchItem } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search | Tempo",
  description:
    "Search across Tempo adaptive clothing products, digital product passports, and frequently asked questions.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  const items: SearchItem[] = [
    ...products.map((p) => ({
      type: "product" as const,
      title: p.name,
      body: p.description,
      href: `/shop/${p.slug}`,
      category: p.category,
    })),
    ...Object.values(passports).map((p) => ({
      type: "passport" as const,
      title: `${p.productName} Passport`,
      body: `${p.materialComposition.map((m) => m.fiber).join(", ")}. Made in ${p.countryOfOrigin}. ${p.certifications.map((c) => c.name).join(", ")}.`,
      href: `/passport/${p.sku}`,
      category: "Digital Product Passport",
    })),
    ...FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        type: "faq" as const,
        title: item.q,
        body: item.a,
        href: `/faq#cat-${cat.id}`,
        category: cat.label,
      }))
    ),
  ];

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <SearchClient items={items} />
    </div>
  );
}
