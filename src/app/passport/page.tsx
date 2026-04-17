import Link from "next/link";
import { passports } from "@/data/passports";
import type { Metadata } from "next";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildCollectionPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Digital Product Passports | Tempo",
  description:
    "ESPR-aligned digital product passports for every Tempo garment. Scan any QR at the garment tag or browse the gallery.",
  alternates: {
    canonical: "/passport",
  },
};

export default function PassportIndexPage() {
  const passportList = Object.values(passports);

  return (
    <main className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          Digital Product Passports
        </h1>
        <p className="text-lg text-[#1A1A1A] mb-12 max-w-2xl leading-relaxed">
          Every Tempo garment ships with a Digital Product Passport aligned to
          ESPR (EU) 2024/1781. Scan any QR at the garment tag or browse the
          gallery below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {passportList.map((passport) => (
            <article
              key={passport.sku}
              className="bg-[#FAFAF7] rounded-lg border border-[#D4C9BA] p-6 flex flex-col"
            >
              <div className="mb-4">
                <span className="text-xs font-mono bg-[#E8DFD2] text-[#1A1A1A] px-2 py-1 rounded">
                  {passport.sku}
                </span>
              </div>
              <h2 className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-4">
                {passport.productName}
              </h2>
              <dl className="text-sm text-[#4A4A4A] space-y-2 mb-6 flex-1">
                <div className="flex justify-between gap-4">
                  <dt>Passport version</dt>
                  <dd className="font-mono text-[#1A1A1A]">
                    {passport.passportVersion}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Issue date</dt>
                  <dd className="text-[#1A1A1A]">{passport.issueDate}</dd>
                </div>
              </dl>
              <Link
                href={`/passport/${passport.sku}`}
                className="text-sm font-medium text-[#7A8B75] hover:text-[#5a6b55] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                aria-label={`View full passport for ${passport.productName}`}
              >
                View full passport &rarr;
              </Link>
            </article>
          ))}
        </div>

        <section aria-labelledby="why-this-matters">
          <h2
            id="why-this-matters"
            className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-6"
          >
            Why this matters
          </h2>
          <div className="max-w-2xl space-y-4 text-[#1A1A1A] leading-relaxed">
            <p>
              Each passport is anchored to a GS1 Digital Link URL, making it
              scannable by any standards-compliant QR reader and
              machine-readable by supply-chain systems worldwide.
            </p>
            <p>
              ESPR Regulation (EU) 2024/1781 requires all textile products sold
              in the EU to carry a Digital Product Passport by 2030, and Tempo
              ships compliant passports with every garment today.
            </p>
            <p>
              The Tempo Take-Back loop is embedded directly in each passport, so
              the end-of-life instructions travel with the garment for its
              entire lifespan, not just until the hangtag is removed.
            </p>
          </div>
        </section>
        <StructuredData data={buildCollectionPageSchema()} />
      </div>
    </main>
  );
}
