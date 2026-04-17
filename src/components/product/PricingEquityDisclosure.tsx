"use client";

import { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import Link from "next/link";

export function PricingEquityDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-lg text-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="pricing-equity-panel"
        className="flex items-center justify-between w-full gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 rounded"
      >
        <span className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span className="font-medium text-amber-900">
            Financial support available
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-amber-700 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id="pricing-equity-panel"
        role="region"
        aria-label="Financial support details"
        hidden={!open}
        className="mt-3 pt-3 border-t border-amber-200"
      >
        <p className="text-amber-900 leading-relaxed">
          Eligible for HSA and FSA reimbursement. Medicaid reimbursement pathway
          in pilot with two state programs. Caregiver agency bulk pricing at 15
          percent off for orders of 12 or more. Veterans Affairs clothing
          allowance accepted. Ask the Fit Concierge about financial support
          options.
        </p>
        <Link
          href="/financial-support"
          className="inline-block mt-3 text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-1 rounded"
        >
          Learn more about financial support
        </Link>
      </div>
    </div>
  );
}
