"use client";

import { useState } from "react";
import type { ProductVariant } from "@/data/products";

interface SizeSelectorProps {
  variants: ProductVariant[];
  onSizeChange?: (size: string | null) => void;
}

export function SizeSelector({ variants, onSizeChange }: SizeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(size: string, inStock: boolean) {
    if (!inStock) return;
    const next = selected === size ? null : size;
    setSelected(next);
    onSizeChange?.(next);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    size: string,
    inStock: boolean
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(size, inStock);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Size</p>
      <div
        role="radiogroup"
        aria-label="Select size"
        className="flex flex-wrap gap-2"
      >
        {variants.map((v) => (
          <button
            key={v.size}
            type="button"
            role="radio"
            aria-checked={selected === v.size}
            aria-disabled={!v.inStock}
            disabled={!v.inStock}
            onClick={() => handleSelect(v.size, v.inStock)}
            onKeyDown={(e) => handleKeyDown(e, v.size, v.inStock)}
            className={`h-11 min-w-[3rem] px-3 rounded-lg border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
              !v.inStock
                ? "border-[#D4C9BA] text-[#D4C9BA] cursor-not-allowed line-through"
                : selected === v.size
                ? "border-[#C29E5F] bg-[#C29E5F]/10 text-[#1A1A1A]"
                : "border-[#D4C9BA] text-[#5A5A5A] hover:border-[#C29E5F] hover:text-[#1A1A1A]"
            }`}
          >
            {v.size}
            {!v.inStock && <span className="sr-only">, out of stock</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
