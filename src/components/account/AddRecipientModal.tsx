"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CareRecipient } from "@/lib/types/account";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];
const CONDITIONS: { value: string; label: string }[] = [
  { value: "arthritis", label: "Arthritis" },
  { value: "post-stroke", label: "Post-stroke" },
  { value: "wheelchair", label: "Wheelchair user" },
  { value: "limited-mobility", label: "Limited mobility" },
  { value: "sensory", label: "Sensory sensitivities" },
  { value: "dementia", label: "Dementia" },
];

interface Props {
  open: boolean;
  initial?: CareRecipient;
  onSave: (recipient: CareRecipient) => void;
  onClose: () => void;
}

export function AddRecipientModal({ open, initial, onSave, onClose }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [topSize, setTopSize] = useState("");
  const [bottomSize, setBottomSize] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initial) {
      setDisplayName(initial.display_name);
      setConditions(initial.conditions);
      setTopSize(initial.sizes.top);
      setBottomSize(initial.sizes.bottom);
      setShoeSize(initial.sizes.shoe ?? "");
      setNotes(initial.notes);
    } else {
      setDisplayName("");
      setConditions([]);
      setTopSize("");
      setBottomSize("");
      setShoeSize("");
      setNotes("");
    }
  }, [initial, open]);

  function toggleCondition(value: string) {
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      display_name: displayName.trim(),
      conditions,
      sizes: { top: topSize, bottom: bottomSize, shoe: shoeSize || undefined },
      notes: notes.trim(),
      saved_items: initial?.saved_items ?? [],
      last_order_date: initial?.last_order_date,
    });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipient-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D4C9BA]">
          <h2 id="recipient-modal-title" className="font-playfair text-lg font-bold text-[#1A1A1A]">
            {initial ? "Edit recipient" : "Add care recipient"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-[#5A5A5A] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="px-6 py-6 flex flex-col gap-5">
          <div>
            <label htmlFor="recipient-name" className="block text-sm font-medium text-[#1A1A1A] mb-1">
              Display name
            </label>
            <input
              id="recipient-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Margaret, or Room 14B"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-[#1A1A1A] mb-3">Sizes</legend>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "r-top", label: "Top", value: topSize, setter: setTopSize, required: true },
                { id: "r-bottom", label: "Bottom", value: bottomSize, setter: setBottomSize, required: true },
              ].map(({ id, label, value, setter, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs text-[#5A5A5A] mb-1">{label}</label>
                  <select
                    id={id}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required={required}
                    className="w-full px-2 py-2 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                  >
                    <option value="">--</option>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label htmlFor="r-shoe" className="block text-xs text-[#5A5A5A] mb-1">Shoe (opt.)</label>
                <select
                  id="r-shoe"
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                >
                  <option value="">--</option>
                  {SHOE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-[#1A1A1A] mb-1">Conditions</legend>
            <p className="text-xs text-[#5A5A5A] mb-3">Optional. Used to filter product recommendations.</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(({ value, label }) => {
                const checked = conditions.includes(value);
                return (
                  <label
                    key={value}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer motion-safe:transition-colors ${
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
            <label htmlFor="r-notes" className="block text-sm font-medium text-[#1A1A1A] mb-1">Notes</label>
            <textarea
              id="r-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. prefers front-opening tops, care setting: memory care unit"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#D4C9BA]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#D4C9BA] text-sm text-[#5A5A5A] hover:bg-[#E8DFD2] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              {initial ? "Save changes" : "Add recipient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
