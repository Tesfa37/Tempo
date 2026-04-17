"use client";

import { useState, useTransition } from "react";
import { Plus, Users } from "lucide-react";
import { updateCareRecipients } from "@/app/actions/account";
import { AddRecipientModal } from "./AddRecipientModal";
import type { CareRecipient } from "@/lib/types/account";

interface Props {
  initial: CareRecipient[];
}

export function CaregiverOnboarding({ initial }: Props) {
  const [recipients, setRecipients] = useState<CareRecipient[]>(initial);
  const [editingRecipient, setEditingRecipient] = useState<CareRecipient | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function persist(next: CareRecipient[]) {
    setRecipients(next);
    setError("");
    startTransition(async () => {
      const result = await updateCareRecipients(next);
      if (!result.success) setError(result.error ?? "Failed to save");
    });
  }

  function handleSave(recipient: CareRecipient) {
    const next = recipients.some((r) => r.id === recipient.id)
      ? recipients.map((r) => (r.id === recipient.id ? recipient : r))
      : [...recipients, recipient];
    persist(next);
    setModalOpen(false);
    setEditingRecipient(undefined);
  }

  function openAdd() {
    setEditingRecipient(undefined);
    setModalOpen(true);
  }

  function openEdit(r: CareRecipient) {
    setEditingRecipient(r);
    setModalOpen(true);
  }

  return (
    <section aria-labelledby="caregiver-onboarding-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="caregiver-onboarding-heading"
          className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest"
        >
          Care recipients
        </h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C29E5F] hover:text-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
        >
          <Plus size={14} aria-hidden="true" />
          Add recipient
        </button>
      </div>

      {recipients.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-[#D4C9BA] rounded-xl">
          <Users size={28} className="text-[#D4C9BA] mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-[#5A5A5A]">No recipients yet.</p>
          <button
            onClick={openAdd}
            className="mt-3 text-sm text-[#C29E5F] underline underline-offset-2 hover:text-[#a8874f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Add your first recipient
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2" aria-label="Care recipients">
          {recipients.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between px-4 py-3 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl"
            >
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{r.display_name}</p>
                <p className="text-xs text-[#5A5A5A] mt-0.5">
                  Top: {r.sizes.top}, Bottom: {r.sizes.bottom}
                  {r.conditions.length > 0 && `, ${r.conditions.join(", ")}`}
                </p>
              </div>
              <button
                onClick={() => openEdit(r)}
                className="text-xs text-[#5A5A5A] underline underline-offset-2 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                aria-label={`Edit ${r.display_name}`}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[#9A9A9A] mt-2" aria-live="polite" aria-atomic="true">
        {isPending ? "Saving..." : ""}
      </p>
      {error && (
        <p className="text-sm text-[#C4725A] mt-2" role="alert">{error}</p>
      )}

      <p className="text-xs text-[#9A9A9A] mt-4">
        Manage recipients and quick reorder on the{" "}
        <a
          href="/account/caregiver"
          className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
        >
          Care recipients dashboard
        </a>
        .
      </p>

      <AddRecipientModal
        open={modalOpen}
        initial={editingRecipient}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditingRecipient(undefined); }}
      />
    </section>
  );
}
