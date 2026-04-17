"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartItemCount } from "@/store/cart";

export function CartIcon() {
  const count = useCartItemCount();

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} item${count !== 1 ? "s" : ""}` : "Cart, empty"}
      className="relative inline-flex items-center justify-center p-2 rounded text-[#1A1A1A] hover:text-[#C29E5F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
    >
      <ShoppingBag size={20} aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#C29E5F] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center px-1 leading-none"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
