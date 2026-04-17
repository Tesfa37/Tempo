"use client";

import { useState } from "react";

export function NotifyButton() {
  const [notified, setNotified] = useState(false);

  return (
    <div>
      {notified ? (
        <p
          role="status"
          className="text-sm text-[#7A8B75] font-medium py-3 px-4 rounded-lg bg-[#7A8B75]/10 border border-[#7A8B75]/20"
        >
          We will let you know when your size is ready.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setNotified(true)}
          className="w-full py-3.5 px-6 rounded-lg bg-[#1A1A1A] text-white font-medium text-sm hover:bg-[#2A2A2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2"
        >
          Notify me when available
        </button>
      )}
    </div>
  );
}
