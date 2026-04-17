"use client";

import { useState } from "react";
import type { Category, Condition } from "@/data/products";

export interface FilterState {
  category: Category | "all";
  conditions: Condition[];
  sizes: string[];
  price: "any" | "under80" | "80to100" | "100to130" | "130plus";
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const CATEGORIES: { value: FilterState["category"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
];

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "post-stroke", label: "Post-Stroke" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "sensory", label: "Sensory" },
  { value: "arthritis", label: "Arthritis" },
  { value: "dementia", label: "Dementia" },
  { value: "limited-mobility", label: "Limited Mobility" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

const PRICE_OPTIONS: { value: FilterState["price"]; label: string }[] = [
  { value: "any", label: "Any price" },
  { value: "under80", label: "Under $80" },
  { value: "80to100", label: "$80 – $100" },
  { value: "100to130", label: "$100 – $130" },
  { value: "130plus", label: "$130+" },
];

function SectionToggle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const sectionId = `filter-section-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="border-b border-[#D4C9BA] pb-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={sectionId}
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left text-sm font-semibold text-[#1A1A1A] py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
      >
        {label}
        <span aria-hidden="true" className="text-[#5A5A5A] text-base leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div id={sectionId} className="mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  function setCategory(cat: FilterState["category"]) {
    onChange({ ...filters, category: cat });
  }

  function toggleCondition(cond: Condition) {
    const next = filters.conditions.includes(cond)
      ? filters.conditions.filter((c) => c !== cond)
      : [...filters.conditions, cond];
    onChange({ ...filters, conditions: next });
  }

  function toggleSize(size: string) {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: next });
  }

  function setPrice(price: FilterState["price"]) {
    onChange({ ...filters, price });
  }

  return (
    <aside
      className="space-y-1"
      aria-label="Product filters"
    >
      <h2 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-4">
        Filters
      </h2>

      {/* Category */}
      <SectionToggle label="Category">
        <fieldset>
          <legend className="sr-only">Category</legend>
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={filters.category === cat.value}
                onChange={() => setCategory(cat.value)}
                className="w-4 h-4 accent-[#C29E5F] focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
              <span className="text-sm text-[#5A5A5A] group-hover:text-[#1A1A1A] transition-colors">
                {cat.label}
              </span>
            </label>
          ))}
        </fieldset>
      </SectionToggle>

      {/* Condition */}
      <SectionToggle label="Condition">
        <fieldset>
          <legend className="sr-only">Condition</legend>
          {CONDITIONS.map((cond) => (
            <label
              key={cond.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={cond.value}
                checked={filters.conditions.includes(cond.value)}
                onChange={() => toggleCondition(cond.value)}
                className="w-4 h-4 accent-[#C29E5F] focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
              <span className="text-sm text-[#5A5A5A] group-hover:text-[#1A1A1A] transition-colors">
                {cond.label}
              </span>
            </label>
          ))}
        </fieldset>
      </SectionToggle>

      {/* Size */}
      <SectionToggle label="Size">
        <fieldset>
          <legend className="sr-only">Size</legend>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <label key={size} className="cursor-pointer">
                <input
                  type="checkbox"
                  value={size}
                  checked={filters.sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="sr-only"
                />
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-[#C29E5F] ${
                    filters.sizes.includes(size)
                      ? "border-[#C29E5F] bg-[#C29E5F]/10 text-[#1A1A1A]"
                      : "border-[#D4C9BA] text-[#5A5A5A] hover:border-[#C29E5F]"
                  }`}
                >
                  {size}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </SectionToggle>

      {/* Price */}
      <SectionToggle label="Price">
        <fieldset>
          <legend className="sr-only">Price range</legend>
          {PRICE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="price"
                value={opt.value}
                checked={filters.price === opt.value}
                onChange={() => setPrice(opt.value)}
                className="w-4 h-4 accent-[#C29E5F] focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
              <span className="text-sm text-[#5A5A5A] group-hover:text-[#1A1A1A] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </fieldset>
      </SectionToggle>
    </aside>
  );
}
