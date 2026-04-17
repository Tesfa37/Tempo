"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import type { AgencySettings } from "@/lib/types/account";

interface Props {
  initial: AgencySettings | null;
}

export function AgencyOnboarding({ initial }: Props) {
  const [facilityName, setFacilityName] = useState(initial?.facility_name ?? "");
  const [bulkOrder, setBulkOrder] = useState(initial?.bulk_order ?? false);
  const [net30, setNet30] = useState(initial?.net30 ?? false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError("");
    startTransition(async () => {
      const result = await updateProfile({
        agency_settings: { facility_name: facilityName.trim(), bulk_order: bulkOrder, net30 },
      });
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Failed to save");
      }
    });
  }

  return (
    <section aria-labelledby="agency-onboarding-heading">
      <h2
        id="agency-onboarding-heading"
        className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
      >
        Agency settings
      </h2>
      <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-5">
        <div>
          <label htmlFor="facility-name" className="block text-sm font-medium text-[#1A1A1A] mb-1">
            Facility or agency name
          </label>
          <input
            id="facility-name"
            type="text"
            value={facilityName}
            onChange={(e) => { setFacilityName(e.target.value); setSaved(false); }}
            required
            placeholder="e.g. Sunrise Memory Care, Room 4B"
            className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-[#1A1A1A] mb-1">Purchasing preferences</legend>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={bulkOrder}
              onChange={(e) => { setBulkOrder(e.target.checked); setSaved(false); }}
              className="mt-0.5 rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
            />
            <span className="text-sm text-[#1A1A1A]">
              Bulk order preferences
              <span className="block text-xs text-[#5A5A5A] font-normal">
                Contact us about volume pricing for orders of 10 or more items.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={net30}
              onChange={(e) => { setNet30(e.target.checked); setSaved(false); }}
              className="mt-0.5 rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
            />
            <span className="text-sm text-[#1A1A1A]">
              Net-30 invoicing
              <span className="block text-xs text-[#5A5A5A] font-normal">
                Receive invoices payable within 30 days. Subject to approval.
              </span>
            </span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save agency settings"}
          </button>
          {saved && (
            <p className="text-sm text-[#7A8B75]" role="status" aria-live="polite">Saved</p>
          )}
          {error && (
            <p className="text-sm text-[#C4725A]" role="alert">{error}</p>
          )}
        </div>
      </form>
    </section>
  );
}
