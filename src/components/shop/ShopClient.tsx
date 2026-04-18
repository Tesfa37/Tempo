"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar, type FilterState } from "@/components/shop/FilterSidebar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Product } from "@/data/products";

type GenderFilter = "women" | "men" | "adaptive";

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

function filterProducts(
  products: Product[],
  filters: FilterState,
  gender: GenderFilter | undefined
): Product[] {
  return products.filter((p) => {
    if (gender && p.gender !== gender) return false;
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
  initialGender?: GenderFilter;
}

const GENDER_CHIPS: { label: string; value: GenderFilter | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Adaptive", value: "adaptive" },
];

const VALID_GENDERS = ["women", "men", "adaptive"] as const;
function parseGender(raw: string | null): GenderFilter | undefined {
  return VALID_GENDERS.includes(raw as GenderFilter) ? (raw as GenderFilter) : undefined;
}

export function ShopClient({ products, initialGender }: ShopClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [gender, setGender] = useState<GenderFilter | undefined>(initialGender);
  const [caregiverMode, setCaregiverMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onPop() {
      const params = new URLSearchParams(window.location.search);
      setGender(parseGender(params.get("gender")));
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleGenderChip(value: GenderFilter | undefined) {
    setGender(value);
    if (value) {
      router.push(`/shop?gender=${value}`, { scroll: false });
    } else {
      router.push("/shop", { scroll: false });
    }
  }

  function resetAll() {
    setFilters(DEFAULT_FILTERS);
    setGender(undefined);
    router.push("/shop", { scroll: false });
  }

  const filtered = filterProducts(products, filters, gender);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-[var(--ink-primary)]">Shop</h1>
          <p className="text-[var(--ink-secondary)] text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Caregiver mode toggle, top right */}
        <div className="flex items-center gap-3">
          <span
            id="caregiver-toggle-label"
            className="text-sm font-medium text-[var(--ink-primary)]"
          >
            Caregiver Mode
          </span>
          <button
            role="switch"
            aria-checked={caregiverMode}
            aria-labelledby="caregiver-toggle-label"
            onClick={() => setCaregiverMode(!caregiverMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              caregiverMode ? "bg-[#7A8B75]" : "bg-[#D4C9BA]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white tempo-transition ${
                caregiverMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Gender chip row */}
      <div
        className="flex gap-2 mb-6 flex-wrap"
        role="group"
        aria-label="Filter by gender"
      >
        {GENDER_CHIPS.map((chip) => {
          const active = chip.value === gender;
          return (
            <button
              key={chip.label}
              onClick={() => handleGenderChip(chip.value)}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                active
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-transparent text-[var(--ink-primary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button + Sheet */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-medium text-[var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] hover:bg-[#E8DFD2] tempo-transition"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filter
                {(activeCount > 0 || gender) && (
                  <span className="ml-1 bg-[var(--accent)] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {activeCount + (gender ? 1 : 0)}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-playfair text-lg text-[var(--ink-primary)]">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4 overflow-y-auto">
                  <FilterSidebar filters={filters} onChange={setFilters} />
                  {(activeCount > 0 || gender) && (
                    <button
                      onClick={resetAll}
                      className="mt-6 flex items-center gap-1.5 text-sm text-[#C4725A] hover:text-[#a85a44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
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
          {(activeCount > 0 || gender) && (
            <div className="hidden lg:flex items-center gap-2 mb-4">
              <span className="text-sm text-[var(--ink-secondary)]">
                {activeCount + (gender ? 1 : 0)} active{" "}
                {activeCount + (gender ? 1 : 0) === 1 ? "filter" : "filters"}
              </span>
              <button
                onClick={resetAll}
                className="text-sm text-[#C4725A] hover:text-[#a85a44] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[var(--ink-secondary)] text-lg">
                No products match these filters.
              </p>
              <button
                onClick={resetAll}
                className="mt-4 text-sm text-[#7A8B75] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
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
