"use client";

import { useState } from "react";
import { AccountTypeSelector } from "./AccountTypeSelector";
import { IndividualOnboarding } from "./IndividualOnboarding";
import { CaregiverOnboarding } from "./CaregiverOnboarding";
import { AgencyOnboarding } from "./AgencyOnboarding";
import type { Profile, AccountType } from "@/lib/types/account";

export function AccountPageClient({ profile }: { profile: Profile }) {
  const [accountType, setAccountType] = useState<AccountType>(profile.account_type);

  return (
    <div className="flex flex-col gap-10">
      <AccountTypeSelector current={accountType} onChanged={setAccountType} />

      {accountType === "individual" && (
        <IndividualOnboarding initial={profile.fit_profile} />
      )}
      {accountType === "caregiver" && (
        <CaregiverOnboarding initial={profile.care_recipients} />
      )}
      {accountType === "agency" && (
        <AgencyOnboarding initial={profile.agency_settings} />
      )}
    </div>
  );
}
