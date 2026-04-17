"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthPrompt() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-3">
          Check your email
        </p>
        <p className="text-[#5A5A5A] text-sm">
          A sign-in link has been sent to{" "}
          <strong className="text-[#1A1A1A]">{email}</strong>. Click it to
          access your rewards.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A] mb-2">
        TempoPoints
      </h1>
      <p className="text-[#5A5A5A] mb-8 text-sm leading-relaxed">
        Sign in to track your sustainability impact, earn points, and redeem rewards. We use
        magic links, no password required.
      </p>
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="auth-email"
            className="block text-sm font-medium text-[#1A1A1A] mb-2"
          >
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 rounded-lg bg-[#C29E5F] text-white font-medium text-sm hover:bg-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending link..." : "Send magic link"}
        </button>
        {error && (
          <p className="text-sm text-[#C4725A]" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
