import { notFound } from "next/navigation";
import { passports } from "@/data/passports";
import { PassportNarratorButton } from "@/components/passport/PassportNarratorButton";

export async function generateStaticParams() {
  const { passports } = await import("@/data/passports");
  return Object.keys(passports).map((sku) => ({ sku }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5 sm:p-7"
    >
      <h2
        id={id}
        className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-5 pb-3 border-b border-[#D4C9BA]"
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-[#D4C9BA] last:border-b-0">
      <dt className="text-sm text-[#5A5A5A] sm:w-40 shrink-0 font-medium">{label}</dt>
      <dd className="text-sm text-[#1A1A1A] mt-0.5 sm:mt-0">{value}</dd>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PassportPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const passport = passports[sku];

  if (!passport) {
    notFound();
  }

  const maxCarbon = Math.max(
    passport.carbonFootprint.rawMaterial,
    passport.carbonFootprint.manufacturing,
    passport.carbonFootprint.transport,
    passport.carbonFootprint.endOfLife
  );

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      {/* ── Product Header ─────────────────────────────────────────────────── */}
      <div className="bg-[#1A1A1A] text-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <span className="text-xs font-mono bg-[#C29E5F]/20 text-[#C29E5F] border border-[#C29E5F]/40 px-2.5 py-1 rounded-md tracking-wide">
              {passport.sku}
            </span>
            <span className="text-xs bg-[#7A8B75]/20 text-[#7A8B75] border border-[#7A8B75]/40 px-2.5 py-1 rounded-md">
              v{passport.passportVersion}
            </span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAFAF7] mb-3 leading-tight">
            {passport.productName}
          </h1>

          <p className="font-mono text-[#C29E5F] text-sm mb-3 tracking-wider">
            GTIN: {passport.gtin}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#D4C9BA] mb-5">
            <span>Last updated: {formatDate(passport.lastUpdated)}</span>
            <span>Issued: {formatDate(passport.issueDate)}</span>
          </div>

          {/* Verification badge */}
          <div className="inline-flex items-center gap-2 bg-[#7A8B75]/20 border border-[#7A8B75]/40 rounded-lg px-3 py-2">
            {/* Checkmark icon */}
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0"
            >
              <circle cx="8" cy="8" r="7.5" stroke="#7A8B75" />
              <path
                d="M4.5 8l2.5 2.5 4.5-5"
                stroke="#7A8B75"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs text-[#7A8B75] font-medium">
              Verified by GS1 Digital Link Standard v1.2
            </span>
          </div>
        </div>
      </div>

      {/* ── Sections ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">

        {/* Plain-language passport summary */}
        <PassportNarratorButton sku={sku} />

        {/* Section 1: Identity */}
        <SectionCard id="section-identity" heading="Identity">
          <dl className="divide-y divide-[#D4C9BA]">
            <Field label="Product Name" value={passport.productName} />
            <Field label="Model Number" value={<span className="font-mono text-xs">{passport.modelNumber}</span>} />
            <Field label="Issue Date" value={formatDate(passport.issueDate)} />
            <Field label="Last Updated" value={formatDate(passport.lastUpdated)} />
            <Field label="Passport Version" value={`v${passport.passportVersion}`} />
            <Field
              label="GS1 Digital Link"
              value={
                <a
                  href={passport.gs1DigitalLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C29E5F] underline underline-offset-2 break-all hover:text-[#a8874f] focus-visible:outline-2 focus-visible:outline-[#C29E5F] rounded"
                >
                  {passport.gs1DigitalLinkUrl}
                </a>
              }
            />
          </dl>
        </SectionCard>

        {/* Section 2: Materials */}
        <SectionCard id="section-materials" heading="Materials">
          {/* Composition table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm" aria-label="Material composition">
              <thead>
                <tr className="text-left border-b border-[#D4C9BA]">
                  <th className="pb-2 font-semibold text-[#1A1A1A] pr-4">Fiber</th>
                  <th className="pb-2 font-semibold text-[#1A1A1A] pr-4">%</th>
                  <th className="pb-2 font-semibold text-[#1A1A1A]">Certified</th>
                </tr>
              </thead>
              <tbody>
                {passport.materialComposition.map((mat, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#D4C9BA] last:border-b-0"
                  >
                    <td className="py-2.5 pr-4 text-[#1A1A1A]">{mat.fiber}</td>
                    <td className="py-2.5 pr-4 text-[#C29E5F] font-semibold font-mono">
                      {mat.percentage}%
                    </td>
                    <td className="py-2.5">
                      {mat.certified ? (
                        <div>
                          <span className="inline-block bg-[#7A8B75]/15 text-[#7A8B75] text-xs font-medium px-2 py-0.5 rounded-full border border-[#7A8B75]/30">
                            Certified
                          </span>
                          {mat.certificationBody && (
                            <p className="text-xs text-[#5A5A5A] mt-0.5">
                              {mat.certificationBody}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#5A5A5A] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="divide-y divide-[#D4C9BA]">
            <Field
              label="Recycled Content"
              value={
                <span className="font-semibold text-[#C29E5F]">
                  {passport.recycledContent}%
                </span>
              }
            />
            <Field label="Hazardous Substances" value={passport.hazardousSubstances} />
          </dl>
        </SectionCard>

        {/* Section 3: Supply Chain */}
        <SectionCard id="section-supply-chain" heading="Supply Chain">
          {/* Tier chain */}
          <div className="flex flex-col gap-0 mb-6" role="list" aria-label="Supply chain tiers">
            {passport.supplyChain.map((tier, idx) => (
              <div key={tier.tier} role="listitem">
                <div className="flex gap-4 items-start">
                  {/* Tier badge + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full bg-[#C29E5F] text-[#1A1A1A] flex items-center justify-center text-sm font-bold shrink-0"
                      aria-label={`Tier ${tier.tier}`}
                    >
                      {tier.tier}
                    </div>
                    {idx < passport.supplyChain.length - 1 && (
                      <div
                        className="w-0.5 h-6 bg-[#D4C9BA] my-1"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <p className="text-xs text-[#5A5A5A] font-medium uppercase tracking-wider mb-0.5">
                      {tier.role}
                    </p>
                    <p className="font-semibold text-[#1A1A1A] text-sm">
                      {tier.company}
                    </p>
                    <p className="text-sm text-[#5A5A5A]">{tier.location}</p>
                    {tier.certification && (
                      <p className="text-xs text-[#7A8B75] mt-1">
                        {tier.certification}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Manufacturing facility */}
          <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider mb-2">
              Manufacturing Facility
            </p>
            <p className="font-semibold text-[#1A1A1A] text-sm">
              {passport.manufacturingFacility.name}
            </p>
            <p className="text-sm text-[#5A5A5A]">
              {passport.manufacturingFacility.address}
            </p>
            <p className="text-sm text-[#5A5A5A]">
              {passport.manufacturingFacility.country}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {passport.manufacturingFacility.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs bg-[#FAFAF7] border border-[#D4C9BA] text-[#5A5A5A] px-2 py-0.5 rounded-full"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Section 4: Certifications */}
        <SectionCard id="section-certifications" heading="Certifications">
          <ul className="flex flex-col gap-4" role="list">
            {passport.certifications.map((cert, i) => (
              <li
                key={i}
                className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg p-4"
              >
                <p className="font-semibold text-[#1A1A1A] text-sm mb-1">
                  {cert.name}
                </p>
                <p className="text-sm text-[#5A5A5A] mb-2">
                  {cert.certificationBody}
                </p>
                <p className="font-mono text-xs text-[#C29E5F] bg-[#FAFAF7] px-2 py-1 rounded inline-block mb-1">
                  {cert.certificateNumber}
                </p>
                <p className="text-xs text-[#5A5A5A]">
                  Valid until: {formatDate(cert.validUntil)}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Section 5: Environmental Impact */}
        <SectionCard id="section-environment" heading="Environmental Impact">
          {/* Carbon bar chart (CSS only) */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#1A1A1A] mb-4">
              Carbon Footprint (kg CO&#8322;e)
            </p>
            <div className="space-y-3" role="list" aria-label="Carbon footprint breakdown">
              {(
                [
                  { label: "Raw Material", value: passport.carbonFootprint.rawMaterial },
                  { label: "Manufacturing", value: passport.carbonFootprint.manufacturing },
                  { label: "Transport", value: passport.carbonFootprint.transport },
                  { label: "End of Life", value: passport.carbonFootprint.endOfLife },
                ] as const
              ).map(({ label, value }) => (
                <div key={label} role="listitem">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#5A5A5A]">{label}</span>
                    <span className="font-mono text-[#1A1A1A] font-medium">
                      {value} kg
                    </span>
                  </div>
                  <div
                    className="h-2 bg-[#E8DFD2] rounded-full overflow-hidden"
                    role="presentation"
                  >
                    <div
                      className="h-full bg-[#C29E5F] rounded-full transition-all"
                      style={{
                        width: `${(value / maxCarbon) * 100}%`,
                      }}
                      aria-label={`${label}: ${value} kg CO2e`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg px-4 py-3">
              <span className="text-sm font-semibold text-[#1A1A1A]">
                Total Carbon Footprint
              </span>
              <span className="font-mono font-bold text-[#C29E5F] text-lg">
                {passport.carbonFootprint.total} kg CO&#8322;e
              </span>
            </div>
          </div>

          <dl className="divide-y divide-[#D4C9BA]">
            <Field
              label="Water Usage"
              value={
                <span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {passport.waterUsageLiters.toLocaleString()}
                  </span>{" "}
                  <span className="text-[#5A5A5A]">liters per garment</span>
                </span>
              }
            />
            <Field
              label="Energy"
              value={
                <span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {passport.energyKwh}
                  </span>{" "}
                  <span className="text-[#5A5A5A]">kWh</span>
                </span>
              }
            />
          </dl>
        </SectionCard>

        {/* Section 6: Care & Sterilization */}
        <SectionCard id="section-care" heading="Care & Sterilization">
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
              Care Instructions
            </p>
            <ul className="space-y-1.5 list-none pl-0">
              {passport.careInstructions.map((instr, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#1A1A1A]"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C29E5F] shrink-0"
                    aria-hidden="true"
                  />
                  {instr}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-[#1A1A1A]">
              Sterilization Compatible:
            </span>
            {passport.sterilizationCompatible ? (
              <span className="inline-block bg-[#7A8B75]/15 text-[#7A8B75] text-sm font-bold px-3 py-1 rounded-full border border-[#7A8B75]/40">
                YES
              </span>
            ) : (
              <span className="inline-block bg-[#D4C9BA]/60 text-[#5A5A5A] text-sm font-bold px-3 py-1 rounded-full border border-[#D4C9BA]">
                NO
              </span>
            )}
          </div>

          {passport.sterilizationCompatible && (
            <div className="bg-[#7A8B75]/10 border border-[#7A8B75]/30 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-[#7A8B75] uppercase tracking-wider mb-1">
                Sterilization Protocol
              </p>
              <p className="text-sm text-[#1A1A1A]">
                {passport.sterilizationProtocol}
              </p>
            </div>
          )}

          {!passport.sterilizationCompatible && (
            <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg p-4 mb-4">
              <p className="text-sm text-[#5A5A5A]">
                {passport.sterilizationProtocol}
              </p>
            </div>
          )}

          <dl className="divide-y divide-[#D4C9BA]">
            <Field
              label="Maximum Wash Cycles"
              value={
                <span className="font-semibold text-[#C29E5F] font-mono text-base">
                  {passport.maximumWashCycles}
                </span>
              }
            />
          </dl>
        </SectionCard>

        {/* Section 7: End of Life */}
        <SectionCard id="section-end-of-life" heading="End of Life">
          {/* Recyclability score with progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#1A1A1A]">
                Recyclability Score
              </span>
              <span className="font-mono font-bold text-[#C29E5F] text-xl">
                {passport.recyclabilityScore}
                <span className="text-sm text-[#5A5A5A] font-normal">/100</span>
              </span>
            </div>
            <div
              className="h-3 bg-[#E8DFD2] rounded-full overflow-hidden border border-[#D4C9BA]"
              role="img"
              aria-label={`Recyclability score: ${passport.recyclabilityScore} out of 100`}
            >
              <div
                className="h-full bg-[#C29E5F] rounded-full"
                style={{ width: `${passport.recyclabilityScore}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
              End of Life Instructions
            </p>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              {passport.endOfLifeInstructions}
            </p>
          </div>

          {passport.takeBackProgram && (
            <div className="flex items-center gap-3 bg-[#7A8B75]/10 border border-[#7A8B75]/30 rounded-lg px-4 py-3">
              <span className="bg-[#7A8B75] text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                YES
              </span>
              <p className="text-sm text-[#1A1A1A]">
                Return to Tempo Take-Back program
              </p>
            </div>
          )}
        </SectionCard>

        {/* Verified By footer */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 text-[#FAFAF7]">
          <p className="text-xs font-semibold text-[#C29E5F] uppercase tracking-widest mb-3">
            Independently Verified
          </p>
          <ul className="space-y-1.5 mb-5" role="list">
            {passport.verifiedBy.map((verifier, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#D4C9BA]">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0"
                >
                  <circle cx="7" cy="7" r="6.5" stroke="#7A8B75" />
                  <path
                    d="M3.5 7l2.5 2.5 4.5-5"
                    stroke="#7A8B75"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {verifier}
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#5A5A5A] mb-1.5 leading-relaxed">
            This passport complies with ESPR (EU) 2024/1781 delegated act
            requirements for textile Digital Product Passports.
          </p>
          <p className="text-xs text-[#5A5A5A]">
            Data accurate as of {formatDate(passport.lastUpdated)}.
          </p>
        </div>
      </div>
    </div>
  );
}
