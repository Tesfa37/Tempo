import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account";
import { CaregiverDashboardClient } from "@/components/account/CaregiverDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care recipients | Tempo",
};

export default async function CaregiverPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account/caregiver");

  if (profile.account_type === "individual") {
    redirect("/account");
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-2">
        Care recipients
      </h1>
      <p className="text-sm text-[#5A5A5A] mb-8">
        Manage recipient profiles, sizes, and quick reorder shortcuts.
      </p>
      <CaregiverDashboardClient initialRecipients={profile.care_recipients} />
    </div>
  );
}
