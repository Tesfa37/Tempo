import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { TryOnClient } from "@/components/tryon/TryOnClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `AI Virtual Fitting: ${product.name} | Tempo`,
    description: `Use AI Virtual Fitting to preview the ${product.name} on your own image. Wheelchair mode included. Your camera feed never leaves your device.`,
    alternates: { canonical: `/fit/${slug}` },
  };
}

export default async function FitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <TryOnClient product={product} />;
}
