"use client";

import { useState, useDeferredValue, useMemo, useId } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

export type SearchItem = {
  type: "product" | "passport" | "faq";
  title: string;
  body: string;
  href: string;
  category: string;
};

const TYPE_BADGE: Record<SearchItem["type"], string> = {
  product: "bg-[#7A8B75]/10 text-[#7A8B75] border-[#7A8B75]/20",
  passport: "bg-[#C29E5F]/10 text-[#C29E5F] border-[#C29E5F]/20",
  faq: "bg-[#C4725A]/10 text-[#C4725A] border-[#C4725A]/20",
};

const TYPE_LABEL: Record<SearchItem["type"], string> = {
  product: "Product",
  passport: "Passport",
  faq: "FAQ",
};

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Shop all", href: "/shop" },
  { label: "Digital Product Passports", href: "/passport" },
  { label: "Sizing and fit FAQ", href: "/faq#cat-sizing" },
  { label: "Adaptive features", href: "/faq#cat-adaptive" },
  { label: "Financial support", href: "/financial-support" },
  { label: "Shipping and returns", href: "/shipping-returns" },
];

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const srStatusId = useId();

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 2 },
          { name: "body", weight: 1 },
          { name: "category", weight: 0.5 },
        ],
        threshold: 0.38,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [items]
  );

  const results = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) return null;
    return fuse.search(q).map((r) => r.item);
  }, [fuse, deferredQuery]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-3">
        Search
      </h1>
      <p className="text-[#5A5A5A] text-base mb-10">
        {items.length} items indexed across products, passports, and FAQs.
      </p>

      {/* Search bar */}
      <div role="search" className="mb-10" aria-label="Site search">
        <label
          htmlFor="site-search"
          className="block text-sm font-medium text-[#1A1A1A] mb-2"
        >
          Search everything
        </label>
        <div className="relative">
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
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. magnetic closures, GOTS cotton, HSA"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-10 pr-10 py-3.5 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            aria-describedby={srStatusId}
            aria-controls="search-results"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
        <span id={srStatusId} aria-live="polite" className="sr-only">
          {results !== null
            ? `${results.length} result${results.length === 1 ? "" : "s"} found`
            : ""}
        </span>
      </div>

      {/* Results */}
      <div id="search-results">
        {isSearching && results !== null ? (
          results.length === 0 ? (
            <div className="text-center py-16 text-[#5A5A5A]">
              <p className="text-lg font-medium text-[#1A1A1A] mb-2">
                No results found
              </p>
              <p className="text-sm">
                Try different words, or{" "}
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                >
                  browse by category
                </button>
                .
              </p>
            </div>
          ) : (
            <section aria-label={`Search results for "${deferredQuery.trim()}"`}>
              <p className="text-xs text-[#9A9A9A] mb-4" aria-hidden="true">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {results.map((item, i) => (
                  <li key={`${item.href}-${i}`}>
                    <Link
                      href={item.href}
                      className="flex flex-col gap-1.5 bg-[#FAFAF7] border border-[#D4C9BA] rounded-lg px-5 py-4 hover:border-[#C29E5F] hover:shadow-sm motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] group"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_BADGE[item.type]}`}
                        >
                          {TYPE_LABEL[item.type]}
                        </span>
                        <span className="text-xs text-[#9A9A9A]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#C29E5F] motion-safe:transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#5A5A5A] leading-relaxed line-clamp-2">
                        {item.body}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        ) : (
          <section aria-label="Quick links">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9A9A9A] mb-4">
              Quick links
            </h2>
            <ul className="flex flex-col gap-2" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between bg-[#FAFAF7] border border-[#D4C9BA] rounded-lg px-5 py-3.5 text-sm text-[#1A1A1A] hover:border-[#C29E5F] hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                  >
                    {link.label}
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-[#9A9A9A]"
                    >
                      <path
                        d="M6 12l4-4-4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
