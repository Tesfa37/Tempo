"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

function NotFoundIllustration() {
  return (
    <svg
      aria-hidden="true"
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-8"
    >
      {/* Clothing rack */}
      <rect x="20" y="40" width="160" height="4" rx="2" fill="#D4C9BA" />
      <line x1="100" y1="44" x2="100" y2="150" stroke="#D4C9BA" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="36" r="6" stroke="#C29E5F" strokeWidth="2" fill="none" />
      {/* Hanging garment outline - empty hanger */}
      <path
        d="M65 44 Q65 80 50 100 Q40 116 50 124 Q58 130 75 128 Q90 126 90 110 Q90 90 100 80"
        stroke="#C29E5F"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="6 4"
      />
      {/* Question mark */}
      <text
        x="130"
        y="100"
        fontFamily="Georgia, serif"
        fontSize="48"
        fill="#D4C9BA"
        fontWeight="bold"
      >
        ?
      </text>
      {/* Small tag */}
      <rect x="42" y="118" width="22" height="14" rx="2" fill="#FAFAF7" stroke="#D4C9BA" strokeWidth="1.5" />
      <line x1="53" y1="114" x2="53" y2="118" stroke="#D4C9BA" strokeWidth="1.5" />
    </svg>
  );
}

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
    }
  }

  return (
    <div className="bg-[#E8DFD2] min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <NotFoundIllustration />

        <p className="text-sm font-semibold uppercase tracking-widest text-[#C29E5F] mb-3">
          404
        </p>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
          This page isn&apos;t in the collection.
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed mb-10">
          The page you&apos;re looking for may have moved, or it may never have
          existed. Let us help you find what you need.
        </p>

        {/* Search */}
        <form
          role="search"
          onSubmit={handleSearch}
          className="mb-8"
          aria-label="Search the shop"
        >
          <div className="flex gap-2">
            <label htmlFor="notfound-search" className="sr-only">
              Search our collection
            </label>
            <div className="relative flex-1">
              <svg
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] w-4 h-4 pointer-events-none"
                fill="none"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 17l-3.5-3.5M13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="notfound-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search our collection"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2] whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* CTAs */}
        <nav aria-label="Helpful links" className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#C29E5F] text-[#1A1A1A] text-sm font-semibold hover:bg-[#b08d4f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            Shop the collection
          </Link>
          <Link
            href="/passport"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#1A1A1A] text-[#1A1A1A] text-sm font-medium hover:bg-[#D4C9BA] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            Passport gallery
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D4C9BA] text-[#5A5A5A] text-sm font-medium hover:bg-[#D4C9BA] hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </div>
  );
}
