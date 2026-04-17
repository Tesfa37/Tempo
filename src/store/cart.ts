"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.size === item.size
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...item, quantity: item.quantity ?? 1 },
            ],
          });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "tempo-cart" }
  )
);

export function useCartItemCount() {
  return useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
}

export function useCartSubtotal() {
  return useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
}
