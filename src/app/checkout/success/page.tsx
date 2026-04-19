import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { CheckCircle, Package, QrCode, Star } from "lucide-react";
import { awardPurchasePoints } from "@/app/actions/purchase";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { ClearCartOnSuccess } from "@/components/checkout/ClearCartOnSuccess";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/checkout/cancel");
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });
  } catch {
    redirect("/checkout/cancel");
  }

  if (session.payment_status !== "paid") {
    redirect("/checkout/cancel");
  }

  const meta = session.metadata ?? {};
  const orderTotal = (session.amount_total ?? 0) / 100;
  const pointsToAward = parseInt(meta.points_to_award ?? "0", 10);
  const skus = meta.skus ? meta.skus.split(",").filter(Boolean) : [];
  const customerEmail = session.customer_email ?? meta.customer_email ?? "";

  // Award TempoPoints - idempotent via session_id
  let pointsResult = { success: false, pointsAwarded: 0, skipped: false };
  if (pointsToAward > 0) {
    const result = await awardPurchasePoints(sessionId, orderTotal);
    pointsResult = {
      success: result.success,
      pointsAwarded: result.pointsAwarded ?? pointsToAward,
      skipped: result.skipped ?? false,
    };
  }

  // Send confirmation email (swallows errors)
  sendOrderConfirmationEmail({
    to: customerEmail,
    orderTotal: orderTotal.toFixed(2),
    itemsSummary: meta.items_summary ?? "",
    shippingName: meta.customer_name ?? "",
    shippingAddress: meta.shipping_address ?? "",
    isGift: meta.is_gift === "true",
    skus,
  }).catch(() => {});

  const showPointsBanner =
    pointsResult.success &&
    !pointsResult.skipped &&
    pointsResult.pointsAwarded > 0;

  // Stripe line items (expanded)
  const lineItems =
    (session.line_items as Stripe.ApiList<Stripe.LineItem> | null)?.data ?? [];

  return (
    <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center px-4 py-16">
      {/* Clear cart from localStorage on the client side */}
      <ClearCartOnSuccess />

      <div className="max-w-xl w-full">
        <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A1A1A] px-8 py-8 text-center">
            <CheckCircle
              size={48}
              className="text-[#7A8B75] mx-auto mb-4"
              aria-hidden="true"
            />
            <h1 className="font-playfair text-2xl font-bold text-[#FAFAF7] mb-2">
              Order confirmed
            </h1>
            {customerEmail && (
              <p className="text-[#9A9A9A] text-sm">
                Confirmation sent to {customerEmail}
              </p>
            )}
          </div>

          <div className="px-8 py-8 flex flex-col gap-6">
            {/* TempoPoints earned */}
            {showPointsBanner && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 bg-[#C29E5F]/10 border border-[#C29E5F]/30 rounded-xl px-4 py-3"
              >
                <Star
                  size={20}
                  className="text-[#C29E5F] shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  +{pointsResult.pointsAwarded} TempoPoints earned on this
                  order
                </p>
              </div>
            )}

            {/* Line items from Stripe */}
            {lineItems.length > 0 && (
              <section aria-label="Order details">
                <h2 className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-3">
                  What you ordered
                </h2>
                <ul className="flex flex-col gap-2 mb-3">
                  {lineItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between text-sm text-[#1A1A1A]"
                    >
                      <span>
                        {item.description}
                        {item.quantity && item.quantity > 1 && (
                          <span className="text-[#9A9A9A]">
                            {" "}
                            x{item.quantity}
                          </span>
                        )}
                      </span>
                      <span className="font-medium">
                        ${((item.amount_total ?? 0) / 100).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-bold text-[#1A1A1A] border-t border-[#D4C9BA] pt-3">
                  Total: ${orderTotal.toFixed(2)}
                </p>
              </section>
            )}

            {/* Shipping address */}
            {meta.shipping_address && (
              <section aria-label="Shipping information">
                <h2 className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-2">
                  Shipping to
                </h2>
                <p className="text-sm text-[#1A1A1A] leading-relaxed">
                  {meta.customer_name && (
                    <>
                      {meta.customer_name}
                      <br />
                    </>
                  )}
                  {meta.shipping_address}
                </p>
                {meta.is_gift === "true" && meta.gift_message && (
                  <p className="text-xs text-[#7A8B75] mt-2 italic">
                    Gift message: &ldquo;{meta.gift_message}&rdquo;
                  </p>
                )}
              </section>
            )}

            {/* Digital Passports */}
            {skus.length > 0 && (
              <section aria-label="Digital Product Passports">
                <h2 className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-3">
                  Your Tempo Passport
                  {skus.length > 1 ? "s are" : " is"} ready
                </h2>
                <ul className="flex flex-col gap-2">
                  {skus.map((sku) => (
                    <li key={sku}>
                      <Link
                        href={`/passport/${sku}`}
                        className="inline-flex items-center gap-2 text-sm text-[#7A8B75] underline underline-offset-2 hover:text-[#5a6b55] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                      >
                        <QrCode size={14} aria-hidden="true" />
                        View passport for {sku}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Care facility invoice note */}
            {meta.facility_invoice === "true" && meta.facility_name && (
              <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-lg px-4 py-3">
                <p className="text-sm text-[#1A1A1A] font-medium">
                  Net-30 invoice for {meta.facility_name}
                </p>
                <p className="text-xs text-[#5A5A5A] mt-1">
                  An invoice has been emailed to {customerEmail}. Payment due
                  within 30 days.
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#D4C9BA]">
              <Link
                href="/shop"
                className="flex-1 flex items-center justify-center gap-2 border border-[#D4C9BA] text-[#5A5A5A] font-medium text-sm px-4 py-3 rounded-lg hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                Continue shopping
              </Link>
              <Link
                href="/passport"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#FAFAF7] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#2A2A2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <Package size={16} aria-hidden="true" />
                Track your order
              </Link>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#9A9A9A] text-center mt-6">
          Questions? Email{" "}
          <a
            href="mailto:orders@tempo.style"
            className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            orders@tempo.style
          </a>
        </p>
      </div>
    </div>
  );
}
