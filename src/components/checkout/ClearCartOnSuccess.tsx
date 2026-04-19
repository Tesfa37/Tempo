"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

// Renders nothing - clears the Zustand cart from localStorage on mount.
// Used by the success page (a server component) to wipe the cart after payment.
export function ClearCartOnSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
