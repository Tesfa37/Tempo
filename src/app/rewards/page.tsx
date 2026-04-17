import type { Metadata } from "next";
import { RewardsClient } from "@/components/rewards/RewardsClient";

export const metadata: Metadata = {
  title: "TempoPoints Rewards | Tempo",
  description:
    "Track your TempoPoints balance, tier progress, recent activity, and redeem rewards earned through sustainable actions.",
  alternates: {
    canonical: "/rewards",
  },
};

export default function RewardsPage() {
  return <RewardsClient />;
}
