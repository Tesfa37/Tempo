import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financial Support for Adaptive Clothing | Tempo",
  description:
    "HSA/FSA reimbursement, Medicaid pathways, Veterans Affairs clothing allowance, and caregiver agency bulk pricing for Tempo adaptive garments.",
  alternates: {
    canonical: "/financial-support",
  },
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
      <div className="text-[#5A5A5A] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function FinancialSupportPage() {
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
              <span className="text-[#1A1A1A] font-medium" aria-current="page">
                Financial support
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          Financial Support
        </h1>
        <p className="text-lg text-[#5A5A5A] leading-relaxed mb-12">
          Adaptive clothing is a medical and functional necessity for many
          disabled customers and their care teams. Tempo garments are eligible
          for several reimbursement and subsidy pathways.
        </p>

        <div className="flex flex-col gap-6">
          <PolicySection id="hsa-fsa" heading="HSA and FSA Reimbursement">
            <p>
              Tempo adaptive garments qualify as an eligible medical expense
              under IRS Publication 502 when prescribed or recommended by a
              licensed healthcare provider for a medical condition. Customers can
              submit receipts to their HSA or FSA administrator directly.
            </p>
            <p>
              A Letter of Medical Necessity (LMN) from your physician,
              occupational therapist, or physical therapist strengthens
              reimbursement claims. The Fit Concierge can provide a product
              description letter to support your LMN request.
            </p>
            <p>
              HSA and FSA funds can be used at checkout via a linked debit card,
              or customers can pay out-of-pocket and submit for reimbursement
              using their Tempo order confirmation as a receipt.
            </p>
          </PolicySection>

          <PolicySection id="medicaid" heading="Medicaid Reimbursement Pathway">
            <p>
              Tempo is currently piloting a Medicaid reimbursement pathway with
              two state programs. Eligible categories include adaptive clothing
              for wheelchair users and post-stroke customers under durable
              medical equipment (DME) and clothing allowance provisions.
            </p>
            <p>
              Pilot states and eligibility criteria are updated as the program
              expands. Contact us through the Fit Concierge to confirm whether
              your state program is currently active and to receive documentation
              support.
            </p>
          </PolicySection>

          <PolicySection
            id="bulk-pricing"
            heading="Caregiver Agency Bulk Pricing"
          >
            <p>
              Caregiver agencies, residential care facilities, and home health
              organizations placing orders of 12 or more garments receive 15
              percent off the listed price.
            </p>
            <p>
              Bulk orders also receive priority fulfillment and a dedicated
              account contact. To set up a bulk account, use the Fit Concierge
              and mention you are placing an agency order, or email us directly
              with your organization name and estimated order volume.
            </p>
            <p>
              Bulk pricing applies per order, not per account. Orders must be
              placed in a single transaction to qualify.
            </p>
          </PolicySection>

          <PolicySection
            id="veterans-affairs"
            heading="Veterans Affairs Clothing Allowance"
          >
            <p>
              Tempo garments are eligible for reimbursement under the VA Clothing
              Allowance benefit for veterans whose skin condition or prosthetic or
              orthopedic device damages or requires special clothing. The annual
              allowance is paid directly to the veteran.
            </p>
            <p>
              To apply, veterans submit VA Form 10-8678 to their nearest VA
              medical center. Tempo can provide product documentation and
              descriptions to support your application. Ask the Fit Concierge for
              a product specification sheet formatted for VA submissions.
            </p>
          </PolicySection>

          <PolicySection id="fit-concierge" heading="Ask the Fit Concierge">
            <p>
              The Fit Concierge is Tempo&apos;s AI support tool, available on every
              product page. It can answer questions about which garments qualify
              for specific reimbursement pathways, generate product description
              text for LMN requests, and explain bulk pricing eligibility.
            </p>
            <p>
              For questions not covered by the Fit Concierge, contact the Tempo
              team directly. Response time is one to two business days.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block text-sm font-medium text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                Browse the collection and open the Fit Concierge
              </Link>
            </div>
          </PolicySection>
        </div>

        <p className="mt-10 text-xs text-[#9A9A9A] leading-relaxed">
          Reimbursement eligibility depends on individual plan terms,
          state-specific Medicaid rules, and IRS guidance, which may change.
          This page reflects current program status as of April 2026. Tempo does
          not provide tax or legal advice. Consult your benefits administrator or
          healthcare provider for guidance specific to your situation.
        </p>
      </div>
    </main>
  );
}
