import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Map,
  Layers,
  Hand,
  Armchair,
  Lock,
  Shirt,
  Recycle,
  type LucideIcon,
} from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { productImages } from "@/data/imagery-manifest";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductAddToCart } from "@/components/product/ProductAddToCart";
import { FitConciergeButton } from "@/components/product/FitConciergeButton";
import { ReviewsTabs } from "@/components/product/ReviewsTabs";
import { PricingEquityDisclosure } from "@/components/product/PricingEquityDisclosure";
import { Camera } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildBreadcrumbList, buildProductSchema } from "@/lib/structured-data";

// ─── Static params ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const { products: allProducts } = await import("@/data/products");
  return allProducts.map((p) => ({ slug: p.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const ogImage = `/shop/${slug}/opengraph-image`;
  return {
    title: `${product.name}, Tempo Adaptive Fashion`,
    description: product.description,
    openGraph: {
      title: `${product.name}, Tempo Adaptive Fashion`,
      description: product.description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${product.name}, Tempo Adaptive Fashion`,
      description: product.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/shop/${slug}`,
    },
  };
}

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  map: Map,
  layers: Layers,
  hand: Hand,
  armchair: Armchair,
  lock: Lock,
  shirt: Shirt,
  recycle: Recycle,
  // fallbacks for other icon names used in product data
  magnet: Layers,
  expand: Map,
  "circle-off": Lock,
  "stretch-horizontal": Layers,
  brain: Hand,
  "person-standing": Armchair,
  zip: Lock,
  "move-vertical": Map,
};

function AdaptiveIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name.toLowerCase()] ?? Shirt;
  return <Icon size={18} className="text-[#C29E5F]" aria-hidden="true" />;
}

// ─── SKUs with matching placeholder reviews ───────────────────────────────────

const SKUS_WITH_REVIEWS = new Set([
  "TMP-001",
  "TMP-002",
  "TMP-003",
  "TMP-004",
  "TMP-005",
  "TMP-006",
]);

// ─── QR Passport placeholder ─────────────────────────────────────────────────

