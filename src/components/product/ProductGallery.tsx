"use client";

import { useState } from "react";
import Image from "next/image";

export interface ImageMeta {
  alt: string;
  blurDataURL: string;
}

interface ProductGalleryProps {
  productName: string;
  images: string[];
  imageMeta: ImageMeta[];
}

export function ProductGallery({
  productName,
  images,
  imageMeta,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    }
  }

  const activeSrc = images[activeIndex];
  const activeMeta = imageMeta[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main display */}
      <div className="relative h-96 rounded-xl overflow-hidden border border-[#D4C9BA]">
        {activeSrc && activeMeta ? (
          <Image
            src={activeSrc}
            alt={activeMeta.alt}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={activeMeta.blurDataURL}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={activeIndex === 0}
          />
        ) : (
          <div
            className="h-full bg-[#E8DFD2] flex items-center justify-center"
            role="img"
            aria-label={`${productName}, image unavailable`}
          >
            <span className="font-playfair text-xl text-[#5A5A5A] text-center px-6">
              {productName}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex gap-3" role="group" aria-label="Product views">
          {images.map((src, i) => {
            const meta = imageMeta[i];
            return (
              <button
                key={src}
                type="button"
                aria-label={`View ${productName}, ${meta?.alt ?? `angle ${i + 1}`}`}
                aria-pressed={activeIndex === i}
                onClick={() => setActiveIndex(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
                  activeIndex === i
                    ? "border-[#C29E5F]"
                    : "border-[#D4C9BA] opacity-60 hover:opacity-100"
                }`}
              >
                {meta && (
                  <Image
                    src={src}
                    alt={meta.alt}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={meta.blurDataURL}
                    sizes="80px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
