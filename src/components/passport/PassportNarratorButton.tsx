"use client";

import { useState } from "react";

interface PassportNarratorButtonProps {
  sku: string;
}

export function PassportNarratorButton({ sku }: PassportNarratorButtonProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shown, setShown] = useState(false);

  const handleClick = async () => {
    if (summary) {
      setShown(!shown);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/passport-narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      const data = (await res.json()) as { summary?: string; error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Unable to generate summary.");
      } else {
        setSummary(data.summary ?? "");
        setShown(true);
      }
    } catch {
      setError("Unable to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => void handleClick()}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C29E5F] border border-[#C29E5F] px-4 py-2 rounded hover:bg-[#C29E5F]/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        aria-expanded={shown}
        aria-controls="passport-summary"
      >
        {loading
          ? "Generating plain-language summary..."
          : shown
          ? "Hide plain-language summary"
          : "Tell me about this passport in plain language"}
      </button>

      {shown && summary && (
        <div
          id="passport-summary"
          className="mt-4 p-4 bg-[#FAFAF7] border border-[#D4C9BA] rounded text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap"
          role="region"
          aria-label="Plain-language passport summary"
        >
          {summary}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-[#C4725A]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
