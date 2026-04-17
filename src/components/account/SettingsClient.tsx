"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, softDeleteAccount } from "@/app/actions/account";
import type { Profile } from "@/lib/types/account";
import { Download, Trash2 } from "lucide-react";

interface Props {
  profile: Profile;
}

export function SettingsClient({ profile }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [marketing, setMarketing] = useState(profile.email_preferences.marketing);
  const [orderUpdates, setOrderUpdates] = useState(profile.email_preferences.order_updates);
  const [pointAlerts, setPointAlerts] = useState(profile.email_preferences.point_alerts);
  const [publicLeaderboard, setPublicLeaderboard] = useState(profile.public_leaderboard);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaved(false);
    setProfileError("");
    startTransition(async () => {
      const result = await updateProfile({
        display_name: displayName.trim() || undefined,
        email_preferences: { marketing, order_updates: orderUpdates, point_alerts: pointAlerts },
        public_leaderboard: publicLeaderboard,
      });
      if (result.success) {
        setProfileSaved(true);
      } else {
        setProfileError(result.error ?? "Failed to save");
      }
    });
  }

  function handleDelete() {
    if (deleteConfirm !== "delete my account") {
      setDeleteError('Type "delete my account" to confirm.');
      return;
    }
    setDeleteError("");
    startDeleteTransition(async () => {
      const result = await softDeleteAccount();
      if (result.success) {
        router.push("/?deleted=1");
      } else {
        setDeleteError(result.error ?? "Failed to delete account");
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Profile form */}
      <section aria-labelledby="profile-settings-heading">
        <h2
          id="profile-settings-heading"
          className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-4"
        >
          Profile
        </h2>
        <form onSubmit={(e) => void handleSaveProfile(e)} className="flex flex-col gap-5">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-[#1A1A1A] mb-1">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setProfileSaved(false); }}
              placeholder="How you appear on the leaderboard"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">Email address</p>
            <p className="text-sm text-[#5A5A5A]">{profile.email}</p>
            <p className="text-xs text-[#9A9A9A] mt-1">
              To change your email, contact{" "}
              <a
                href="mailto:hello@tempo.style"
                className="underline hover:text-[#5A5A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
              >
                hello@tempo.style
              </a>
              .
            </p>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-[#1A1A1A] mb-1">Email preferences</legend>
            {(
              [
                { id: "email-marketing", label: "Marketing and new arrivals", value: marketing, onChange: (v: boolean) => { setMarketing(v); setProfileSaved(false); } },
                { id: "email-orders", label: "Order confirmations and updates", value: orderUpdates, onChange: (v: boolean) => { setOrderUpdates(v); setProfileSaved(false); } },
                { id: "email-points", label: "TempoPoints alerts", value: pointAlerts, onChange: (v: boolean) => { setPointAlerts(v); setProfileSaved(false); } },
              ] as const
            ).map(({ id, label, value, onChange }) => (
              <label key={id} className="flex items-center gap-3 cursor-pointer">
                <input
                  id={id}
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
                />
                <span className="text-sm text-[#1A1A1A]">{label}</span>
              </label>
            ))}
          </fieldset>

          <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl px-4 py-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="leaderboard-public"
                type="checkbox"
                checked={publicLeaderboard}
                onChange={(e) => { setPublicLeaderboard(e.target.checked); setProfileSaved(false); }}
                className="mt-0.5 rounded border-[#D4C9BA] text-[#C29E5F] focus-visible:ring-[#C29E5F]"
              />
              <span>
                <span className="block text-sm font-medium text-[#1A1A1A]">
                  Show me on the TempoPoints leaderboard
                </span>
                <span className="block text-xs text-[#5A5A5A] mt-0.5">
                  Your display name and tier will appear publicly. Your email and order history are never shown.
                </span>
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] text-sm font-medium hover:bg-[#2A2A2A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save settings"}
            </button>
            <p className="text-sm text-[#7A8B75]" role="status" aria-live="polite" aria-atomic="true">
              {profileSaved ? "Saved" : ""}
            </p>
            {profileError && (
              <p className="text-sm text-[#C4725A]" role="alert">{profileError}</p>
            )}
          </div>
        </form>
      </section>

      {/* Data export */}
      <section aria-labelledby="export-heading" className="border-t border-[#D4C9BA] pt-8">
        <h2 id="export-heading" className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-widest mb-3">
          Your data
        </h2>
        <p className="text-sm text-[#5A5A5A] mb-4">
          Download a copy of all your Tempo data: profile, points history, orders, and fit conversations.
        </p>
        <a
          href="/api/account/export"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#D4C9BA] text-[#1A1A1A] text-sm font-medium hover:bg-[#E8DFD2] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <Download size={14} aria-hidden="true" />
          Download my data (JSON)
        </a>
      </section>

      {/* Account deletion */}
      <section aria-labelledby="delete-heading" className="border-t border-[#D4C9BA] pt-8">
        <h2 id="delete-heading" className="text-xs font-semibold text-[#C4725A] uppercase tracking-widest mb-3">
          Delete account
        </h2>
        <p className="text-sm text-[#5A5A5A] mb-4">
          Your account will be soft-deleted. You have 30 days to restore it by signing in again. After 30 days, your data is permanently removed.
        </p>
        <div className="bg-[#FAFAF7] border border-[#C4725A]/30 rounded-xl px-4 py-4 flex flex-col gap-3">
          <label htmlFor="delete-confirm" className="block text-sm font-medium text-[#1A1A1A]">
            Type{" "}
            <code className="text-[#C4725A] bg-[#C4725A]/10 px-1 py-0.5 rounded text-xs">
              delete my account
            </code>{" "}
            to confirm
          </label>
          <input
            id="delete-confirm"
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="delete my account"
            className="w-full px-4 py-2.5 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4725A]"
            aria-describedby={deleteError ? "delete-error" : undefined}
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || deleteConfirm !== "delete my account"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C4725A] text-white text-sm font-medium hover:bg-[#a85a44] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4725A] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} aria-hidden="true" />
            {isDeleting ? "Deleting..." : "Delete my account"}
          </button>
          {deleteError && (
            <p id="delete-error" className="text-sm text-[#C4725A]" role="alert">{deleteError}</p>
          )}
        </div>
      </section>
    </div>
  );
}
