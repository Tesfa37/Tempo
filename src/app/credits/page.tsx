import type { Metadata } from "next";
import Link from "next/link";
import { allImages, type ImageAsset } from "@/data/imagery-manifest";

export const metadata: Metadata = {
  title: "Image Credits, Tempo",
  description:
    "Attribution for all photography used on the Tempo website, including photographer credits, image sources, and license information.",
  alternates: {
    canonical: "/credits",
  },
};

function CreditsList({
  images,
  source,
}: {
  images: ImageAsset[];
  source: string;
}) {
  const filtered = images.filter((i) => i.source === source);
  if (filtered.length === 0) return null;

  const licenseHref =
    source === "Unsplash"
      ? "https://unsplash.com/license"
      : source === "Pexels"
      ? "https://www.pexels.com/license/"
      : "https://affecttheverb.com/disabledandhere/";

  const licenseNote =
    source === "Unsplash"
      ? "Free to use, attribution appreciated."
      : source === "Pexels"
      ? "Free to use, attribution appreciated."
      : "Disability-representative photography by and for the disabled community.";

  const headingId = source.toLowerCase().replace(/\s+/g, "-") + "-heading";

  return (
    <section aria-labelledby={headingId} className="mb-12">
      <h2
        id={headingId}
        className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-2"
      >
        {source}
      </h2>
      <p className="text-sm text-[#5A5A5A] mb-6">
        Used under the{" "}
        <a
          href={licenseHref}
          className="underline underline-offset-2 text-[#C29E5F] hover:text-[#a8874f] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          {source} License
        </a>
        . {licenseNote}
      </p>
      <ul className="flex flex-col gap-4">
        {filtered.map((img) => (
          <li
            key={img.path}
            className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg p-4"
          >
            <p className="text-xs font-mono text-[#9A9A9A] mb-1">{img.path}</p>
            <p className="text-sm text-[#1A1A1A] mb-1">{img.alt}</p>
            <p className="text-sm text-[#5A5A5A]">
              Photo by{" "}
              <a
                href={img.photographerUrl}
                className="text-[#C29E5F] underline underline-offset-2 hover:text-[#a8874f] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                {img.photographer}
              </a>{" "}
              on {source}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CreditsPage() {
  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <nav aria-label="Breadcrumb" className="mb-8">
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
              <span
                className="text-[#1A1A1A] font-medium"
                aria-current="page"
              >
                Image credits
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          Image credits
        </h1>
        <p className="text-[#5A5A5A] leading-relaxed mb-12">
          All photography on this site is used under the terms of the original
          source license. We are grateful to the photographers who made their
          work freely available.
        </p>

        <CreditsList images={allImages} source="Unsplash" />
        <CreditsList images={allImages} source="Pexels" />
        <CreditsList images={allImages} source="Disabled And Here" />
      </div>
    </div>
  );
}
