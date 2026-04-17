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
    title: `Try On ${product.name} in AR | Tempo`,
    description: `Use your camera to virtually try on the ${product.name}. Runs entirely in your browser — nothing is uploaded or stored.`,
  };
}

export default async function TryOnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return <TryOnClient product={product} />;
}
