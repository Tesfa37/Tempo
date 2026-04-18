"use client";

import Link from "next/link";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  caregiverMode: boolean;
  gradientClass?: string;
}

export function ProductCard({
  product,
  caregiverMode,
  gradientClass = "from-[#C29E5F] to-[#E8DFD2]",
}: ProductCardProps) {
  return (
    <article
      className={`bg-[#FAFAF7] rounded-xl overflow-hidden border transition-shadow hover:shadow-md flex flex-col ${
        product.isFeatured
          ? "border-[#C29E5F] ring-1 ring-[#C29E5F]/30"
          : "border-[#D4C9BA]"
      }`}
    >
      {/* Placeholder image gradient */}
      <div className="relative">
        <div
          className={`h-44 bg-gradient-to-br ${gradientClass} relative flex items-center justify-center`}
          aria-hidden="true"
        >
          {product.isFeatured && (
            <span className="absolute top-3 right-3 bg-[#C29E5F] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>
        {product.isNew && (
          <span
            aria-hidden="true"
            className="absolute top-3 left-3 bg-[#7A8B75] text-white text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            New
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-playfair text-base font-semibold text-[#1A1A1A] mb-1">
          {product.name}
        </h3>
        <p className="text-[#C29E5F] font-semibold text-sm mb-2">
          ${product.price}
        </p>

        {/* Condition badges */}
        <div
          className="flex flex-wrap gap-1 mb-3"
          role="list"
          aria-label="Conditions this garment supports"
        >
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

        {/* Caregiver mode extras */}
        {caregiverMode && (
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Caregiver information">
            <span className="inline-flex items-center text-xs bg-[#E8DFD2] text-[#5A5A5A] px-2 py-1 rounded border border-[#D4C9BA]">
              Time to Dress: {product.timeToDressMinutes} min
            </span>
            {product.sterilizationSafe && (
              <span className="inline-flex items-center text-xs bg-[#7A8B75]/15 text-[#7A8B75] px-2 py-1 rounded border border-[#7A8B75]/30 font-medium">
                Sterilization-Safe
              </span>
            )}
          </div>
        )}

        {/* Caregiver mode adaptive features */}
        {caregiverMode && product.adaptiveFeatures.length > 0 && (
          <ul className="mb-3 space-y-1">
            {product.adaptiveFeatures.slice(0, 2).map((feature) => (
              <li
                key={feature.name}
                className="text-xs text-[#5A5A5A] flex items-start gap-1.5"
              >
                <span className="text-[#C29E5F] mt-0.5 shrink-0" aria-hidden="true">
                  +
                </span>
                <span>{feature.name}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm font-medium text-[#7A8B75] hover:text-[#5a6b55] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            View details
            <span className="sr-only"> for {product.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
