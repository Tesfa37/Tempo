import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { productImages } from "@/data/imagery-manifest";
import { ValidatedByStrip } from "@/components/home/ValidatedByStrip";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Tempo, Clothes that move at your pace",
  description:
    "Adaptive fashion built with disabled advisors. Sustainable materials, Digital Product Passports, and Caregiver Mode. Every garment a product you can trust completely.",
  alternates: {
    canonical: "/",
  },
};

const CATEGORY_TILES = [
  {
    slug: "women",
    label: "Women",
    img: "/placeholders/category-women.svg",
    alt: "Person in a tailored Tempo blazer at an outdoor table, morning light",
  },
  {
    slug: "men",
    label: "Men",
    img: "/placeholders/category-men.svg",
    alt: "Person in a Tempo button-front shirt boarding a train, bag on shoulder",
  },
  {
    slug: "adaptive",
    label: "Adaptive",
    img: "/placeholders/category-adaptive.svg",
    alt: "Person in a Tempo seated-cut trouser having coffee at a cafe counter",
  },
] as const;

function getNewArrivals() {
  const isNew = products.filter((p) => p.isNew);
  const rest = products.filter((p) => !p.isNew);
  return [...isNew, ...rest].slice(0, 8);
}

export default function LandingPage() {
  const newArrivals = getNewArrivals();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative h-[70vh] w-full overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* TODO: replace with licensed editorial photo */}
        <Image
          src="/placeholders/hero-editorial.svg"
          alt="Two people walking through a sun-drenched fabric market, one wearing a Tempo linen shirt"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/20 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            id="hero-heading"
            className="font-serif text-5xl md:text-7xl font-semibold text-white drop-shadow-sm mb-4"
          >
            Tempo. Fashion at your pace.
          </h1>
          <p className="font-sans text-lg md:text-xl font-normal text-white/90 mb-8">
            Women, Men, Adaptive. One standard.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] tempo-transition text-white font-medium px-8 py-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-base"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      {/* Three-Category Tile Strip */}
      <section aria-label="Shop by category">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={`/shop?gender=${tile.slug}`}
              className="relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-[500px] block group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
              aria-label={`Shop ${tile.label}`}
            >
              {/* TODO: replace with licensed editorial photo */}
              <Image
                src={tile.img}
                alt={tile.alt}
                fill
                className="object-cover tempo-transition group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
              <p className="absolute bottom-8 left-8 font-serif text-5xl font-semibold text-white drop-shadow-sm pointer-events-none" aria-hidden="true">
                {tile.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Rail */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="new-arrivals-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="new-arrivals-heading"
            className="font-serif text-3xl font-semibold text-[var(--ink-primary)] mb-6"
          >
            New Arrivals
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none" role="region" aria-label="New arrivals scroll" tabIndex={0}>
            {newArrivals.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="flex-none w-48 md:w-56 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                <div className="relative aspect-square bg-[var(--bg-surface)] overflow-hidden rounded-lg">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={productImages[product.images[0]]?.alt ?? `${product.name} in a Tempo garment`}
                      fill
                      className="object-cover tempo-transition group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 192px, 224px"
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-[var(--border)]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-2 font-sans text-sm font-medium text-[var(--ink-primary)] truncate">
                  {product.name}
                </p>
                <p className="font-sans text-sm font-normal text-[var(--ink-secondary)]">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Match Set Builder Feature */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface)]"
        aria-labelledby="matchset-heading"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2
              id="matchset-heading"
              className="font-serif text-4xl md:text-5xl font-semibold text-[var(--ink-primary)] mb-4"
            >
              Build your match set.
            </h2>
            <p className="font-sans text-base text-[var(--ink-secondary)] mb-8 leading-relaxed">
              Tempo&apos;s outfit pairing tool recommends tops and bottoms that
              work together across color, formality, and adaptive features.
              Build a look that fits your day, not just your wardrobe.
            </p>
            {/* TODO: replace with Match Set Builder route when /style/build is built */}
            <Link
              href="/shop"
              className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] tempo-transition text-white font-medium px-6 py-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-sm"
            >
              Start styling
            </Link>
          </div>
          <div className="relative order-1 md:order-2 aspect-[4/3] overflow-hidden rounded-2xl">
            {/* TODO: replace with licensed editorial photo */}
            <Image
              src="/placeholders/feature-matchset.svg"
              alt="Flatlay of a matched Tempo outfit on a neutral linen surface"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Virtual Fitting Feature */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="virtualfit-heading"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            {/* TODO: replace with licensed editorial photo */}
            <Image
              src="/placeholders/feature-virtualfit.svg"
              alt="Person holding a phone showing a Tempo jacket preview in a bright room"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div>
            <h2
              id="virtualfit-heading"
              className="font-serif text-4xl md:text-5xl font-semibold text-[var(--ink-primary)] mb-4"
            >
              See it before you buy it.
            </h2>
            <p className="font-sans text-base text-[var(--ink-secondary)] mb-8 leading-relaxed">
              Virtual Fitting uses on-device AI to preview any Tempo garment
              on your own image, with full support for seated and wheelchair
              positions. Your images never leave your device.
            </p>
            <Link
              href="/try-on"
              className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] tempo-transition text-white font-medium px-6 py-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-sm"
            >
              Try Virtual Fitting
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <ValidatedByStrip />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
