import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl px-8 py-10">
          <XCircle
            size={48}
            className="text-[#9A9A9A] mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-3">
            Payment not completed
          </h1>
          <p className="text-[#5A5A5A] text-sm leading-relaxed mb-8">
            Your cart is still saved. You can return to checkout whenever you
            are ready.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#FAFAF7] font-semibold text-sm px-6 py-3.5 rounded-lg hover:bg-[#2A2A2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              Return to checkout
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 border border-[#D4C9BA] text-[#5A5A5A] font-medium text-sm px-6 py-3 rounded-lg hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to cart
            </Link>
          </div>
        </div>

        <p className="text-xs text-[#9A9A9A] mt-6">
          Need help?{" "}
          <a
            href="mailto:orders@tempo.style"
            className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Email us
          </a>
        </p>
      </div>
    </div>
  );
}
