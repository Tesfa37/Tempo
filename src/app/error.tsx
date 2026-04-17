"use client";

import { useEffect } from "react";
import Link from "next/link";

function ErrorIllustration() {
  return (
    <svg
      aria-hidden="true"
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-8"
    >
      {/* Garment silhouette with a snag */}
      <path
        d="M70 30 L60 55 L40 60 L50 140 L150 140 L160 60 L140 55 L130 30 Q115 20 100 25 Q85 20 70 30Z"
        fill="#FAFAF7"
        stroke="#D4C9BA"
        strokeWidth="2"
      />
      {/* Collar */}
      <path
        d="M85 30 Q100 45 115 30"
        stroke="#D4C9BA"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Exclamation on garment */}
      <rect x="96" y="65" width="8" height="36" rx="4" fill="#C29E5F" />
      <circle cx="100" cy="114" r="5" fill="#C29E5F" />
      {/* Snag lines */}
      <path
        d="M50 90 Q42 85 48 78 Q54 71 46 64"
        stroke="#C29E5F"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
      />
    </svg>
  );
}

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Error already captured by Next.js error boundary; available for monitoring
    console.error(error);
  }, [error]);

  return (
    <div className="bg-[#E8DFD2] min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <ErrorIllustration />

        <p className="text-sm font-semibold uppercase tracking-widest text-[#C29E5F] mb-3">
          500
        </p>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
          Something went wrong at our end.
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed mb-10">
          We logged this and are looking into it. In the meantime, here&apos;s
          where you can go.
        </p>

        {/* Primary action */}
        <div className="mb-6">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C29E5F] text-[#1A1A1A] text-sm font-semibold hover:bg-[#b08d4f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8a6 6 0 1 1 1.5 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M2 12V8h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try again
          </button>
        </div>

        {/* Secondary CTAs */}
        <nav aria-label="Helpful links" className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#1A1A1A] text-[#1A1A1A] text-sm font-medium hover:bg-[#D4C9BA] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            Go home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D4C9BA] text-[#5A5A5A] text-sm font-medium hover:bg-[#D4C9BA] hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            Shop the collection
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D4C9BA] text-[#5A5A5A] text-sm font-medium hover:bg-[#D4C9BA] hover:text-[#1A1A1A] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8DFD2]"
          >
            Contact us
          </Link>
        </nav>

        {error.digest && (
          <p className="mt-8 text-xs text-[#9A9A9A]">
            Error reference: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}
