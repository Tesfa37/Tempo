// Post-launch TODO: add webhook handler at /api/webhooks/stripe for async fulfillment,
// inventory sync, and receipt emails.

import Stripe from "stripe";
import { NextResponse } from "next/server";
import type { CartItem } from "@/store/cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SHIPPING_FREE_THRESHOLD = 100;
const SHIPPING_RATE_CENTS = 999; // $9.99

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      shipping,
      isGift,
      giftMessage,
      facilityInvoice,
      facilityName,
    }: {
      items: CartItem[];
      shipping: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
      };
      isGift: boolean;
      giftMessage: string;
      facilityInvoice: boolean;
      facilityName: string;
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
    const shippingCents =
      subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_RATE_CENTS;
    const totalDollars = subtotal + shippingCents / 100;
    const pointsToAward = Math.floor(totalDollars) * 10;

    const itemsSummary = items
      .map((i: CartItem) => `${i.name} (${i.size}) x${i.quantity}`)
      .join(", ")
      .slice(0, 490);

    const skus = items
      .map((i: CartItem) => i.productId.toUpperCase())
      .join(",")
      .slice(0, 200);

    // Build Stripe line items - one per cart item
    const lineItems = items.map(
      (item: CartItem) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name}, Size ${item.size}`,
            description: "Adaptive fashion by Tempo",
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    // Add shipping as a line item when not free
    if (shippingCents > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Standard Shipping", description: "Delivered in 5-7 business days" },
          unit_amount: shippingCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: shipping.email,
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
      metadata: {
        customer_name: `${shipping.firstName} ${shipping.lastName}`,
        shipping_address: [
          shipping.address1,
          shipping.address2,
          `${shipping.city}, ${shipping.state} ${shipping.zip}`,
        ]
          .filter(Boolean)
          .join(", "),
        is_gift: isGift ? "true" : "false",
        gift_message: isGift ? giftMessage.slice(0, 200) : "",
        facility_invoice: facilityInvoice ? "true" : "false",
        facility_name: facilityName ? facilityName.slice(0, 100) : "",
        points_to_award: String(pointsToAward),
        items_summary: itemsSummary,
        skus,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