function QRPlaceholder({ sku }: { sku: string }) {
  // Visual-only CSS QR pattern
  const cells = Array.from({ length: 49 });
  // Simple deterministic on/off per cell based on index
  const pattern = [
    1,1,1,1,1,1,1, 0,1,0,1,0,1,0, 1,1,1,0,1,1,1,
    1,0,0,0,0,0,1, 0,0,1,0,1,0,0, 1,0,0,0,0,0,1,
    1,0,1,0,1,0,1, 0,1,0,0,0,1,0, 1,0,1,1,1,0,1,
  ];

  return (
    <div
      className="flex flex-col items-center gap-4 p-6 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl"
      role="img"
      aria-label={`QR code for Digital Product Passport ${sku}`}
    >
      {/* QR pattern grid */}
      <div
        className="grid gap-[2px] bg-white p-3 rounded-lg border border-[#D4C9BA]"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", width: 112 }}
        aria-hidden="true"
      >
        {cells.map((_, i) => (
          <div
            key={i}
            className={`w-[14px] h-[14px] rounded-[1px] ${
              pattern[i % pattern.length] === 1
                ? "bg-[#1A1A1A]"
                : "bg-white"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-mono text-[#5A5A5A]">
        tempo.style/passport/{sku}
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      {/* Breadcrumb */}
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 text-sm text-[#5A5A5A]">
          <li>
            <Link
              href="/"
              className="hover:text-[#1A1A1A] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/shop"
              className="hover:text-[#1A1A1A] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span className="text-[#1A1A1A] font-medium" aria-current="page">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Left: Gallery ──────────────────────────────────────────── */}
          <div>
            <ProductGallery
              productName={product.name}
              images={product.images}
              imageMeta={product.images.map((p) => ({
                alt: productImages[p]?.alt ?? product.name,
                blurDataURL: productImages[p]?.blurDataURL ?? "",
              }))}
            />
          </div>

          {/* ── Right: Product Info ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Name + price */}
            <div>
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A]">
                  {product.name}
                </h1>
                {product.isNew && (
                  <span className="bg-[#7A8B75] text-white text-xs font-medium px-3 py-1 rounded-full self-center">
                    New
                  </span>
                )}
              </div>
              <p className="text-3xl font-semibold text-[#C29E5F]">
                ${product.price}
              </p>
            </div>

            {/* Financial support */}
            <PricingEquityDisclosure />

            {/* Description */}
            <p className="text-[#5A5A5A] leading-relaxed">
              {product.longDescription}
            </p>

            {/* Conditions */}
            {product.conditions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Designed for
                </p>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Conditions this garment supports"
                >
                  {product.conditions.map((condition) => (
                    <span
                      key={condition}
                      role="listitem"
                      className="text-sm bg-[#E8DFD2] text-[#5A5A5A] px-3 py-1 rounded-full border border-[#D4C9BA]"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Adaptive features */}
            {product.adaptiveFeatures.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
                  Adaptive features
                </p>
                <ul className="space-y-3">
                  {product.adaptiveFeatures.map((feature) => (
                    <li
                      key={feature.name}
                      className="flex items-start gap-3 bg-[#FAFAF7] border border-[#D4C9BA] rounded-lg px-4 py-3"
                    >
                      <div className="mt-0.5 shrink-0">
                        <AdaptiveIcon name={feature.icon} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A1A]">
                          {feature.name}
                        </p>
                        <p className="text-xs text-[#5A5A5A] mt-0.5">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs bg-[#C29E5F]/10 text-[#C29E5F] px-2.5 py-1 rounded border border-[#C29E5F]/20 font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>

            {/* Size selector + Add to cart */}
            <ProductAddToCart product={product} />

            {/* Virtual Fitting CTA */}
            <Link
              href={`/fit/${product.slug}`}
              aria-label={`Try ${product.name} with AI Virtual Fitting`}
              className="inline-flex items-center justify-center gap-2 w-full border border-[#C29E5F] text-[#C29E5F] text-sm font-medium px-4 py-2.5 rounded hover:bg-[#C29E5F]/10 tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
              Try it on with Virtual Fitting
            </Link>

            {/* Fit Concierge */}
            <FitConciergeButton />
          </div>
        </div>

        {/* ── Digital Product Passport ─────────────────────────────────── */}
        <section
          className="mt-16 pt-12 border-t border-[#D4C9BA]"
          aria-labelledby="passport-heading"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2
                id="passport-heading"
                className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-4"
              >
                Digital Product Passport
              </h2>
              <p className="text-[#5A5A5A] leading-relaxed mb-6">
                Every Tempo garment carries a Digital Product Passport. Scan to
                see fiber origin, certifications, carbon footprint, and
                sterilization compatibility.
              </p>

              {/* Materials */}
              <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5 mb-4">
                <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Materials
                </p>
                <p className="text-sm text-[#5A5A5A]">{product.materials}</p>
              </div>

              {/* Sterilization */}
              <div
                className={`border rounded-xl p-5 mb-6 ${
                  product.sterilizationSafe
                    ? "bg-[#7A8B75]/10 border-[#7A8B75]/20"
                    : "bg-[#FAFAF7] border-[#D4C9BA]"
                }`}
              >
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                  {product.sterilizationSafe
                    ? "Sterilization-safe"
                    : "Sterilization notes"}
                </p>
                <p className="text-sm text-[#5A5A5A]">
                  {product.sterilizationNotes}
                </p>
              </div>

              <Link
                href={`/passport/${product.sku}`}
                className="inline-block text-sm font-medium text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                View full passport for {product.sku}
              </Link>
            </div>

            <div className="flex justify-center md:justify-start">
              <QRPlaceholder sku={product.sku} />
            </div>
          </div>
        </section>

        {/* ── Reviews ──────────────────────────────────────────────────── */}
        <div className="mt-16 pt-12 border-t border-[#D4C9BA]">
          <ReviewsTabs showPlaceholderReviews={SKUS_WITH_REVIEWS.has(product.sku)} />
        </div>

        {/* ── Structured Data (SEO) ─────────────────────────────────────── */}
        <StructuredData
          data={buildBreadcrumbList([
            { name: "Home", url: "https://tempo.style" },
            { name: "Shop", url: "https://tempo.style/shop" },
            { name: product.name, url: `https://tempo.style/shop/${product.slug}` },
          ])}
        />
        <StructuredData data={buildProductSchema(product)} />
      </div>
    </div>
  );
}
