"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface VoiceCommandHelpProps {
  open: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { say: "Show me tops", does: "Filters shop to Tops category" },
  { say: "Show me bottoms", does: "Filters shop to Bottoms" },
  { say: "Filter by wheelchair", does: "Shows wheelchair-designed garments" },
  { say: "Filter by arthritis", does: "Shows arthritis-friendly garments" },
  { say: "Go to passport", does: "Opens Digital Product Passport gallery" },
  { say: "Go to about", does: "Opens the About Tempo page" },
  { say: "Go to financial support", does: "Opens the Financial Support page" },
  { say: "Try on [product name]", does: "Opens AI Virtual Fitting for that product" },
  { say: "I need help with fit", does: "Opens AI Fit Concierge with your question" },
];

const BROWSER_SUPPORT = [
  { browser: "Chrome / Edge", support: "Full support" },
  { browser: "Safari 14.1+", support: "Full support" },
  { browser: "Firefox", support: "Not supported" },
];

export function VoiceCommandHelp({ open, onClose }: VoiceCommandHelpProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-help-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/60"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="relative bg-[#FAFAF7] rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D4C9BA]">
          <h2
            id="voice-help-title"
            className="font-playfair text-xl font-bold text-[#1A1A1A]"
          >
            Voice Commands
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close voice command help"
            className="p-2 rounded hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <X className="h-5 w-5 text-[#1A1A1A]" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Shortcut callout */}
          <div className="bg-[#C29E5F]/10 border border-[#C29E5F]/20 rounded-xl px-4 py-3 text-sm text-[#5A5A5A]">
            Press{" "}
            <kbd className="font-mono bg-[#E8DFD2] border border-[#D4C9BA] rounded px-1.5 py-0.5 text-xs text-[#1A1A1A]">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="font-mono bg-[#E8DFD2] border border-[#D4C9BA] rounded px-1.5 py-0.5 text-xs text-[#1A1A1A]">
              Space
            </kbd>{" "}
            to start or stop listening. Press{" "}
            <kbd className="font-mono bg-[#E8DFD2] border border-[#D4C9BA] rounded px-1.5 py-0.5 text-xs text-[#1A1A1A]">
              ?
            </kbd>{" "}
            to open this panel.
          </div>

          {/* Command list */}
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Example commands</p>
            <table className="w-full text-sm" aria-label="Voice commands and their effects">
              <thead>
                <tr className="text-left border-b border-[#D4C9BA]">
                  <th className="pb-2 font-medium text-[#5A5A5A] w-1/2">Say…</th>
                  <th className="pb-2 font-medium text-[#5A5A5A]">What happens</th>
                </tr>
              </thead>
              <tbody>
                {COMMANDS.map((cmd) => (
                  <tr key={cmd.say} className="border-b border-[#E8DFD2] last:border-0">
                    <td className="py-2.5 pr-4">
                      <span className="font-mono text-xs bg-[#E8DFD2] px-2 py-1 rounded text-[#1A1A1A]">
                        &ldquo;{cmd.say}&rdquo;
                      </span>
                    </td>
                    <td className="py-2.5 text-[#5A5A5A]">{cmd.does}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Browser support */}
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Browser support</p>
            <table className="w-full text-sm" aria-label="Browser support for voice commands">
              <thead>
                <tr className="text-left border-b border-[#D4C9BA]">
                  <th className="pb-2 font-medium text-[#5A5A5A]">Browser</th>
                  <th className="pb-2 font-medium text-[#5A5A5A]">Support</th>
                </tr>
              </thead>
              <tbody>
                {BROWSER_SUPPORT.map((row) => (
                  <tr key={row.browser} className="border-b border-[#E8DFD2] last:border-0">
                    <td className="py-2.5 pr-4 text-[#1A1A1A]">{row.browser}</td>
                    <td
                      className={`py-2.5 ${
                        row.support === "Not supported"
                          ? "text-[#C4725A]"
                          : "text-[#7A8B75]"
                      }`}
                    >
                      {row.support}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#5A5A5A]">
            Voice processing happens entirely in your browser. No audio is uploaded or stored.
          </p>
        </div>
      </div>
    </div>
  );
}
