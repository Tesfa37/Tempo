import Link from "next/link";
import { Trophy } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Community Leaderboard, TempoPoints",
};

export default async function LeaderboardPage() {
  const admin = createServiceClient();
  const { data: leaders } = await admin
    .from("profiles")
    .select("display_name, points")
    .eq("tier", "Architect")
    .eq("public_leaderboard", true)
    .order("points", { ascending: false })
    .limit(20);

  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-[#5A5A5A] mb-8">
          <Link href="/rewards" className="hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded">
            Rewards
          </Link>
          {" / "}
          <span className="text-[#1A1A1A]">Leaderboard</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-7 w-7 text-[#C4725A]" aria-hidden="true" />
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A]">
            Architect Leaderboard
          </h1>
        </div>

        <p className="text-sm text-[#5A5A5A] mb-8 leading-relaxed">
          Top 20 community members who have opted in to public recognition. Opt in from your rewards settings. Only display name and points are shown, never email.
        </p>

        {!leaders || leaders.length === 0 ? (
          <p className="text-sm text-[#5A5A5A] italic">
            No Architects have opted in yet. Be the first.
          </p>
        ) : (
          <ol className="flex flex-col gap-3" aria-label="Top 20 Architects by points">
            {leaders.map((leader, idx) => (
              <li
                key={`${leader.display_name}-${idx}`}
                className="flex items-center gap-4 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl px-5 py-4"
              >
                <span
                  className="text-lg font-bold tabular-nums text-[#C4725A] w-8 shrink-0"
                  aria-label={`Rank ${idx + 1}`}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-[#1A1A1A]">
                  {leader.display_name ?? "Anonymous"}
                </span>
                <span className="text-sm font-semibold text-[#C29E5F] tabular-nums">
                  {(leader.points ?? 0).toLocaleString()} pts
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
