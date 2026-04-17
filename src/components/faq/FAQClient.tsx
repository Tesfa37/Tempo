"use client";

import { useState, useDeferredValue, useMemo, useId } from "react";
import { Accordion } from "@base-ui/react/accordion";
import type { FAQCategory } from "@/data/faq";

interface Props {
  categories: FAQCategory[];
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-[#9A9A9A] motion-safe:transition-transform duration-200"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoryAccordion({
  category,
  highlightQuery,
}: {
  category: FAQCategory;
  highlightQuery?: string;
}) {
  return (
    <section aria-labelledby={`cat-${category.id}`}>
      <h2
        id={`cat-${category.id}`}
        className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-3"
      >
        {category.label}
      </h2>
      <Accordion.Root
        aria-label={`${category.label} questions`}
        className="flex flex-col gap-1"
      >
        {category.items.map((item) => (
          <Accordion.Item
            key={item.id}
            value={item.id}
            className="border border-[#D4C9BA] rounded-lg bg-[#FAFAF7] overflow-hidden"
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#1A1A1A] hover:bg-[#F0EBE3] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C29E5F] [&[data-panel-open]>svg]:rotate-180">
                <span>
                  {highlightQuery
                    ? highlightMatch(item.q, highlightQuery)
                    : item.q}
                </span>
                <ChevronIcon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="px-5 pb-4 pt-1 text-sm text-[#5A5A5A] leading-relaxed border-t border-[#D4C9BA]">
              {item.a}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#F7EDD4] text-[#1A1A1A] rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function FAQClient({ categories }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const srStatusId = useId();

  const allItems = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.items.map((item) => ({ ...item, categoryLabel: cat.label, categoryId: cat.id }))
      ),
    [categories]
  );

  const searchResults = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return null;
    return allItems.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [deferredQuery, allItems]);

  const isSearching = query.trim().length > 0;

  return (
    <div>
      {/* Search */}
      <div role="search" className="mb-10">
        <label
          htmlFor="faq-search"
          className="block text-sm font-medium text-[#1A1A1A] mb-2"
        >
          Search questions
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
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. magnetic closures, HSA, return window"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            aria-describedby={srStatusId}
            aria-controls="faq-results"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <span id={srStatusId} aria-live="polite" className="sr-only">
          {searchResults !== null
            ? `${searchResults.length} question${searchResults.length === 1 ? "" : "s"} found`
            : ""}
        </span>
      </div>

      {/* Results */}
      <div id="faq-results">
        {isSearching && searchResults !== null ? (
          searchResults.length === 0 ? (
            <div className="text-center py-16 text-[#5A5A5A]">
              <p className="text-lg font-medium text-[#1A1A1A] mb-2">
                No questions found
              </p>
              <p className="text-sm">
                Try different words, or{" "}
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                >
                  browse all categories
                </button>
                .
              </p>
            </div>
          ) : (
            <section aria-label={`Search results for "${deferredQuery.trim()}"`}>
              <p className="text-xs text-[#9A9A9A] mb-4" aria-hidden="true">
                {searchResults.length} result
                {searchResults.length === 1 ? "" : "s"}
              </p>
              <Accordion.Root className="flex flex-col gap-1">
                {searchResults.map((item) => (
                  <Accordion.Item
                    key={item.id}
                    value={item.id}
                    className="border border-[#D4C9BA] rounded-lg bg-[#FAFAF7] overflow-hidden"
                  >
                    <Accordion.Header className="flex">
                      <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#1A1A1A] hover:bg-[#F0EBE3] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C29E5F]">
                        <span className="flex flex-col gap-1 items-start">
                          <span className="text-xs font-normal text-[#7A8B75]">
                            {item.categoryLabel}
                          </span>
                          <span>
                            {highlightMatch(item.q, deferredQuery.trim())}
                          </span>
                        </span>
                        <ChevronIcon />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="px-5 pb-4 pt-1 text-sm text-[#5A5A5A] leading-relaxed border-t border-[#D4C9BA]">
                      {item.a}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </section>
          )
        ) : (
          <div className="flex flex-col gap-10">
            {categories.map((cat) => (
              <CategoryAccordion key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
