"use client";

import { useState } from "react";

export function NewsletterSection() {
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
          New collections, product launches, and care guides, straight to your inbox.
        </p>

        <div
          role="tablist"
          aria-label="Shopping context"
          className="flex w-full max-w-sm rounded-lg overflow-hidden border border-[#5A5A5A] mb-8 mx-auto"
        >
          <button
            role="tab"
            aria-selected={tab === "self"}
            onClick={() => setTab("self")}
            className={`flex-1 px-3 py-2.5 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
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
            className={`flex-1 px-3 py-2.5 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
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
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tab === "self" ? "your@email.com" : "your.work@email.com"}
                className="w-full px-4 py-3 rounded-lg bg-[#2A2A2A] text-[#FAFAF7] placeholder-[#5A5A5A] border border-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#7A8B75] text-white font-medium text-sm hover:bg-[#6a7a65] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] whitespace-nowrap"
            >
              Keep me posted
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
