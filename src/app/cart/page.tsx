"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cart";
import { productImages } from "@/data/imagery-manifest";

const SHIPPING_FREE_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = useCartSubtotal();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center">
        <p className="text-[#5A5A5A]">Loading cart...</p>
      </div>
    );
  }

  const shippingCost = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#D4C9BA] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={28} className="text-[#9A9A9A]" aria-hidden="true" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-3">
            Your cart is empty
          </h1>
          <p className="text-[#5A5A5A] mb-8 leading-relaxed">
            Browse the collection to find adaptive garments designed for your
            pace.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-medium px-6 py-3 rounded hover:bg-[var(--accent-hover)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            Browse the collection
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8DFD2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Your cart
          </h1>
          <p className="text-[#5A5A5A] mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)} item
            {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Line items ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <ul aria-label="Cart items">
              {items.map((item) => {
                const src = item.image;
                const meta = src ? productImages[src] : undefined;

                return (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5 flex gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#E8DFD2]">
                      {src && meta ? (
                        <Image
                          src={src}
                          alt={meta.alt}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={meta.blurDataURL}
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E8DFD2]" aria-hidden="true" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            className="font-semibold text-[#1A1A1A] hover:text-[#C29E5F] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded text-sm leading-snug"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-[#5A5A5A] mt-0.5">
                            Size {item.size}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#1A1A1A] shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        {/* Quantity controls */}
                        <div
                          role="group"
                          aria-label={`Quantity for ${item.name}, size ${item.size}`}
                          className="flex items-center border border-[#D4C9BA] rounded-lg overflow-hidden"
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1.5 text-[#5A5A5A] hover:bg-[#E8DFD2] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C29E5F]"
                          >
                            <Minus size={12} aria-hidden="true" />
                          </button>
                          <span
                            className="px-3 py-1.5 text-sm font-medium text-[#1A1A1A] min-w-[2rem] text-center"
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1.5 text-[#5A5A5A] hover:bg-[#E8DFD2] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C29E5F]"
                          >
                            <Plus size={12} aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-xs text-[#9A9A9A]">
                          ${item.price.toFixed(2)} each
                        </span>

                        <button
                          type="button"
                          aria-label={`Remove ${item.name}, size ${item.size} from cart`}
                          onClick={() =>
                            removeItem(item.productId, item.size)
                          }
                          className="ml-auto text-[#9A9A9A] hover:text-[#C4372A] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded p-1"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/shop"
              className="text-sm text-[#7A8B75] underline underline-offset-2 hover:text-[#5a6b55] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded self-start"
            >
              Continue shopping
            </Link>
          </div>

          {/* ── Order summary ────────────────────────────────────────────── */}
          <aside aria-label="Order summary" className="lg:col-span-1">
            <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 sticky top-24">
              <h2 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-5">
                Order summary
              </h2>

              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#5A5A5A]">Subtotal</dt>
                  <dd className="font-medium text-[#1A1A1A]">
                    ${subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5A5A5A]">Shipping</dt>
                  <dd
                    className={`font-medium ${
                      shippingCost === 0 ? "text-[#7A8B75]" : "text-[#1A1A1A]"
                    }`}
                  >
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </dd>
                </div>
                {subtotal < SHIPPING_FREE_THRESHOLD && (
                  <p className="text-xs text-[#7A8B75] bg-[#7A8B75]/10 rounded-lg px-3 py-2">
                    Add ${(SHIPPING_FREE_THRESHOLD - subtotal).toFixed(2)} more
                    for free shipping.
                  </p>
                )}
                <div className="border-t border-[#D4C9BA] pt-3 flex justify-between">
                  <dt className="font-semibold text-[#1A1A1A]">Total</dt>
                  <dd className="font-bold text-[#1A1A1A] text-base">
                    ${total.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <p className="text-xs text-[#7A8B75] mt-3 font-medium">
                +{Math.floor(total) * 10} TempoPoints earned on this order
              </p>

              <Link
                href="/checkout"
                className="mt-5 flex items-center justify-center gap-2 w-full bg-[#1A1A1A] text-[#FAFAF7] font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-[#2A2A2A] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                Proceed to checkout
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <p className="text-xs text-[#9A9A9A] text-center mt-3">
                HSA and FSA cards accepted.{" "}
                <Link
                  href="/financial-support"
                  className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                >
                  Learn about reimbursement
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
