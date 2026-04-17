"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { SizeSelector } from "@/components/product/SizeSelector";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/data/products";

interface ProductAddToCartProps {
  product: Product;
}

export function ProductAddToCart({ product }: ProductAddToCartProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize
  );
  const inStock = selectedVariant?.inStock ?? false;

  function handleAddToCart() {
    if (!selectedSize || !inStock) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
    });

    setJustAdded(true);
    toast.success(`${product.name} (${selectedSize}) added to cart`, {
      duration: 2500,
    });

    setTimeout(() => setJustAdded(false), 2500);
  }

  const buttonDisabled = !selectedSize || !inStock || justAdded;

  let buttonLabel: string;
  if (justAdded) {
    buttonLabel = "Added to cart";
  } else if (!selectedSize) {
    buttonLabel = "Select a size";
  } else if (!inStock) {
    buttonLabel = "Out of stock";
  } else {
    buttonLabel = "Add to cart";
  }

  return (
    <div className="flex flex-col gap-4">
      <SizeSelector variants={product.variants} onSizeChange={setSelectedSize} />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={buttonDisabled}
        aria-disabled={buttonDisabled}
        className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
          justAdded
            ? "bg-[#7A8B75] text-white cursor-default"
            : buttonDisabled
            ? "bg-[#D4C9BA] text-[#9A9A9A] cursor-not-allowed"
            : "bg-[#1A1A1A] text-[#FAFAF7] hover:bg-[#2A2A2A] active:scale-[0.98]"
        }`}
      >
        {justAdded ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <ShoppingBag size={16} aria-hidden="true" />
        )}
        {buttonLabel}
      </button>

      {selectedSize && !inStock && (
        <p className="text-sm text-[#5A5A5A]" role="status">
          Size {selectedSize} is currently out of stock. We will notify you
          when it is available.
        </p>
      )}
    </div>
  );
}
