import { products } from "@/data/products";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop, Tempo Adaptive Fashion",
  description:
    "Browse the full Tempo collection. Adaptive clothing for wheelchair users, post-stroke recovery, sensory needs, arthritis, and dementia care.",
  alternates: {
    canonical: "/shop",
  },
};

type GenderParam = "women" | "men" | "adaptive";
const VALID_GENDERS: GenderParam[] = ["women", "men", "adaptive"];

function parseGender(raw: string | undefined): GenderParam | undefined {
  return VALID_GENDERS.includes(raw as GenderParam)
    ? (raw as GenderParam)
    : undefined;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string }>;
}) {
  const params = await searchParams;
  const initialGender = parseGender(params.gender);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <ShopClient products={products} initialGender={initialGender} />
    </div>
  );
}
