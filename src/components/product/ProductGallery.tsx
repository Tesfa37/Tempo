"use client";

import { useState } from "react";

interface ProductGalleryProps {
  productName: string;
  imageCount: number;
  gradient?: string;
}

const THUMB_GRADIENTS = [
  "from-[#C29E5F] to-[#E8DFD2]",
  "from-[#7A8B75] to-[#D4C9BA]",
  "from-[#C4725A] to-[#E8DFD2]",
];

export function ProductGallery({
  productName,
  imageCount,
  gradient = "from-[#C29E5F] to-[#E8DFD2]",
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const thumbnailCount = Math.min(imageCount, 3);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main display */}
      <div
        className={`h-96 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-[#D4C9BA]`}
        role="img"
        aria-label={`${productName} — product view ${activeIndex + 1}`}
      >
        <span className="font-playfair text-xl text-white/80 text-center px-6">
          {productName}
        </span>
      </div>

      {/* Thumbnail row */}
      <div className="flex gap-3" role="group" aria-label="Product views">
        {Array.from({ length: thumbnailCount }, (_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={0}
            aria-label={`View ${productName} — angle ${i + 1}`}
            aria-pressed={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`h-20 w-20 rounded-lg bg-gradient-to-br ${THUMB_GRADIENTS[i] ?? THUMB_GRADIENTS[0]} border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
              activeIndex === i
                ? "border-[#C29E5F]"
                : "border-[#D4C9BA] opacity-60 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
