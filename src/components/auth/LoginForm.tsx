// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
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
      <div className="text-center py-4">
        <p className="font-playfair text-xl font-bold text-[#1A1A1A] mb-3">
          Check your email
        </p>
        <p className="text-[#5A5A5A] text-sm leading-relaxed">
          A sign-in link has been sent to{" "}
          <strong className="text-[#1A1A1A]">{email}</strong>. Click it to
          continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-[#1A1A1A] mb-2"
        >
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          aria-describedby={error ? "login-error" : undefined}
          aria-required="true"
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
        <p id="login-error" className="text-sm text-[#C4725A]" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-[#9A9A9A] text-center">
        New to Tempo? Signing in creates your account automatically.
      </p>
    </form>
  );
}
