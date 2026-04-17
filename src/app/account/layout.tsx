import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  return (
    <div className="min-h-screen bg-[#E8DFD2]">
      <nav
        aria-label="Account navigation"
        className="bg-[#FAFAF7] border-b border-[#D4C9BA]"
      >
        <div className="max-w-5xl mx-auto px-4 flex gap-6 py-3 text-sm overflow-x-auto">
          <Link
            href="/account"
            className="text-[#1A1A1A] font-medium whitespace-nowrap hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Profile
          </Link>
          <Link
            href="/account/caregiver"
            className="text-[#5A5A5A] whitespace-nowrap hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Care recipients
          </Link>
          <Link
            href="/account/settings"
            className="text-[#5A5A5A] whitespace-nowrap hover:text-[#C29E5F] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Settings
          </Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
}
