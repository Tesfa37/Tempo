// src/app/login/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Tempo",
  description: "Sign in to your Tempo account with a magic link. No password required.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Already signed in -- go to account (or the requested next page)
  if (user) {
    const { next } = await searchParams;
    const destination =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/account";
    redirect(destination);
  }

  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/account";

  return (
    <div className="min-h-screen bg-[#E8DFD2] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-2xl overflow-hidden">
          <div className="bg-[#1A1A1A] px-8 py-8 text-center">
            <h1 className="font-playfair text-2xl font-bold text-[#FAFAF7]">
              Sign in to Tempo
            </h1>
            <p className="text-[#9A9A9A] text-sm mt-2">
              No password required. We send you a magic link.
            </p>
          </div>
          <div className="px-8 py-8">
            <LoginForm next={safeNext} />
          </div>
        </div>
      </div>
    </div>
  );
}
