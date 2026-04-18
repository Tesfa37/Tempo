import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brand Brief | Tempo",
  description:
    "Tempo's three-category architecture: Women, Men, and Adaptive, each a first-class storefront. The market thesis, unit economics, and design accountability framework behind the brand.",
  alternates: { canonical: "/brief" },
  robots: { index: false, follow: false },
};

const stats = [
  { value: "$54B", label: "Global adaptive clothing market by 2031", source: "Allied Market Research, 2023" },
  { value: "1 in 4", label: "U.S. adults live with a disability", source: "CDC, 2023" },
  { value: "12", label: "SKUs at launch, Women, Men, and Adaptive", source: "Tempo catalog" },
  { value: "5", label: "Disabled advisors compensated at $175/hr + royalties", source: "Tempo governance" },
];

const categories = [
  {
    label: "Women",
    slug: "women",
    description:
      "Tailored tops, adaptive bottoms, and outerwear designed for the full range of women's bodies, including those that don't fit the sample-size assumption. Every SKU carries a Digital Product Passport.",
    href: "/shop?gender=women",
  },
  {
    label: "Men",
    slug: "men",
    description:
      "Trousers, shirts, and layering pieces built with seated-cut geometry and one-hand-operable closures. No design feature is added as an afterthought.",
    href: "/shop?gender=men",
  },
  {
    label: "Adaptive",
    slug: "adaptive",
    description:
      "Garments co-designed with disabled advisors for wheelchair users, people with limited hand strength, and those with sensory sensitivities. This is not a sub-brand. It is a first-class storefront with its own design brief.",
    href: "/shop?gender=adaptive",
  },
];

const differentiators = [
  {
    heading: "Three co-equal storefronts",
    body:
      "Most adaptive fashion brands bury adaptive clothing in a sub-menu. Tempo's primary navigation gives Women, Men, and Adaptive equal billing. The URL structure, filtering system, and product hierarchy treat them identically.",
  },
  {
    heading: "Caregiver Mode is a product spec",
    body:
      "Every product carries a time-to-dress estimate and a sterilization compatibility flag. Caregiver Mode surfaces these on the shop page as filterable data points, not marketing copy. This serves institutional buyers, home care agencies, and family caregivers.",
  },
  {
    heading: "Digital Product Passports",
    body:
      "Every garment ships with an ESPR-aligned Digital Product Passport, accessible via QR code at the tag. Fiber origin, certifications, carbon footprint, factory location, and sterilization notes are all publicly readable.",
  },
  {
    heading: "AI Virtual Fitting",
    body:
      "On-device garment preview with wheelchair mode, which adjusts positioning for seated body proportions. No frames are uploaded or stored. This is accessibility, not novelty.",
  },
  {
    heading: "Match-Set Builder",
    body:
      "A pairing tool that uses adaptive compatibility scoring to suggest tops and bottoms that work together functionally, not just visually. Built with the needs of one-hand dressers and caregivers in mind.",
  },
  {
    heading: "Advisor accountability",
    body:
      "Five disabled advisors are compensated at $175 per hour plus a 0.5 percent royalty on pieces they co-designed. Compensation is disclosed annually. Advisors have veto authority over product copy and marketing language.",
  },
];

export default function BriefPage() {
  return (
    <div className="bg-[#E8DFD2] min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-[#C29E5F] uppercase tracking-widest mb-6">
            Brand Brief, CICDC 2026
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#FAFAF7] leading-tight mb-8">
            Adaptive fashion built as a category, not a charity.
          </h1>
          <p className="text-[#D4C9BA] text-base sm:text-lg leading-relaxed mb-6">
            Tempo offers three co-equal categories: Women, Men, and Adaptive.
            Adaptive is not a sub-page, a sub-brand, or a sub-category. It is a
            primary navigation item with its own design brief, its own product
            team, and its own co-designers, all of whom are disabled and all of
            whom are compensated.
          </p>
          <p className="text-[#D4C9BA] text-base sm:text-lg leading-relaxed">
            This brief covers the market thesis, the product architecture, the
            accountability framework, and the technology stack. It is the
            document we use internally when we ask: are we doing what we said we
            would do?
          </p>
        </div>
      </section>

      {/* ── Market Stats ─────────────────────────────────────────────────────── */}
      <section
        className="bg-[#FAFAF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4C9BA]"
        aria-labelledby="stats-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="stats-heading"
            className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-10 text-center"
          >
            The market case
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl p-5 flex flex-col gap-2"
              >
                <p className="font-playfair text-3xl font-bold text-[#C29E5F]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#1A1A1A] font-medium leading-snug">
                  {stat.label}
                </p>
                <p className="text-xs text-[#9A9A9A] mt-auto">{stat.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Architecture ────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="categories-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mb-10">
            <h2
              id="categories-heading"
              className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-4"
            >
              Category architecture
            </h2>
            <p className="text-[#5A5A5A] text-base leading-relaxed">
              Each category has identical navigation weight, identical filtering
              logic, and identical product data depth. No category is easier to
              find or harder to browse than another.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4"
              >
                <h3 className="font-playfair text-xl font-bold text-[#1A1A1A]">
                  {cat.label}
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed flex-1">
                  {cat.description}
                </p>
                <Link
                  href={cat.href}
                  className="text-sm font-medium text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                >
                  Browse {cat.label} <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiators ──────────────────────────────────────────────────── */}
      <section
        className="bg-[#FAFAF7] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4C9BA]"
        aria-labelledby="diff-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="diff-heading"
            className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-10"
          >
            What makes this defensible
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {differentiators.map((d, idx) => (
              <div
                key={idx}
                className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-3"
              >
                <div className="w-7 h-7 rounded-md bg-[#C29E5F] flex items-center justify-center shrink-0">
                  <span className="text-[#1A1A1A] font-bold text-xs" aria-hidden="true">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-playfair text-base font-semibold text-[#1A1A1A]">
                  {d.heading}
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <h2 className="font-playfair text-3xl font-bold text-[#FAFAF7]">
            See it working.
          </h2>
          <p className="text-[#D4C9BA] text-base leading-relaxed">
            The full catalog, Digital Product Passports, AI Virtual Fitting, and
            Match-Set Builder are live and navigable.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#C29E5F] text-[#1A1A1A] text-sm font-semibold px-6 py-3 rounded hover:bg-[#d4b06e] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
            >
              Browse the catalog
            </Link>
            <Link
              href="/fit"
              className="border border-[#C29E5F] text-[#C29E5F] text-sm font-semibold px-6 py-3 rounded hover:bg-[#C29E5F]/10 tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              Try Virtual Fitting
            </Link>
            <Link
              href="/about"
              className="border border-[#FAFAF7]/20 text-[#FAFAF7] text-sm font-semibold px-6 py-3 rounded hover:bg-[#FAFAF7]/10 tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAFAF7]/50"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
