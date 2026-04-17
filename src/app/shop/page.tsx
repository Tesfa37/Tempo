import { products } from "@/data/products";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop — Tempo Adaptive Fashion",
  description:
    "Browse the full Tempo collection. Adaptive clothing for wheelchair users, post-stroke recovery, sensory needs, arthritis, and dementia care.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#E8DFD2]">
      <ShopClient products={products} />
    </div>
  );
}
