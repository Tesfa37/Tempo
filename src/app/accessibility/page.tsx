import type { Metadata } from "next";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildBreadcrumbList, buildAccessibilityPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Accessibility Statement, Tempo",
  description:
    "Tempo's commitment to WCAG 2.1 AA conformance, accessibility features, known limitations, and how to report accessibility barriers.",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureItem({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-1">
      <span className="font-semibold text-[#1A1A1A] text-sm">{heading}</span>
      <span className="text-sm text-[#5A5A5A] leading-relaxed">{children}</span>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccessibilityPage() {
  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="bg-[#FAFAF7] border-b border-[#D4C9BA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
            Accessibility Statement
          </h1>
          <p className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed">
            Tempo is committed to ensuring this website is accessible to all
            users, including disabled people, people using assistive
            technologies, and people with situational limitations. This
            statement covers tempo.style.
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">

        {/* WCAG Conformance */}
        <section aria-labelledby="wcag-heading">
          <h2
            id="wcag-heading"
            className="font-playfair text-2xl font-semibold text-[#1A1A1A] mb-4"
          >
            WCAG Conformance
          </h2>
          <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Badge */}
              <span className="shrink-0 inline-flex items-center gap-1.5 bg-[#7A8B75]/15 border border-[#7A8B75]/40 text-[#7A8B75] text-xs font-bold px-3 py-1.5 rounded-full">
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <circle cx="6" cy="6" r="5.5" stroke="#7A8B75" />
                  <path
                    d="M3 6l2 2 4-4"
                    stroke="#7A8B75"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                WCAG 2.1 AA
              </span>
              <p className="text-sm text-[#1A1A1A]">
                Tempo aims to conform to WCAG 2.1 Level AA.
              </p>
            </div>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              Compliance was evaluated against the Web Content Accessibility
              Guidelines (WCAG) version 2.1, published by the World Wide Web
              Consortium (W3C).
            </p>
          </div>
        </section>

        {/* Specific Features */}
        <section aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="font-playfair text-2xl font-semibold text-[#1A1A1A] mb-4"
          >
            Accessibility Features
          </h2>
          <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6">
            <ul className="flex flex-col gap-5" role="list">
              <FeatureItem heading="Keyboard navigation">
                Every interactive element on this site is reachable via
                keyboard Tab navigation. No mouse is required.
              </FeatureItem>

              <li className="border-t border-[#D4C9BA] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Screen reader support
                  </span>
                  <span className="text-sm text-[#5A5A5A] leading-relaxed">
                    Page structure uses semantic HTML landmarks (header, main,
                    nav, footer). All product images have descriptive alt text.
                    Dynamic content updates are announced via ARIA live regions.
                  </span>
                </div>
              </li>

              <li className="border-t border-[#D4C9BA] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Focus indicators
                  </span>
                  <span className="text-sm text-[#5A5A5A] leading-relaxed">
                    All interactive elements display a visible amber focus ring
                    (
                    <span className="font-mono text-[#C29E5F] text-xs bg-[#E8DFD2] px-1 rounded">
                      #C29E5F
                    </span>
                    , 2px offset) for keyboard users.
                  </span>
                </div>
              </li>

              <li className="border-t border-[#D4C9BA] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Color contrast
                  </span>
                  <span className="text-sm text-[#5A5A5A] leading-relaxed">
                    All text meets WCAG 2.1 AA minimum contrast ratios (4.5:1
                    for normal text, 3:1 for large text). The design avoids
                    conveying information through color alone.
                  </span>
                </div>
              </li>

              <li className="border-t border-[#D4C9BA] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Reduced motion
                  </span>
                  <span className="text-sm text-[#5A5A5A] leading-relaxed">
                    Tempo respects the{" "}
                    <span className="font-mono text-xs bg-[#E8DFD2] px-1 rounded text-[#1A1A1A]">
                      prefers-reduced-motion
                    </span>{" "}
                    media query. Animations and transitions are disabled for
                    users who have requested reduced motion in their system
                    preferences.
                  </span>
                </div>
              </li>

              <li className="border-t border-[#D4C9BA] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Captions and transcripts
                  </span>
                  <span className="text-sm text-[#5A5A5A] leading-relaxed">
                    All product videos include closed captions. Audio
                    descriptions are provided for visual-only content.
                  </span>
                </div>
              </li>

              <li className="border-t border-[#D4C9BA] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Responsive design
                  </span>
                  <span className="text-sm text-[#5A5A5A] leading-relaxed">
                    The site is fully functional at 320px width and above,
                    supporting browser zoom up to 400% without loss of
                    functionality.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Known Limitations */}
        <section aria-labelledby="limitations-heading">
          <h2
            id="limitations-heading"
            className="font-playfair text-2xl font-semibold text-[#1A1A1A] mb-4"
          >
            Known Limitations
          </h2>
          <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6">
            <ul className="flex flex-col gap-3" role="list">
              <li className="flex items-start gap-3 text-sm text-[#5A5A5A] leading-relaxed">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C4725A] shrink-0"
                  aria-hidden="true"
                />
                Product imagery uses decorative placeholder images during our
                pre-launch period. Real product photography with full alt-text
                descriptions will be added at launch.
              </li>
            </ul>
          </div>
        </section>

        {/* Feedback */}
        <section aria-labelledby="feedback-heading">
          <h2
            id="feedback-heading"
            className="font-playfair text-2xl font-semibold text-[#1A1A1A] mb-4"
          >
            Feedback
          </h2>
          <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4">
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              If you encounter an accessibility barrier or have a suggestion for
              improvement, we want to hear from you.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1A1A1A] shrink-0">
                  Email:
                </span>
                <a
                  href="mailto:accessibility@tempo.style"
                  className="text-sm text-[#C29E5F] underline underline-offset-2 hover:text-[#a8874f] focus-visible:outline-2 focus-visible:outline-[#C29E5F] rounded"
                >
                  accessibility@tempo.style
                </a>
              </div>
              <p className="text-sm text-[#5A5A5A]">
                We aim to respond within 2 business days.
              </p>
            </div>
          </div>
        </section>

        {/* Standards and Guidelines */}
        <section aria-labelledby="standards-heading">
          <h2
            id="standards-heading"
            className="font-playfair text-2xl font-semibold text-[#1A1A1A] mb-4"
          >
            Standards and Guidelines
          </h2>
          <div className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
              <span className="font-semibold text-[#1A1A1A] shrink-0">
                WCAG 2.1:
              </span>
              <a
                href="https://www.w3.org/TR/WCAG21/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C29E5F] underline underline-offset-2 break-all hover:text-[#a8874f] focus-visible:outline-2 focus-visible:outline-[#C29E5F] rounded"
              >
                https://www.w3.org/TR/WCAG21/
              </a>
            </div>
            <p className="text-xs text-[#5A5A5A] border-t border-[#D4C9BA] pt-3">
              This statement was prepared on April 16, 2026.
            </p>
          </div>
        </section>
      </div>

      <StructuredData
        data={buildBreadcrumbList([
          { name: "Home", url: "https://tempo.style" },
          { name: "Accessibility", url: "https://tempo.style/accessibility" },
        ])}
      />
      <StructuredData data={buildAccessibilityPageSchema()} />
    </div>
  );
}
