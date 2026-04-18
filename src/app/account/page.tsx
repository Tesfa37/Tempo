import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { AccountPageClient } from "@/components/account/AccountPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your account | Tempo",
};

export default async function AccountPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account");

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-8">
          Your profile
        </h1>
        <AccountPageClient profile={profile} />
      </div>
    </div>
  );
}
