"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import { getCompatibleBottoms, getCompatibleTops } from "@/lib/products";
import { useCartStore } from "@/store/cart";

// ---------------------------------------------------------------------------
// Inline swiper sub-component
// ---------------------------------------------------------------------------

interface SwiperProps {
  items: Product[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  kind: "top" | "bottom";
  pairingBadge?: boolean;
}

function ProductSwiper({
  items,
  currentIndex,
  onPrev,
  onNext,
  kind,
  pairingBadge,
}: SwiperProps) {
  const product = items[currentIndex];
  const label = kind === "top" ? "top" : "bottom";
  const total = items.length;
  const position = currentIndex + 1;

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    }
  }

  if (!product) return null;

  const imageSrc = product.images[0] ?? null;

  return (
    <div className="flex flex-col">
      {pairingBadge && (
        <p className="text-xs font-medium text-[var(--accent)] mb-2">
          Matches this top
        </p>
      )}

      {/* Swiper container — keyboard navigable */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        aria-label={`${label} swiper, use arrow keys to navigate`}
      >
        {/* Product image */}
        <div className="aspect-square bg-[var(--border)] rounded-xl mb-4 overflow-hidden relative tempo-transition">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${product.name} product image`}
              fill
              unoptimized={imageSrc.endsWith(".svg")}
              className="object-cover tempo-transition"
            />
          ) : (
            <div className="w-full h-full bg-[var(--border)]" />
          )}
        </div>

        {/* Product info */}
        <p className="font-serif text-xl font-semibold text-[var(--ink-primary)] mb-1">
          {product.name}
        </p>
        <p className="font-sans text-base text-[var(--ink-secondary)] mb-4">
          ${product.price}
        </p>

        {/* Navigation row */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            aria-label={`Previous ${label}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="text-sm text-[var(--ink-secondary)]">
            {position} of {total}
          </span>

          <button
            onClick={onNext}
            aria-label={`Next ${label}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Screen-reader live announcement */}
      <span
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {product.name}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini card for "Your set" preview
// ---------------------------------------------------------------------------

function MiniCard({ product }: { product: Product | undefined }) {
  if (!product) {
    return (
      <div className="flex-1 min-w-[140px] max-w-[200px] bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] p-3">
        <div className="aspect-square bg-[var(--border)] rounded-lg mb-2" />
        <p className="font-sans text-sm font-medium text-[var(--ink-secondary)]">
          None selected
        </p>
      </div>
    );
  }

  const imageSrc = product.images[0] ?? null;

  return (
    <div className="flex-1 min-w-[140px] max-w-[200px] bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] p-3">
      <div className="aspect-square bg-[var(--border)] rounded-lg mb-2 overflow-hidden relative">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${product.name} product image`}
            fill
            unoptimized={imageSrc.endsWith(".svg")}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[var(--border)]" />
        )}
      </div>
      <p className="font-sans text-sm font-medium text-[var(--ink-primary)] truncate">
        {product.name}
      </p>
      <p className="font-sans text-sm text-[var(--ink-secondary)]">
        ${product.price}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MatchSetBuilderPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [tops, setTops] = useState<Product[]>(() =>
    products.filter((p) => p.productType === "top")
  );
  const [bottoms, setBottoms] = useState<Product[]>(() =>
    products.filter((p) => p.productType === "bottom")
  );
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [pairingActive, setPairingActive] = useState(false);
  const [caregiverMode, setCaregiverMode] = useState(false);

  // Caregiver mode effect: filter to adaptive only (or all if none available)
  useEffect(() => {
    const adaptiveTops = products.filter(
      (p) => p.productType === "top" && p.gender === "adaptive"
    );
    const adaptiveBottoms = products.filter(
      (p) => p.productType === "bottom" && p.gender === "adaptive"
    );
    if (caregiverMode) {
      setTops(
        adaptiveTops.length > 0
          ? adaptiveTops
          : products.filter((p) => p.productType === "top")
      );
      setBottoms(
        adaptiveBottoms.length > 0
          ? adaptiveBottoms
          : products.filter((p) => p.productType === "bottom")
      );
    } else {
      setTops(products.filter((p) => p.productType === "top"));
      setBottoms(products.filter((p) => p.productType === "bottom"));
    }
    setTopIndex(0);
    setBottomIndex(0);
    setPairingActive(false);
  }, [caregiverMode]);

  // Navigate tops: re-pair bottoms
  const handleTopNav = useCallback(
    (newIndex: number) => {
      const nextTop = tops[newIndex];
      if (!nextTop) return;
      setTopIndex(newIndex);
      const paired = getCompatibleBottoms(nextTop.sku);
      setBottoms(paired.length > 0 ? paired : products.filter((p) => p.productType === "bottom"));
      setBottomIndex(0);
      setPairingActive(true);
    },
    [tops]
  );

  // Navigate bottoms manually: re-pair tops
  const handleBottomNav = useCallback(
    (newIndex: number) => {
      const nextBottom = bottoms[newIndex];
      if (!nextBottom) return;
      setBottomIndex(newIndex);
      const paired = getCompatibleTops(nextBottom.sku);
      setTops(paired.length > 0 ? paired : products.filter((p) => p.productType === "top"));
      setTopIndex(0);
      setPairingActive(false);
    },
    [bottoms]
  );

  const top = tops[topIndex];
  const bottom = bottoms[bottomIndex];

  // Prev/Next handlers for tops
  function prevTop() {
    handleTopNav((topIndex - 1 + tops.length) % tops.length);
  }
  function nextTop() {
    handleTopNav((topIndex + 1) % tops.length);
  }

  // Prev/Next handlers for bottoms
  function prevBottom() {
    handleBottomNav((bottomIndex - 1 + bottoms.length) % bottoms.length);
  }
  function nextBottom() {
    handleBottomNav((bottomIndex + 1) % bottoms.length);
  }

  function handleSave() {
    if (!top || !bottom) return;
    const existing: Array<{ topSku: string; bottomSku: string; savedAt: string }> =
      JSON.parse(localStorage.getItem("tempo:saved-sets") ?? "[]");
    existing.push({
      topSku: top.sku,
      bottomSku: bottom.sku,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("tempo:saved-sets", JSON.stringify(existing));
    toast.success("Set saved");
  }

  function handleShop() {
    if (!top || !bottom) return;
    addItem({
      productId: top.sku,
      slug: top.slug,
      name: top.name,
      price: top.price,
      size: "M",
    });
    addItem({
      productId: bottom.sku,
      slug: bottom.slug,
      name: bottom.name,
      price: bottom.price,
      size: "M",
    });
    router.push("/cart");
  }

  const totalPrice = (top?.price ?? 0) + (bottom?.price ?? 0);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <h1 className="font-serif text-5xl font-semibold text-[var(--ink-primary)]">
              Build your match set
            </h1>
            <p className="font-sans text-base text-[var(--ink-secondary)] mt-3 mb-10">
              Pair a top and bottom. We&apos;ll suggest compatible matches.
            </p>
          </div>

          {/* Caregiver mode toggle */}
          <div className="flex items-center gap-3 pt-2">
            <span
              id="cg-toggle-label"
              className="text-sm font-medium text-[var(--ink-primary)]"
            >
              Caregiver Mode
            </span>
            <button
              role="switch"
              aria-checked={caregiverMode}
              aria-labelledby="cg-toggle-label"
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

        {/* Caregiver mode notice */}
        {caregiverMode && (
          <div className="bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-lg px-4 py-2 text-sm mb-6" role="status">
            Showing adaptive pairings. Toggle off Caregiver Mode to see all.
          </div>
        )}

        {/* Two-column swiper grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top swiper */}
          <div>
            <h2 className="font-sans text-sm font-medium text-[var(--ink-secondary)] uppercase tracking-wide mb-3">
              Top
            </h2>
            <ProductSwiper
              items={tops}
              currentIndex={topIndex}
              onPrev={prevTop}
              onNext={nextTop}
              kind="top"
            />
          </div>

          {/* Bottom swiper */}
          <div>
            <h2 className="font-sans text-sm font-medium text-[var(--ink-secondary)] uppercase tracking-wide mb-3">
              Bottom
            </h2>
            <ProductSwiper
              items={bottoms}
              currentIndex={bottomIndex}
              onPrev={prevBottom}
              onNext={nextBottom}
              kind="bottom"
              pairingBadge={pairingActive}
            />
          </div>
        </div>

        {/* Your set preview */}
        <section
          aria-labelledby="your-set-heading"
          className="mt-12 pt-8 border-t border-[var(--border)]"
        >
          <h2
            id="your-set-heading"
            className="font-serif text-2xl font-semibold text-[var(--ink-primary)] mb-6"
          >
            Your set
          </h2>

          <div className="flex items-center gap-4 flex-wrap">
            <MiniCard product={top} />

            <span
              className="text-2xl text-[var(--ink-secondary)] font-light"
              aria-hidden="true"
            >
              +
            </span>

            <MiniCard product={bottom} />
          </div>

          <p className="mt-4 font-sans text-xl font-semibold text-[var(--ink-primary)]">
            Total: ${totalPrice.toFixed(0)}
          </p>

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/10 tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Save this set
            </button>
            <button
              onClick={handleShop}
              className="px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Shop this set
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
