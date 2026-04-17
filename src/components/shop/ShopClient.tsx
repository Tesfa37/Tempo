"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar, type FilterState } from "@/components/shop/FilterSidebar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Product } from "@/data/products";

const GRADIENTS = [
  "from-[#C29E5F] to-[#E8DFD2]",
  "from-[#7A8B75] to-[#E8DFD2]",
  "from-[#C4725A] to-[#E8DFD2]",
  "from-[#D4C9BA] to-[#FAFAF7]",
  "from-[#C29E5F] to-[#7A8B75]",
  "from-[#1A1A1A] to-[#5A5A5A]",
];

function gradientForIndex(index: number): string {
  return GRADIENTS[index % GRADIENTS.length] ?? GRADIENTS[0]!;
}

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  conditions: [],
  sizes: [],
  price: "any",
};

function matchesPrice(price: number, range: FilterState["price"]): boolean {
  switch (range) {
    case "under80":
      return price < 80;
    case "80to100":
      return price >= 80 && price <= 100;
    case "100to130":
      return price > 100 && price <= 130;
    case "130plus":
      return price > 130;
    default:
      return true;
  }
}

function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (filters.category !== "all" && p.category !== filters.category) return false;
    if (
      filters.conditions.length > 0 &&
      !filters.conditions.some((c) => p.conditions.includes(c))
    )
      return false;
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some((s) => p.variants.some((v) => v.size === s))
    )
      return false;
    if (!matchesPrice(p.price, filters.price)) return false;
    return true;
  });
}

function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.category !== "all") count++;
  count += filters.conditions.length;
  count += filters.sizes.length;
  if (filters.price !== "any") count++;
  return count;
}

interface ShopClientProps {
  products: Product[];
}

export function ShopClient({ products }: ShopClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [caregiverMode, setCaregiverMode] = useState(false);

  const filtered = filterProducts(products, filters);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A]">Shop</h1>
          <p className="text-[#5A5A5A] text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Caregiver mode toggle — top right of grid */}
        <div className="flex items-center gap-3">
          <span
            id="caregiver-toggle-label"
            className="text-sm font-medium text-[#1A1A1A]"
          >
            Caregiver Mode
          </span>
          <button
            role="switch"
            aria-checked={caregiverMode}
            aria-labelledby="caregiver-toggle-label"
            onClick={() => setCaregiverMode(!caregiverMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
              caregiverMode ? "bg-[#7A8B75]" : "bg-[#D4C9BA]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                caregiverMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* ── Desktop sidebar ──────────────────────────────────────────── */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* ── Product grid (includes mobile filter button) ──────────────── */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button + Sheet */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm font-medium text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] hover:bg-[#E8DFD2] transition-colors"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filter
                {activeCount > 0 && (
                  <span className="ml-1 bg-[#C29E5F] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-playfair text-lg text-[#1A1A1A]">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4 overflow-y-auto">
                  <FilterSidebar filters={filters} onChange={setFilters} />
                  {activeCount > 0 && (
                    <button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="mt-6 flex items-center gap-1.5 text-sm text-[#C4725A] hover:text-[#a85a44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                    >
                      <X size={14} aria-hidden="true" />
                      Clear all filters
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Desktop clear filters */}
          {activeCount > 0 && (
            <div className="hidden lg:flex items-center gap-2 mb-4">
              <span className="text-sm text-[#5A5A5A]">
                {activeCount} active {activeCount === 1 ? "filter" : "filters"}
              </span>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-sm text-[#C4725A] hover:text-[#a85a44] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[#5A5A5A] text-lg">
                No products match these filters.
              </p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-4 text-sm text-[#7A8B75] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              role="list"
              aria-label="Products"
            >
              {filtered.map((product, index) => {
                const originalIndex = products.indexOf(product);
                return (
                  <div key={product.id} role="listitem">
                    <ProductCard
                      product={product}
                      caregiverMode={caregiverMode}
                      gradientClass={gradientForIndex(originalIndex >= 0 ? originalIndex : index)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
