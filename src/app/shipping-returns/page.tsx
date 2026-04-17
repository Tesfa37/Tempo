import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping and Returns | Tempo",
  description:
    "Shipping rates for US, Canada, EU, and UK. 60 to 120 day returns depending on account type. Take-Back eligible at any condition for 1,000 TempoPoints.",
  alternates: {
    canonical: "/shipping-returns",
  },
};

function Section({
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
      <div className="text-[#5A5A5A] leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

const shippingRates = [
  {
    region: "US (contiguous 48 states)",
    standard: "$8.95 / 5-7 business days",
    express: "$18.95 / 2-3 business days",
    overnight: "$34.95 / next business day",
  },
  {
    region: "US (Alaska, Hawaii, territories)",
    standard: "$14.95 / 7-10 business days",
    express: "$24.95 / 3-5 business days",
    overnight: "Not available",
  },
  {
    region: "Canada",
    standard: "$12.95 / 7-12 business days",
    express: "$24.95 / 4-6 business days",
    overnight: "Not available",
  },
  {
    region: "European Union",
    standard: "$18.95 / 10-14 business days",
    express: "$34.95 / 5-7 business days",
    overnight: "Not available",
  },
  {
    region: "United Kingdom",
    standard: "$16.95 / 8-12 business days",
    express: "$29.95 / 4-6 business days",
    overnight: "Not available",
  },
];

const faqs = [
  {
    q: "Can I exchange for a different size or color?",
    a: "Yes. Start a return for the original item and place a new order for the replacement. If both are on the same account, shipping on the new order is waived. Contact us through the Fit Concierge if you need help selecting the right size.",
  },
  {
    q: "What counts as 'original tags attached'?",
    a: "Hang tags and any sewn-in garment labels must still be attached. Magnetic closures and adaptive hardware must be intact. If tags were removed but the item is genuinely unworn, contact us before starting the return and we will assess case by case.",
  },
  {
    q: "Do I pay for return shipping?",
    a: "Advisor and Architect tier members receive free return shipping labels. All other customers cover return postage unless the item is damaged or defective, in which case we provide a prepaid label. Take-Back returns always include a prepaid label (redeemable for 500 TempoPoints from your rewards balance, or free for Advisor and Architect tiers).",
  },
  {
    q: "My refund window has passed but the item doesn't fit. What can I do?",
    a: "Any item, at any time, can be returned through the Take-Back program. You receive 1,000 TempoPoints instead of a cash refund. The garment is repaired for resale or recycled through our certified partner. Start a Take-Back at /take-back.",
  },
  {
    q: "I ordered as a caregiver account but I want to return an item purchased for a care recipient. Which return window applies?",
    a: "The account type at the time of purchase determines the window. If the order was placed on a Caregiver account, the 90-day window applies regardless of who will be wearing the garment.",
  },
  {
    q: "Will duties and taxes be refunded for international returns?",
    a: "Tempo refunds the garment price and original shipping. Import duties and local taxes are handled by your country's customs authority and are not refunded by Tempo. Contact your customs office for duty drawback guidance.",
  },
  {
    q: "How do I track my return?",
    a: "Once you initiate a return at /take-back, you receive a return authorization number and a tracking link by email within one business day. Refunds are processed within 5 to 10 business days of the item arriving at our fulfillment center.",
  },
  {
    q: "Can I return a garment that was altered for my adaptive needs?",
    a: "Garments that were altered after purchase are not eligible for standard returns. They are eligible for Take-Back at any time for 1,000 TempoPoints. If the alteration was required because the garment arrived incorrectly sized, contact us and we will treat it as a defective item.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <main className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[#5A5A5A]">
            <li>
              <Link
                href="/"
                className="hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-[#1A1A1A] font-medium" aria-current="page">
                Shipping and returns
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          Shipping and Returns
        </h1>
        <p className="text-lg text-[#5A5A5A] leading-relaxed mb-12">
          Tempo ships to the US, Canada, EU, and UK. Returns are accepted for 60
          to 120 days depending on your account type. Any garment can go through
          Take-Back at any time.
        </p>

        <div className="flex flex-col gap-6">
          {/* Shipping rates */}
          <Section id="shipping-rates" heading="Shipping Rates">
            <p>
              All rates are in USD. Timeframes are estimates and do not include
              order processing time (1 to 2 business days).
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm border-collapse" aria-label="Shipping rates by region and service level">
                <thead>
                  <tr className="border-b border-[#D4C9BA]">
                    <th
                      scope="col"
                      className="text-left py-3 pr-4 font-semibold text-[#1A1A1A]"
                    >
                      Region
                    </th>
                    <th
                      scope="col"
                      className="text-left py-3 pr-4 font-semibold text-[#1A1A1A]"
                    >
                      Standard
                    </th>
                    <th
                      scope="col"
                      className="text-left py-3 pr-4 font-semibold text-[#1A1A1A]"
                    >
                      Express
                    </th>
                    <th
                      scope="col"
                      className="text-left py-3 font-semibold text-[#1A1A1A]"
                    >
                      Overnight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shippingRates.map((row) => (
                    <tr
                      key={row.region}
                      className="border-b border-[#D4C9BA] last:border-0"
                    >
                      <th
                        scope="row"
                        className="text-left py-3 pr-4 font-medium text-[#1A1A1A] align-top"
                      >
                        {row.region}
                      </th>
                      <td className="py-3 pr-4 text-[#5A5A5A] align-top">
                        {row.standard}
                      </td>
                      <td className="py-3 pr-4 text-[#5A5A5A] align-top">
                        {row.express}
                      </td>
                      <td className="py-3 text-[#5A5A5A] align-top">
                        {row.overnight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Free shipping */}
          <Section id="free-shipping" heading="Free Shipping">
            <p>
              All customers receive free standard shipping on orders of{" "}
              <strong className="text-[#1A1A1A]">$75 or more</strong> to
              contiguous US addresses.
            </p>
            <p>
              <strong className="text-[#1A1A1A]">Advisor</strong> and{" "}
              <strong className="text-[#1A1A1A]">Architect</strong> tier members
              receive free standard shipping on every order, regardless of order
              value or destination. Tier status is based on your TempoPoints
              balance at the time of checkout.
            </p>
            <p>
              <Link
                href="/points/how-it-works"
                className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded text-sm"
              >
                Learn how TempoPoints tiers work
              </Link>
            </p>
          </Section>

          {/* Return windows */}
          <Section id="return-windows" heading="Return Windows">
            <p>
              Return windows are measured from the delivery confirmation date on
              your order.
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm border-collapse" aria-label="Return windows by account type">
                <thead>
                  <tr className="border-b border-[#D4C9BA]">
                    <th
                      scope="col"
                      className="text-left py-3 pr-4 font-semibold text-[#1A1A1A]"
                    >
                      Account type
                    </th>
                    <th
                      scope="col"
                      className="text-left py-3 font-semibold text-[#1A1A1A]"
                    >
                      Return window
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#D4C9BA]">
                    <th scope="row" className="text-left py-3 pr-4 font-medium text-[#1A1A1A]">
                      Individual
                    </th>
                    <td className="py-3 text-[#5A5A5A]">60 days</td>
                  </tr>
                  <tr className="border-b border-[#D4C9BA]">
                    <th scope="row" className="text-left py-3 pr-4 font-medium text-[#1A1A1A]">
                      Caregiver
                    </th>
                    <td className="py-3 text-[#5A5A5A]">90 days</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-left py-3 pr-4 font-medium text-[#1A1A1A]">
                      Agency
                    </th>
                    <td className="py-3 text-[#5A5A5A]">120 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Account type is set in your{" "}
              <Link
                href="/account"
                className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                account settings
              </Link>
              . The window that applied at the time of purchase is honored even
              if your account type changes afterward.
            </p>
          </Section>

          {/* Return condition requirements */}
          <Section id="return-conditions" heading="Return Condition Requirements">
            <p>
              Standard returns require the item to be{" "}
              <strong className="text-[#1A1A1A]">
                unworn with original tags attached
              </strong>
              . Hang tags and sewn-in garment labels must be present. Magnetic
              closures and adaptive hardware must be intact.
            </p>
            <p>
              Items returned in any other condition are not eligible for a cash
              refund, but they are{" "}
              <strong className="text-[#1A1A1A]">
                always eligible for Take-Back
              </strong>
              . The Take-Back program accepts garments in any condition,
              including worn, washed, or altered. Take-Back returns earn{" "}
              <strong className="text-[#1A1A1A]">1,000 TempoPoints</strong>{" "}
              instead of a cash refund. Garments are repaired for resale or
              recycled through our certified partner.
            </p>
          </Section>

          {/* How to start a return */}
          <Section id="how-to-return" heading="How to Start a Return">
            <ol className="list-decimal list-inside space-y-3 text-[#5A5A5A]">
              <li>
                Visit{" "}
                <Link
                  href="/take-back"
                  className="text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                >
                  /take-back
                </Link>{" "}
                and enter your order number and email address.
              </li>
              <li>
                Select the item or items you want to return and choose the return
                type: standard return or Take-Back.
              </li>
              <li>
                For standard returns within your window, print or download the
                return label (Advisor and Architect tiers receive prepaid labels).
                Drop the parcel at any carrier location.
              </li>
              <li>
                For Take-Back returns, redeem a free prepaid label using 500
                TempoPoints, or purchase postage separately.
              </li>
              <li>
                Refunds are processed within{" "}
                <strong className="text-[#1A1A1A]">5 to 10 business days</strong>{" "}
                of the item arriving at our fulfillment center. TempoPoints from
                Take-Back returns are credited within 24 hours of item receipt.
              </li>
            </ol>
          </Section>

          {/* Exchanges */}
          <Section id="exchanges" heading="Exchanges">
            <p>
              Tempo does not process exchanges as a single transaction. To get a
              different size or style, start a standard return for the original
              item and place a new order. If both the return and the new order
              are on the same account, free shipping is applied to the new order
              automatically.
            </p>
            <p>
              If a size exchange is needed because the garment fit did not match
              your Fit Concierge recommendation, contact us. We will cover
              shipping on the replacement.
            </p>
          </Section>

          {/* Damaged or defective items */}
          <Section id="damaged-defective" heading="Damaged or Defective Items">
            <p>
              If your item arrives damaged or has a manufacturing defect,{" "}
              <strong className="text-[#1A1A1A]">
                Tempo covers all shipping costs
              </strong>{" "}
              and will issue either a full replacement or a full refund,
              whichever you prefer.
            </p>
            <p>
              Report the issue within 30 days of delivery by contacting us
              through the Fit Concierge or by email. Include your order number
              and a photo of the defect. We respond within one business day. A
              prepaid return label is sent by email the same day your report is
              reviewed.
            </p>
            <p>
              Damage caused by alterations, adaptive hardware modifications made
              after purchase, or machine washing of hand-wash-only garments is
              not covered under this policy.
            </p>
          </Section>

          {/* FAQ */}
          <section
            aria-labelledby="faq-heading"
            className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 sm:p-8"
          >
            <h2
              id="faq-heading"
              className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-4 pb-3 border-b border-[#D4C9BA]"
            >
              Frequently Asked Questions
            </h2>
            <dl className="space-y-2">
              {faqs.map((item, i) => (
                <details
                  key={i}
                  className="group border border-[#D4C9BA] rounded-lg overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer text-sm font-medium text-[#1A1A1A] hover:bg-[#F0EBE3] motion-safe:transition-colors list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C29E5F]">
                    <dt>{item.q}</dt>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[#9A9A9A] group-open:rotate-180 motion-safe:transition-transform"
                    >
                      &#9660;
                    </span>
                  </summary>
                  <dd className="px-5 pb-4 pt-1 text-sm text-[#5A5A5A] leading-relaxed border-t border-[#D4C9BA] bg-[#FAFAF7]">
                    {item.a}
                  </dd>
                </details>
              ))}
            </dl>
          </section>
        </div>

        <p className="mt-10 text-xs text-[#9A9A9A] leading-relaxed">
          Policies apply to orders placed after April 1, 2026. For orders placed
          before that date, contact us and we will honor the policy in effect at
          the time of purchase. Tempo reserves the right to update these policies
          with 30 days notice posted on this page.
        </p>
      </div>
    </main>
  );
}
