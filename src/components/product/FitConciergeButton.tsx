"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function FitConciergeButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("/api/fit-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        setError("The Fit Concierge is temporarily unavailable. Please try again.");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("Unable to read response.");
        return;
      }

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setResponse(fullText);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      void handleAsk();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full py-3 px-6 rounded-lg bg-[#C29E5F] text-white font-medium text-sm hover:bg-[#a8874f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2"
      >
        Not sure about fit? Ask our Fit Concierge
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-8 pb-4 border-b border-[#D4C9BA]">
            <SheetTitle className="font-playfair text-xl text-[#1A1A1A]">
              AI Fit Concierge
            </SheetTitle>
            <SheetDescription className="text-[#5A5A5A] text-sm mt-1">
              Describe your situation and I will recommend from our catalog.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-6 flex flex-col gap-5">
            <div>
              <label
                htmlFor="fit-concierge-input"
                className="block text-sm font-medium text-[#1A1A1A] mb-2"
              >
                Tell me about your fit needs
              </label>
              <textarea
                id="fit-concierge-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={5}
                placeholder="For example: I use a wheelchair full-time, and I need trousers that do not bunch at the back. I dress independently."
                className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder-[#5A5A5A] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
              <p className="text-xs text-[#5A5A5A] mt-1">
                Press Ctrl + Enter to submit
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={!input.trim() || loading}
              className="py-3 px-6 rounded-lg bg-[#7A8B75] text-white font-medium text-sm hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Finding the right fit for you..." : "Ask Concierge"}
            </button>

            {/* Response area */}
            <div
              className="rounded-lg border border-[#D4C9BA] bg-[#E8DFD2]/50 px-4 py-4 min-h-[80px] flex items-center justify-center"
              aria-live="polite"
              aria-label="Concierge response"
            >
              {loading && !response && (
                <p className="text-sm text-[#5A5A5A] animate-pulse italic">
                  Finding the right fit for you...
                </p>
              )}
              {response && (
                <p className="text-sm text-[#5A5A5A] whitespace-pre-wrap w-full">{response}</p>
              )}
              {!loading && !response && !error && (
                <p className="text-sm text-[#5A5A5A] italic">
                  Your recommendation will appear here.
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-[#C4725A]" role="alert">
                {error}
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
