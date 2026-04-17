"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle, ChevronRight } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/store/cart";

const SHIPPING_FREE_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  isGift: boolean;
  giftMessage: string;
  billSeparately: boolean;
  recipientFirstName: string;
  recipientLastName: string;
  recipientAddress1: string;
  recipientAddress2: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  facilityInvoice: boolean;
  facilityName: string;
}

const emptyForm: ShippingData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  isGift: false,
  giftMessage: "",
  billSeparately: false,
  recipientFirstName: "",
  recipientLastName: "",
  recipientAddress1: "",
  recipientAddress2: "",
  recipientCity: "",
  recipientState: "",
  recipientZip: "",
  facilityInvoice: false,
  facilityName: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  required,
  hint,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#1A1A1A]">
        {label}
        {required && (
          <span className="text-[#C4372A] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-[#5A5A5A]">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-[#1A1A1A] text-sm placeholder-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C29E5F] focus:border-transparent transition-shadow";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<ShippingData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { items } = useCartStore();
  const subtotal = useCartSubtotal();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  const shippingCost = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Valid email address is required";
    if (!form.address1.trim()) errs.address1 = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.zip.trim()) errs.zip = "ZIP code is required";
    if (form.facilityInvoice && !form.facilityName.trim())
      errs.facilityName = "Facility name is required for net-30 invoicing";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstId = Object.keys(errs)[0] ?? "";
      if (firstId) document.getElementById(firstId)?.focus();
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shipping: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address1: form.billSeparately
              ? form.recipientAddress1
              : form.address1,
            address2: form.billSeparately
              ? form.recipientAddress2
              : form.address2,
            city: form.billSeparately ? form.recipientCity : form.city,
            state: form.billSeparately ? form.recipientState : form.state,
            zip: form.billSeparately ? form.recipientZip : form.zip,
          },
          isGift: form.isGift,
          giftMessage: form.giftMessage,
          facilityInvoice: form.facilityInvoice,
          facilityName: form.facilityName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      // Redirect to Stripe-hosted checkout
      window.location.assign(data.url);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center">
        <p className="text-[#5A5A5A]">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8DFD2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="text-sm text-[#7A8B75] underline underline-offset-2 hover:text-[#5a6b55] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Back to cart
          </Link>
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mt-3">
            Checkout
          </h1>
          <p className="text-sm text-[#5A5A5A] mt-1">
            Enter your shipping details, then complete payment securely on
            Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Shipping form ──────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Shipping information"
            className="lg:col-span-2 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 sm:p-8 flex flex-col gap-5"
          >
            <h2 className="font-playfair text-xl font-semibold text-[#1A1A1A]">
              Shipping information
            </h2>

            {apiError && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
              >
                <AlertCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {apiError}
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" id="firstName" required>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  className={inputCls}
                />
                {errors.firstName && (
                  <p
                    id="firstName-error"
                    role="alert"
                    className="text-xs text-[#C4372A]"
                  >
                    {errors.firstName}
                  </p>
                )}
              </Field>
              <Field label="Last name" id="lastName" required>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                  className={inputCls}
                />
                {errors.lastName && (
                  <p
                    id="lastName-error"
                    role="alert"
                    className="text-xs text-[#C4372A]"
                  >
                    {errors.lastName}
                  </p>
                )}
              </Field>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email address" id="email" required>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputCls}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-xs text-[#C4372A]"
                  >
                    {errors.email}
                  </p>
                )}
              </Field>
              <Field label="Phone (optional)" id="phone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Address */}
            <Field label="Address line 1" id="address1" required>
              <input
                id="address1"
                name="address1"
                type="text"
                autoComplete="address-line1"
                value={form.address1}
                onChange={handleChange}
                aria-required="true"
                aria-describedby={
                  errors.address1 ? "address1-error" : undefined
                }
                className={inputCls}
              />
              {errors.address1 && (
                <p
                  id="address1-error"
                  role="alert"
                  className="text-xs text-[#C4372A]"
                >
                  {errors.address1}
                </p>
              )}
            </Field>

            <Field label="Address line 2 (optional)" id="address2">
              <input
                id="address2"
                name="address2"
                type="text"
                autoComplete="address-line2"
                value={form.address2}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Field label="City" id="city" required>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.city ? "city-error" : undefined}
                    className={inputCls}
                  />
                  {errors.city && (
                    <p
                      id="city-error"
                      role="alert"
                      className="text-xs text-[#C4372A]"
                    >
                      {errors.city}
                    </p>
                  )}
                </Field>
              </div>
              <Field label="State" id="state" required>
                <input
                  id="state"
                  name="state"
                  type="text"
                  autoComplete="address-level1"
                  placeholder="CA"
                  maxLength={2}
                  value={form.state}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.state ? "state-error" : undefined}
                  className={inputCls}
                />
                {errors.state && (
                  <p
                    id="state-error"
                    role="alert"
                    className="text-xs text-[#C4372A]"
                  >
                    {errors.state}
                  </p>
                )}
              </Field>
              <Field label="ZIP code" id="zip" required>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  autoComplete="postal-code"
                  value={form.zip}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.zip ? "zip-error" : undefined}
                  className={inputCls}
                />
                {errors.zip && (
                  <p
                    id="zip-error"
                    role="alert"
                    className="text-xs text-[#C4372A]"
                  >
                    {errors.zip}
                  </p>
                )}
              </Field>
            </div>

            {/* ── Caregiver toggles ────────────────────────────────────── */}
            <fieldset className="bg-[#F5F1EC] border border-[#D4C9BA] rounded-xl p-5 flex flex-col gap-4">
              <legend className="sr-only">Delivery options</legend>

              {/* Gift */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  id="isGift"
                  name="isGift"
                  type="checkbox"
                  checked={form.isGift}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#D4C9BA] text-[#C29E5F] focus:ring-[#C29E5F] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">
                  This is a gift
                </span>
              </label>
              {form.isGift && (
                <Field label="Gift message (optional)" id="giftMessage">
                  <textarea
                    id="giftMessage"
                    name="giftMessage"
                    rows={3}
                    maxLength={200}
                    value={form.giftMessage}
                    onChange={handleChange}
                    placeholder="Your message will be included on a card inside the package."
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              )}

              {/* Bill separately */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  id="billSeparately"
                  name="billSeparately"
                  type="checkbox"
                  checked={form.billSeparately}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#D4C9BA] text-[#C29E5F] focus:ring-[#C29E5F] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">
                  Bill me, ship to care recipient at a different address
                </span>
              </label>
              {form.billSeparately && (
                <div className="pl-7 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Recipient first name"
                      id="recipientFirstName"
                      required
                    >
                      <input
                        id="recipientFirstName"
                        name="recipientFirstName"
                        type="text"
                        value={form.recipientFirstName}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>
                    <Field
                      label="Recipient last name"
                      id="recipientLastName"
                      required
                    >
                      <input
                        id="recipientLastName"
                        name="recipientLastName"
                        type="text"
                        value={form.recipientLastName}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <Field
                    label="Recipient address"
                    id="recipientAddress1"
                    required
                  >
                    <input
                      id="recipientAddress1"
                      name="recipientAddress1"
                      type="text"
                      autoComplete="off"
                      value={form.recipientAddress1}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </Field>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <Field label="City" id="recipientCity" required>
                        <input
                          id="recipientCity"
                          name="recipientCity"
                          type="text"
                          autoComplete="off"
                          value={form.recipientCity}
                          onChange={handleChange}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <Field label="State" id="recipientState" required>
                      <input
                        id="recipientState"
                        name="recipientState"
                        type="text"
                        maxLength={2}
                        autoComplete="off"
                        value={form.recipientState}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="ZIP" id="recipientZip" required>
                      <input
                        id="recipientZip"
                        name="recipientZip"
                        type="text"
                        autoComplete="off"
                        value={form.recipientZip}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* Care facility invoice */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  id="facilityInvoice"
                  name="facilityInvoice"
                  type="checkbox"
                  checked={form.facilityInvoice}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#D4C9BA] text-[#C29E5F] focus:ring-[#C29E5F] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">
                  Invoice for a care facility (net-30)
                </span>
              </label>
              {form.facilityInvoice && (
                <div className="pl-7">
                  <Field
                    label="Facility name"
                    id="facilityName"
                    required
                    hint={
                      errors.facilityName
                        ? undefined
                        : `A net-30 invoice will be emailed to ${form.email || "your email address"}. Payment due within 30 days.`
                    }
                  >
                    <input
                      id="facilityName"
                      name="facilityName"
                      type="text"
                      value={form.facilityName}
                      onChange={handleChange}
                      aria-describedby={
                        errors.facilityName
                          ? "facilityName-error"
                          : "facilityName-hint"
                      }
                      className={inputCls}
                    />
                    {errors.facilityName && (
                      <p
                        id="facilityName-error"
                        role="alert"
                        className="text-xs text-[#C4372A]"
                      >
                        {errors.facilityName}
                      </p>
                    )}
                  </Field>
                </div>
              )}
            </fieldset>

            {/* HSA/FSA callout */}
            <div className="bg-[#FDF9F3] border border-[#C29E5F]/30 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                Using an HSA or FSA card?
              </p>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">
                Tempo items are eligible for reimbursement under most plans. We
                will email your itemized receipt formatted for your plan
                administrator.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#FAFAF7] font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-[#2A2A2A] disabled:bg-[#D4C9BA] disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              {loading ? (
                "Redirecting to Stripe..."
              ) : (
                <>
                  <Lock size={14} aria-hidden="true" />
                  Continue to secure payment
                  <ChevronRight size={16} aria-hidden="true" />
                </>
              )}
            </button>

            <p className="text-xs text-[#9A9A9A] text-center">
              You will be redirected to Stripe to complete payment. Your cart
              is saved.
            </p>
          </form>

          {/* ── Order summary ────────────────────────────────────────────── */}
          <aside aria-label="Order summary" className="lg:col-span-1">
            <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5 sticky top-24">
              <h2 className="font-playfair text-base font-semibold text-[#1A1A1A] mb-4">
                Order summary
              </h2>
              <ul className="flex flex-col gap-2 mb-4" aria-label="Cart items">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between text-xs text-[#5A5A5A]"
                  >
                    <span className="truncate mr-2">
                      {item.name} ({item.size}) x{item.quantity}
                    </span>
                    <span className="shrink-0 font-medium text-[#1A1A1A]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="flex flex-col gap-1.5 text-sm border-t border-[#D4C9BA] pt-3">
                <div className="flex justify-between text-[#5A5A5A]">
                  <dt>Subtotal</dt>
                  <dd>${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-[#5A5A5A]">
                  <dt>Shipping</dt>
                  <dd
                    className={
                      shippingCost === 0 ? "text-[#7A8B75]" : undefined
                    }
                  >
                    {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between font-bold text-[#1A1A1A] pt-2 border-t border-[#D4C9BA]">
                  <dt>Total</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>
              </dl>
              <p className="text-xs text-[#7A8B75] font-medium mt-2">
                +{Math.floor(total) * 10} TempoPoints on this order
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
