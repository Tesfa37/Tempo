"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, QrCode, Users, Zap } from "lucide-react";
import { products } from "@/data/products";

// ─── Four Pillars Data ───────────────────────────────────────────────────────

const pillars = [
  {
    icon: Zap,
    title: "Adaptive Design",
    body: "Visible, not hidden. Designed with disabled advisors. No sartorial assimilation.",
  },
  {
    icon: Leaf,
    title: "Sustainable Materials",
    body: "GOTS organic cotton. Fair Trade certified. Traceable to the field.",
  },
  {
    icon: QrCode,
    title: "Digital Product Passport",
    body: "Scan any garment. Know exactly what it is made of and where it came from. ESPR-ready for 2027.",
  },
  {
    icon: Users,
    title: "Caregiver-First UX",
    body: "Toggle Caregiver Mode. Time-to-dress estimates, sterilization labels, condition filters — your workflow, respected.",
  },
];

// ─── Gradient palette per product index ─────────────────────────────────────

const gradients = [
  "from-[#C29E5F] to-[#E8DFD2]",
  "from-[#7A8B75] to-[#E8DFD2]",
  "from-[#C4725A] to-[#E8DFD2]",
  "from-[#D4C9BA] to-[#FAFAF7]",
  "from-[#C29E5F] to-[#7A8B75]",
  "from-[#1A1A1A] to-[#5A5A5A]",
];

// ─── Newsletter Section (client-only interactive part) ───────────────────────

function NewsletterSection() {
  const [tab, setTab] = useState<"self" | "carer">("self");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <section
      className="bg-[#1A1A1A] py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          id="newsletter-heading"
          className="font-playfair text-3xl font-bold text-[#FAFAF7] mb-4"
        >
          Stay in the loop
        </h2>
        <p className="text-[#D4C9BA] mb-8">
          New collections, product launches, and care guides — straight to your inbox.
        </p>

        {/* Tab toggle */}
        <div
          role="tablist"
          aria-label="Shopping context"
          className="flex w-full max-w-sm rounded-lg overflow-hidden border border-[#5A5A5A] mb-8 mx-auto"
        >
          <button
            role="tab"
            aria-selected={tab === "self"}
            onClick={() => setTab("self")}
            className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
              tab === "self"
                ? "bg-[#C29E5F] text-[#1A1A1A]"
                : "bg-transparent text-[#9A9A9A] hover:bg-[#2A2A2A]"
            }`}
          >
            For myself
          </button>
          <button
            role="tab"
            aria-selected={tab === "carer"}
            onClick={() => setTab("carer")}
            className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
              tab === "carer"
                ? "bg-[#C29E5F] text-[#1A1A1A]"
                : "bg-transparent text-[#9A9A9A] hover:bg-[#2A2A2A]"
            }`}
          >
            For someone I care for
          </button>
        </div>

        {submitted ? (
          <p className="text-[#7A8B75] text-lg font-medium mt-4" role="status">
            You are on the list. We will be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label={
              tab === "self"
                ? "Newsletter sign-up for shoppers"
                : "Newsletter sign-up for caregivers"
            }
          >
            <div className="flex-1">
              <label
                htmlFor="newsletter-email"
                className="sr-only"
              >
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  tab === "self"
                    ? "your@email.com"
                    : "your.work@email.com"
                }
                className="w-full px-4 py-3 rounded-lg bg-[#2A2A2A] text-[#FAFAF7] placeholder-[#5A5A5A] border border-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#7A8B75] text-white font-medium text-sm hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] whitespace-nowrap"
            >
              Keep me posted
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="bg-[#E8DFD2] py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h1
            id="hero-heading"
            className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1A1A1A] leading-tight mb-6"
          >
            Clothes that move<br className="hidden sm:block" /> at your pace.
          </h1>
          <p className="text-[#5A5A5A] text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            Every morning, for 90 hours a year, a pair of ordinary pants stood
            between dignity and independence. Tempo was built to give those
            minutes back. Adaptive design, sustainable materials, every garment
            a product you can trust completely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/shop"
              className="inline-block bg-[#7A8B75] text-white font-medium px-8 py-4 rounded-lg hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] text-base"
            >
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="inline-block text-[#C29E5F] font-medium px-2 py-4 underline underline-offset-4 hover:text-[#a8874f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded text-base"
            >
              Learn about our mission
            </Link>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ──────────────────────────────────────────────────── */}
      <section
        className="bg-[#FAFAF7] py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="pillars-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="pillars-heading"
            className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-12 text-center"
          >
            Four pillars. All non-negotiable.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E8DFD2] flex items-center justify-center">
                    <Icon
                      size={20}
                      className="text-[#C29E5F]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A]">
                    {pillar.title}
                  </h3>
                  <p className="text-[#5A5A5A] text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products Row ──────────────────────────────────────────── */}
      <section
        className="bg-[#E8DFD2] py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="collection-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="collection-heading"
            className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-12"
          >
            The collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <article
                key={product.id}
                className={`bg-[#FAFAF7] rounded-xl overflow-hidden border transition-shadow hover:shadow-md ${
                  product.isFeatured
                    ? "border-[#C29E5F] ring-1 ring-[#C29E5F]/30"
                    : "border-[#D4C9BA]"
                }`}
              >
                {/* Placeholder image */}
                <div
                  className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}
                  aria-hidden="true"
                >
                  {product.isFeatured && (
                    <span className="bg-[#C29E5F] text-white text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#C29E5F] font-semibold mb-3">
                    ${product.price}
                  </p>

                  {/* Condition badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Conditions">
                    {product.conditions.map((condition) => (
                      <span
                        key={condition}
                        role="listitem"
                        className="text-xs bg-[#E8DFD2] text-[#5A5A5A] px-2 py-0.5 rounded-full border border-[#D4C9BA]"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/shop/${product.slug}`}
                    className="inline-block text-sm font-medium text-[#7A8B75] hover:text-[#5a6b55] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                  >
                    View details
                    <span className="sr-only"> for {product.name}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}
