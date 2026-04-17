"use client";

import { useEffect, useRef } from "react";

interface PrivacyModalProps {
  onProceed: () => void;
  onCancel: () => void;
}

export function PrivacyModal({ onProceed, onCancel }: PrivacyModalProps) {
  const proceedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    proceedRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/80 backdrop-blur-sm"
    >
      <div className="bg-[#FAFAF7] rounded-xl max-w-md w-full p-6 sm:p-8 shadow-xl">
        <h2
          id="privacy-modal-title"
          className="font-playfair text-xl font-bold text-[#1A1A1A] mb-4"
        >
          About your camera
        </h2>

        <ul className="text-[#5A5A5A] text-sm leading-relaxed space-y-2 mb-6 list-none">
          <li>Tempo AR runs entirely in your browser.</li>
          <li>No frames are uploaded, transmitted, or stored.</li>
          <li>Nothing about you leaves your device.</li>
          <li>
            You can revoke camera access at any time through your browser
            settings.
          </li>
        </ul>

        <div className="flex gap-3">
          <button
            ref={proceedRef}
            type="button"
            onClick={onProceed}
            className="flex-1 bg-[#7A8B75] text-[#FAFAF7] text-sm font-medium px-4 py-2.5 rounded hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2"
          >
            Proceed
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#E8DFD2] text-[#1A1A1A] text-sm font-medium px-4 py-2.5 rounded hover:bg-[#D4C9BA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
