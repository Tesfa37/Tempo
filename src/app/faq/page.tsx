import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_CATEGORIES } from "@/data/faq";
import { FAQClient } from "@/components/faq/FAQClient";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Tempo",
  description:
    "Answers to common questions about Tempo adaptive clothing: sizing, adaptive features, sustainability, Digital Product Passports, shipping and returns, and financial support.",
  openGraph: {
    title: "Frequently Asked Questions | Tempo",
    description:
      "Answers to common questions about Tempo adaptive clothing: sizing, adaptive features, sustainability, Digital Product Passports, shipping and returns, and financial support.",
    url: "https://tempo.style/faq",
    siteName: "Tempo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Frequently Asked Questions | Tempo",
    description:
      "Answers to common questions about Tempo adaptive clothing: sizing, adaptive features, sustainability, Digital Product Passports, shipping and returns, and financial support.",
  },
};

function buildFAQSchema() {
  const entities = FAQ_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  );
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entities,
  };
}

export default function FAQPage() {
  const totalQuestions = FAQ_CATEGORIES.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <>
      <StructuredData data={buildFAQSchema()} />
      <main className="bg-[#E8DFD2] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-[#5A5A5A]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-[#1A1A1A] font-medium" aria-current="page">
                  FAQ
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#5A5A5A] leading-relaxed mb-4">
            {totalQuestions} questions across {FAQ_CATEGORIES.length} topics.
            Use the search bar to find specific answers, or browse by category
            below.
          </p>

          {/* Category jump links */}
          <nav aria-label="Jump to category" className="mb-12">
            <ul className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#cat-${cat.id}`}
                    className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border border-[#D4C9BA] bg-[#FAFAF7] text-[#5A5A5A] hover:bg-[#F0EBE3] hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <FAQClient categories={FAQ_CATEGORIES} />
        </div>
      </main>
    </>
  );
}
