import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advisor Governance | Tempo",
  description:
    "Tempo's advisor compensation structure, representation policy, decision authority, and conflict resolution commitment.",
};

function PolicySection({
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
      className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 sm:p-8"
    >
      <h2
        id={id}
        className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-4 pb-3 border-b border-[#D4C9BA]"
      >
        {heading}
      </h2>
      <div className="text-[#5A5A5A] leading-relaxed space-y-3 text-sm">
        {children}
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg px-4 py-3">
      <p className="font-mono text-xl font-bold text-[#C29E5F]">{value}</p>
      <p className="text-xs text-[#5A5A5A] mt-0.5">{label}</p>
    </div>
  );
}

export default function GovernancePage() {
  return (
    <main className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[#5A5A5A]">
            <li>
              <Link
                href="/"
                className="hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/about"
                className="hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                About
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-[#1A1A1A] font-medium" aria-current="page">
                Advisor governance
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          Advisor Governance
        </h1>
        <p className="text-[#5A5A5A] text-base leading-relaxed mb-12">
          Tempo&apos;s advisory board holds formal decision authority over four
          product categories. This page documents the compensation structure,
          representation requirements, scope of authority, and conflict
          resolution process. The first public compensation report is due Q1
          2027.
        </p>

        <div className="flex flex-col gap-6">
          <PolicySection
            id="compensation"
            heading="Compensation Commitment"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <Stat value="$175/hr" label="Consulting hourly rate" />
              <Stat value="0.5%" label="Royalty on co-designed pieces" />
              <Stat value="Monthly" label="Payment cadence" />
            </div>
            <p>
              Every disabled advisor is paid $175 per consulting hour for
              scheduled sessions, asynchronous review work, and public
              appearances made on behalf of Tempo. Hourly compensation applies
              from the moment an advisor begins reviewing materials, not from the
              start of a scheduled call.
            </p>
            <p>
              Advisors who co-design a garment receive a 0.5 percent royalty on
              every unit sold of that garment, paid monthly alongside any hourly
              fees. Co-design credit is determined jointly by the advisor and
              Tempo, documented in writing before production begins.
            </p>
            <p>
              All compensation is paid monthly with itemized statements. Advisors
              may request a quarterly summary for tax purposes. Tempo does not
              offset royalties against consulting fees.
            </p>
            <p>
              Compensation figures are disclosed annually in the public advisor
              compensation report, aggregated by advisor category, not by
              individual, unless an advisor opts in to individual disclosure.
            </p>
          </PolicySection>

          <PolicySection
            id="representation"
            heading="Representation Policy"
          >
            <p>
              Tempo&apos;s advisory board must meet all three of the following
              requirements at all times. If a departure causes any threshold to
              drop below the minimum, Tempo has 90 days to restore compliance
              before posting publicly about any new product or campaign.
            </p>
            <ul className="space-y-2 pl-0 list-none" role="list">
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 w-2 h-2 rounded-full bg-[#C29E5F] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">
                    Disability diversity:
                  </strong>{" "}
                  At least 4 distinct disability categories represented on the
                  board at all times, including at least one advisor who is a
                  full-time wheelchair user and at least one advisor with an
                  invisible or non-apparent disability.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 w-2 h-2 rounded-full bg-[#C29E5F] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">
                    Racial diversity:
                  </strong>{" "}
                  Minimum 60 percent of advisors identify as people of color.
                  This threshold applies to the board as a whole and is not
                  waived for smaller quorum decisions.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 w-2 h-2 rounded-full bg-[#C29E5F] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">
                    Gender diversity:
                  </strong>{" "}
                  Minimum 40 percent of advisors identify as women or nonbinary.
                  Self-identification is accepted and not subject to
                  verification.
                </span>
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id="decision-authority"
            heading="Decision Authority"
          >
            <p>
              Advisors hold formal veto power over decisions in four categories.
              A veto from any single advisor pauses the decision for a mandatory
              14-day resolution process. A veto from two or more advisors
              requires a full board vote before proceeding.
            </p>
            <ol className="space-y-3 list-none pl-0" role="list">
              {[
                {
                  n: "1",
                  title: "Garment design",
                  detail:
                    "Any change to adaptive features, closures, cut geometry, or material specification on a garment that has been through advisory review requires re-approval before production.",
                },
                {
                  n: "2",
                  title: "Marketing copy",
                  detail:
                    "All copy that references disability, adaptive design, or disabled customers, including product descriptions, social posts, and press materials, must clear advisory review before publication.",
                },
                {
                  n: "3",
                  title: "Model selection",
                  detail:
                    "Casting decisions for any photography or video featuring adaptive garments require advisory sign-off. Disabled models must be cast in leading roles, not supplementary roles.",
                },
                {
                  n: "4",
                  title: "Pricing",
                  detail:
                    "Any price increase greater than 8 percent on an existing garment, or any pricing structure that the advisory board determines creates equity barriers, is subject to veto.",
                },
              ].map(({ n, title, detail }) => (
                <li key={n} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full bg-[#C29E5F] text-[#1A1A1A] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                  <span>
                    <strong className="text-[#1A1A1A] font-semibold">
                      {title}:
                    </strong>{" "}
                    {detail}
                  </span>
                </li>
              ))}
            </ol>
          </PolicySection>

          <PolicySection id="conflict-resolution" heading="Conflict Resolution">
            <p>
              If a disabled advisor, community member, or external organization
              raises a concern about Tempo&apos;s design, marketing, language, or
              conduct, Tempo commits to the following:
            </p>
            <ul className="space-y-2 list-none pl-0" role="list">
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 w-2 h-2 rounded-full bg-[#7A8B75] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">
                    72-hour public response:
                  </strong>{" "}
                  Tempo will issue a public response within 72 hours of becoming
                  aware of a substantive concern. The response will acknowledge
                  the concern, name the person or organization raising it (with
                  their permission), and state the next action Tempo will take.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 w-2 h-2 rounded-full bg-[#7A8B75] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">
                    No defensive posture:
                  </strong>{" "}
                  Tempo does not contest, minimize, or attribute concerns to
                  misunderstanding in the initial public response. The first
                  public statement is not a defense.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 w-2 h-2 rounded-full bg-[#7A8B75] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#1A1A1A] font-semibold">
                    Advisory escalation:
                  </strong>{" "}
                  Any conflict involving the advisory board itself is escalated
                  to Dr. Keiko Tanaka in her capacity as accountability advisor.
                  Her ruling is final and published.
                </span>
              </li>
            </ul>
            <p className="pt-2 text-xs text-[#9A9A9A]">
              This policy was last updated April 2026. It will be reviewed
              annually by the advisory board and updated publicly if changed.
            </p>
          </PolicySection>
        </div>

        <div className="mt-10 pt-8 border-t border-[#D4C9BA]">
          <Link
            href="/about"
            className="text-sm font-medium text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Back to About Tempo
          </Link>
        </div>
      </div>
    </main>
  );
}
