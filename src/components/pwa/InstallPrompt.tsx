"use client";

import { useState, useEffect, useId } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "tempo-pwa-install-dismissed";

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const headingId = useId();

  useEffect(() => {
    // Don't show in standalone (already installed) or if previously dismissed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      sessionStorage.getItem(DISMISSED_KEY) === "1"
    ) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt || dismissed) return null;

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      dismiss();
    }
  }

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
    setPrompt(null);
  }

  return (
    <aside
      role="complementary"
      aria-labelledby={headingId}
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="max-w-lg mx-auto bg-[#1A1A1A] text-[#FAFAF7] rounded-xl shadow-2xl p-5 pointer-events-auto border border-[#2A2A2A]">
        <div className="flex items-start gap-4 mb-4">
          {/* Passport icon */}
          <div
            className="shrink-0 w-10 h-10 rounded-lg bg-[#C29E5F] flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="2" width="16" height="18" rx="2" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
              <path d="M7 7h8M7 11h8M7 15h5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p id={headingId} className="text-sm font-semibold text-[#FAFAF7] mb-1">
              Take Tempo offline
            </p>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Install Tempo to access your Digital Product Passports offline at
              any laundromat, hospital, or airport.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="shrink-0 text-[#5A5A5A] hover:text-[#FAFAF7] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 py-2.5 rounded-lg bg-[#C29E5F] text-[#1A1A1A] text-sm font-semibold hover:bg-[#b08d4f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
          >
            Install app
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="px-4 py-2.5 rounded-lg border border-[#3A3A3A] text-[#9A9A9A] text-sm hover:border-[#5A5A5A] hover:text-[#FAFAF7] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
