"use client";

import { useState, useTransition } from "react";
import { Plus, Users } from "lucide-react";
import { updateCareRecipients } from "@/app/actions/account";
import { RecipientCard } from "./RecipientCard";
import { AddRecipientModal } from "./AddRecipientModal";
import type { CareRecipient } from "@/lib/types/account";

interface Props {
  initialRecipients: CareRecipient[];
}

export function CaregiverDashboardClient({ initialRecipients }: Props) {
  const [recipients, setRecipients] = useState<CareRecipient[]>(initialRecipients);
  const [addOpen, setAddOpen] = useState(false);
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

  function handleAdd(recipient: CareRecipient) {
    persist([...recipients, recipient]);
    setAddOpen(false);
  }

  function handleUpdate(updated: CareRecipient) {
    persist(recipients.map((r) => (r.id === updated.id ? updated : r)));
  }

  function handleDelete(id: string) {
    persist(recipients.filter((r) => r.id !== id));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#5A5A5A]">
          {recipients.length === 0
            ? "No recipients yet."
            : `${recipients.length} recipient${recipients.length > 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <Plus size={14} aria-hidden="true" />
          Add recipient
        </button>
      </div>

      {recipients.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#D4C9BA] rounded-2xl">
          <Users size={36} className="text-[#D4C9BA] mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-[#5A5A5A] mb-4">
            Add a care recipient to manage their sizes and enable quick reorder.
          </p>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C29E5F] text-white text-sm font-medium hover:bg-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <Plus size={14} aria-hidden="true" />
            Add first recipient
          </button>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4" aria-label="Care recipient roster">
          {recipients.map((r) => (
            <li key={r.id}>
              <RecipientCard
                recipient={r}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[#9A9A9A] mt-4" aria-live="polite" aria-atomic="true">
        {isPending ? "Saving..." : ""}
      </p>
      {error && (
        <p className="text-sm text-[#C4725A] mt-4" role="alert">{error}</p>
      )}

      <AddRecipientModal
        open={addOpen}
        onSave={handleAdd}
        onClose={() => setAddOpen(false)}
      />
    </>
  );
}
