import { products } from '@/data/products';
import type { Product } from '@/data/products';

export type Gender = Product['gender'];
export type ProductType = NonNullable<Product['productType']>;
export type ColorFamily = NonNullable<Product['colorFamily']>;
export type Formality = NonNullable<Product['formality']>;

export function getProductsByGender(gender: Gender): Product[] {
  return products.filter((p) => p.gender === gender);
}

export function getProductsByType(type: ProductType): Product[] {
  return products.filter((p) => p.productType === type);
}

export interface GenderCategory {
  label: string;
  slug: Gender;
  count: number;
}

export function getAllGenders(): GenderCategory[] {
  const genders: Gender[] = ['women', 'men', 'adaptive'];
  return genders.map((g) => ({
    label: g.charAt(0).toUpperCase() + g.slice(1),
    slug: g,
    count: products.filter((p) => p.gender === g).length,
  }));
}

const COLOR_COMPATIBILITY: Record<ColorFamily, ColorFamily[]> = {
  neutral: ['neutral', 'warm', 'cool', 'earth'],
  warm: ['warm', 'neutral', 'earth'],
  cool: ['cool', 'neutral'],
  earth: ['earth', 'neutral', 'warm'],
};

function pairingScore(top: Product, bottom: Product): number {
  let score = 0;
  if (top.gender === bottom.gender) score += 3;
  if (
    top.colorFamily &&
    bottom.colorFamily &&
    COLOR_COMPATIBILITY[top.colorFamily]?.includes(bottom.colorFamily)
  )
    score += 2;
  if (top.formality && bottom.formality && top.formality === bottom.formality)
    score += 2;
  if (top.gender === 'adaptive' && bottom.gender === 'adaptive') score += 1;
  return score;
}

export function getCompatibleBottoms(topSku: string): Product[] {
  const top = products.find((p) => p.sku === topSku);
  if (!top) return [];
  const bottoms = products.filter((p) => p.productType === 'bottom');
  return bottoms.sort(
    (a, b) => pairingScore(top, b) - pairingScore(top, a),
  );
}

export function getCompatibleTops(bottomSku: string): Product[] {
  const bottom = products.find((p) => p.sku === bottomSku);
  if (!bottom) return [];
  const tops = products.filter((p) => p.productType === 'top');
  return tops.sort(
    (a, b) => pairingScore(b, bottom) - pairingScore(a, bottom),
  );
}
