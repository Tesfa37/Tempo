import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { SettingsClient } from "@/components/account/SettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account settings | Tempo",
};

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account/settings");

  return (
    <div className="max-w-2xl">
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-8">
        Account settings
      </h1>
      <SettingsClient profile={profile} />
    </div>
  );
}
