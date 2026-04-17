"use client";

import { useState } from "react";
import { ShoppingCart, Pencil, Trash2, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { AddRecipientModal } from "./AddRecipientModal";
import type { CareRecipient } from "@/lib/types/account";

interface Props {
  recipient: CareRecipient;
  onUpdate: (updated: CareRecipient) => void;
  onDelete: (id: string) => void;
}

export function RecipientCard({ recipient, onUpdate, onDelete }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [reorderDone, setReorderDone] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleQuickReorder() {
    if (recipient.saved_items.length === 0) return;
    recipient.saved_items.forEach((item) => {
      addItem({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: 1,
      });
    });
    setReorderDone(true);
    setTimeout(() => setReorderDone(false), 3000);
  }

  return (
    <article
      aria-label={`Care recipient: ${recipient.display_name}`}
      className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-playfair text-lg font-bold text-[#1A1A1A]">
            {recipient.display_name}
          </h3>
          {recipient.conditions.length > 0 && (
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              {recipient.conditions.join(", ")}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            aria-label={`Edit ${recipient.display_name}`}
            className="p-1.5 rounded-lg text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#E8DFD2] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <Pencil size={14} aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(recipient.id)}
            aria-label={`Remove ${recipient.display_name}`}
            className="p-1.5 rounded-lg text-[#5A5A5A] hover:text-[#C4725A] hover:bg-[#C4725A]/10 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-[#9A9A9A] uppercase tracking-wide">Top</p>
          <p className="text-sm font-semibold text-[#1A1A1A]">{recipient.sizes.top || "--"}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#9A9A9A] uppercase tracking-wide">Bottom</p>
          <p className="text-sm font-semibold text-[#1A1A1A]">{recipient.sizes.bottom || "--"}</p>
        </div>
        {recipient.sizes.shoe && (
          <div className="text-center">
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wide">Shoe</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">{recipient.sizes.shoe}</p>
          </div>
        )}
      </div>

      {recipient.notes && (
        <p className="text-xs text-[#5A5A5A] leading-relaxed mb-4 italic">
          {recipient.notes}
        </p>
      )}

      {recipient.last_order_date && (
        <p className="text-xs text-[#9A9A9A] mb-4">
          Last ordered:{" "}
          {new Date(recipient.last_order_date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}

      {recipient.saved_items.length > 0 ? (
        <button
          onClick={handleQuickReorder}
          aria-live="polite"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#C29E5F] text-[#C29E5F] text-sm font-medium hover:bg-[#C29E5F]/10 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          {reorderDone ? (
            <>
              <RotateCcw size={14} aria-hidden="true" />
              Added to cart
            </>
          ) : (
            <>
              <ShoppingCart size={14} aria-hidden="true" />
              Quick reorder ({recipient.saved_items.length}{" "}
              {recipient.saved_items.length === 1 ? "item" : "items"})
            </>
          )}
        </button>
      ) : (
        <p className="text-xs text-[#9A9A9A] text-center py-2">
          No saved items yet. Add items to enable quick reorder.
        </p>
      )}

      <AddRecipientModal
        open={editOpen}
        initial={recipient}
        onSave={(updated) => {
          onUpdate(updated);
          setEditOpen(false);
        }}
        onClose={() => setEditOpen(false)}
      />
    </article>
  );
}
