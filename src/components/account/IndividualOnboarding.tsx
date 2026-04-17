"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import type { FitProfile } from "@/lib/types/account";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];
const CONDITIONS: { value: string; label: string }[] = [
  { value: "arthritis", label: "Arthritis" },
  { value: "post-stroke", label: "Post-stroke" },
  { value: "wheelchair", label: "Wheelchair mobility" },
  { value: "limited-mobility", label: "Limited mobility" },
  { value: "sensory", label: "Sensory sensitivities" },
  { value: "dementia", label: "Dementia" },
];

interface Props {
  initial: FitProfile | null;
}

export function IndividualOnboarding({ initial }: Props) {
  const [top, setTop] = useState(initial?.top ?? "");
  const [bottom, setBottom] = useState(initial?.bottom ?? "");
  const [shoe, setShoe] = useState(initial?.shoe ?? "");
  const [conditions, setConditions] = useState<string[]>(
    initial?.conditions ?? []
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function toggleCondition(value: string) {
    setSaved(false);
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError("");
    startTransition(async () => {
      const result = await updateProfile({
        fit_profile: { top, bottom, shoe: shoe || undefined, conditions, notes },
      });
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Failed to save");
      }
    });
  }

  return (
    <section aria-labelledby="individual-onboarding-heading">
      <h2
        id="individual-onboarding-heading"
        className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
      >
        Your fit profile
      </h2>
      <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-medium text-[#1A1A1A] mb-2">
            Sizes
          </legend>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="fit-top" className="block text-xs text-[#5A5A5A] mb-1">Top size</label>
              <select
                id="fit-top"
                value={top}
                onChange={(e) => { setTop(e.target.value); setSaved(false); }}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <option value="">Select</option>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="fit-bottom" className="block text-xs text-[#5A5A5A] mb-1">Bottom size</label>
              <select
                id="fit-bottom"
                value={bottom}
                onChange={(e) => { setBottom(e.target.value); setSaved(false); }}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <option value="">Select</option>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="fit-shoe" className="block text-xs text-[#5A5A5A] mb-1">Shoe size (optional)</label>
              <select
                id="fit-shoe"
                value={shoe}
                onChange={(e) => { setShoe(e.target.value); setSaved(false); }}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                <option value="">Select</option>
                {SHOE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-[#1A1A1A] mb-1">Conditions</legend>
          <p className="text-xs text-[#5A5A5A] mb-3">Optional. Used to personalise product filters. Not shared publicly.</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(({ value, label }) => {
              const checked = conditions.includes(value);
              return (
                <label
                  key={value}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer motion-safe:transition-colors ${
                    checked
                      ? "border-[#7A8B75] bg-[#7A8B75]/10 text-[#1A1A1A] font-medium"
                      : "border-[#D4C9BA] text-[#5A5A5A] hover:border-[#9A9A9A]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleCondition(value)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="fit-notes" className="block text-sm font-medium text-[#1A1A1A] mb-1">
            Fit preferences or notes
          </label>
          <p className="text-xs text-[#5A5A5A] mb-2">Optional. Shared with the Fit Concierge to personalise suggestions.</p>
          <textarea
            id="fit-notes"
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            rows={3}
            placeholder="e.g. prefer loose fit, sensitive to seams, need extra room in the shoulders"
            className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save fit profile"}
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
