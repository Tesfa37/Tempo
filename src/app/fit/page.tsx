import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/data/products";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "AI Virtual Fitting | Tempo",
  description: "See any Tempo garment on your own image before you buy. Wheelchair mode adjusts for seated body positioning. Your camera feed never leaves your device.",
  alternates: { canonical: "/fit" },
};

function buildVirtualFittingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Virtual Fitting",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: "https://tempo.style/fit",
    description: "AI-powered garment preview that runs entirely in your browser. Wheelchair mode adjusts for seated body positioning. No images are uploaded or stored.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time AI garment positioning",
      "Wheelchair mode for seated body positioning",
      "On-device processing, no data uploaded",
    ],
    provider: {
      "@type": "Organization",
      name: "Tempo",
      url: "https://tempo.style",
    },
  };
}

const tryOnProducts = products.filter(
  (p) => p.productType === "top" || p.productType === "bottom" || p.category === "tops" || p.category === "bottoms" || p.category === "dresses" || p.category === "outerwear"
);

export default function FitLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <StructuredData data={buildVirtualFittingSchema()} />

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface)] border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[var(--ink-primary)] mb-4">
            AI Virtual Fitting
          </h1>
          <p className="font-sans text-xl text-[var(--ink-secondary)] mb-6">
            See it before you buy it.
          </p>
          <p className="font-sans text-base text-[var(--ink-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
            Our AI positions the garment in real time. Wheelchair mode adjusts for seated body positioning. Your camera feed never leaves your device.
          </p>

          {/* Wheelchair mode feature callout */}
          <div className="inline-flex items-center gap-3 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl px-6 py-4 text-left">
            <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center" aria-hidden="true">
              <span className="text-[var(--accent)] text-lg font-bold">W</span>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-[var(--ink-primary)]">Wheelchair Mode</p>
              <p className="font-sans text-xs text-[var(--ink-secondary)]">Adjusts garment positioning for seated body proportions. Toggle with the W key during a session.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="fit-products-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="fit-products-heading" className="font-serif text-3xl font-semibold text-[var(--ink-primary)] mb-8">
            Choose a garment to try
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tryOnProducts.map((product) => (
              <Link
                key={product.id}
                href={`/fit/${product.slug}`}
                className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-md tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <div className="aspect-square bg-[var(--border)]" aria-hidden="true" />
                <div className="p-3">
                  <p className="font-sans text-sm font-medium text-[var(--ink-primary)] truncate group-hover:text-[var(--accent)] tempo-transition">
                    {product.name}
                  </p>
                  <p className="font-sans text-xs text-[var(--ink-secondary)] mt-0.5">${product.price}</p>
                  <p className="font-sans text-xs text-[var(--accent)] mt-1 font-medium">Try with AI Virtual Fitting</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy note */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface)] border-t border-[var(--border)]">
        <p className="max-w-2xl mx-auto text-center font-sans text-sm text-[var(--ink-secondary)]">
          All processing runs locally in your browser. No frames are uploaded, transmitted, or stored. Nothing about you leaves your device.
        </p>
      </section>
    </div>
  );
}
