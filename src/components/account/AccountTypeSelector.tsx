"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import type { AccountType } from "@/lib/types/account";
import { User, Users, Building2 } from "lucide-react";

const TYPES: {
  value: AccountType;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "individual",
    label: "Individual",
    sublabel: "Shopping for yourself",
    Icon: User,
  },
  {
    value: "caregiver",
    label: "Caregiver",
    sublabel: "Shopping for a family member or person you support",
    Icon: Users,
  },
  {
    value: "agency",
    label: "Professional caregiver",
    sublabel: "Purchasing for a care facility or agency",
    Icon: Building2,
  },
];

interface Props {
  current: AccountType;
  onChanged?: (type: AccountType) => void;
}

export function AccountTypeSelector({ current, onChanged }: Props) {
  const [selected, setSelected] = useState<AccountType>(current);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSelect(type: AccountType) {
    setSelected(type);
    setError("");
    startTransition(async () => {
      const result = await updateProfile({ account_type: type });
      if (!result.success) {
        setError(result.error ?? "Failed to save");
        setSelected(current);
      } else {
        onChanged?.(type);
      }
    });
  }

  return (
    <section aria-labelledby="account-type-heading">
      <h2
        id="account-type-heading"
        className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
      >
        Account type
      </h2>
      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid sm:grid-cols-3 gap-3"
      >
        {TYPES.map(({ value, label, sublabel, Icon }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(value)}
              disabled={isPending}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50 ${
                isSelected
                  ? "border-[#C29E5F] bg-[#C29E5F]/10"
                  : "border-[#D4C9BA] bg-[#FAFAF7] hover:border-[#9A9A9A]"
              }`}
            >
              <Icon
                size={20}
                className={isSelected ? "text-[#C29E5F]" : "text-[#5A5A5A]"}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-[#1A1A1A]">
                {label}
              </span>
              <span className="text-xs text-[#5A5A5A] leading-relaxed">
                {sublabel}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-[#C4725A] mt-2" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
