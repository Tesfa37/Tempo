"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/data/products";
import { PrivacyModal } from "./PrivacyModal";
import { awardPoints } from "@/app/actions/points";
import { showEarnToast, showTierUpToast } from "@/components/points/EarnToast";
import { ARMirror, type ARMirrorHandle, type PoseStatus } from "./ARMirror";
import { ARControls } from "./ARControls";

type Stage =
  | "checking"
  | "unsupported"
  | "modal"
  | "requesting"
  | "active"
  | "denied";

interface TryOnClientProps {
  product: Product;
}

export function TryOnClient({ product }: TryOnClientProps) {
  const router = useRouter();
  const mirrorRef = useRef<ARMirrorHandle>(null);

  const [stage, setStage] = useState<Stage>("checking");
  const [wheelchairMode, setWheelchairMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [poseStatus, setPoseStatus] = useState<PoseStatus>("loading");
  const [announcement, setAnnouncement] = useState("");

  const garmentType: "top" | "bottom" =
    product.category === "bottoms" ? "bottom" : "top";

  const announce = useCallback((msg: string) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(msg));
  }, []);

  // Browser support check
  useEffect(() => {
    const hasCamera =
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia;
    const hasWebGL = (() => {
      try {
        return !!document.createElement("canvas").getContext("webgl");
      } catch {
        return false;
      }
    })();
    setStage(hasCamera && hasWebGL ? "modal" : "unsupported");
  }, []);

  // Request camera permission
  const handleProceed = useCallback(async () => {
    setStage("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setStage("active");
      awardPoints("ar_tryon_session", 75).then((result) => {
        if (result.success && !result.skipped) {
          showEarnToast(75, "AI virtual fitting session");
          if (result.tierChanged && result.tier) showTierUpToast(result.tier);
        }
      }).catch(() => null);
    } catch {
      setStage("denied");
    }
  }, []);

  // Capture to PNG
  const handleCapture = useCallback(async () => {
    const blob = await mirrorRef.current?.capture();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tempo-tryon-${product.sku}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    announce("Capture saved");
  }, [product.sku, announce]);

  // Share or clipboard
  const handleShare = useCallback(async () => {
    const blob = await mirrorRef.current?.capture();
    if (!blob) return;
    const file = new File([blob], "tempo-tryon.png", { type: "image/png" });
    if (
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: `Tempo ${product.name} Virtual Fitting`,
      });
    } else {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        announce("Image copied to clipboard");
      } catch {
        await handleCapture();
      }
    }
  }, [product.name, handleCapture, announce]);

  // Keyboard shortcuts
  useEffect(() => {
    if (stage !== "active") return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "w" || e.key === "W") {
        setWheelchairMode((prev) => {
          const next = !prev;
          announce(next ? "Wheelchair mode enabled" : "Wheelchair mode disabled");
          return next;
        });
      }
      if (e.key === "c" || e.key === "C") void handleCapture();
      if (e.key === "Escape") router.back();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, announce, handleCapture, router]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (stage === "checking") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#5A5A5A] text-sm">Checking browser support...</p>
      </div>
    );
  }

  if (stage === "unsupported") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[#1A1A1A] mb-2">
          AI Virtual Fitting is not supported in this browser.
        </p>
        <p className="text-[#5A5A5A] text-sm mb-6">
          Your browser does not support AI Virtual Fitting. Try the latest Chrome,
          Safari, or Firefox.
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="text-sm font-medium text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
        >
          Back to {product.name}
        </Link>
      </div>
    );
  }

  if (stage === "denied") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[#1A1A1A] mb-2">
          Camera access required
        </p>
        <p className="text-[#5A5A5A] text-sm mb-3">
          Enable camera to try on. You can update permissions in your browser
          settings and reload this page.
        </p>
        <div
          className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl p-6 mt-6 mx-auto max-w-xs"
          aria-label={`Static product image for ${product.name}`}
          role="img"
        >
          <div className="h-48 bg-gradient-to-br from-[#C29E5F] to-[#E8DFD2] rounded-lg mb-3" />
          <p className="text-sm font-semibold text-[#1A1A1A]">{product.name}</p>
          <p className="text-xs text-[#5A5A5A] mt-1">
            Enable camera to try on
          </p>
        </div>
        <Link
          href={`/shop/${product.slug}`}
          className="inline-block mt-6 text-sm font-medium text-[#7A8B75] underline underline-offset-4 hover:text-[#5a6b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
        >
          Back to {product.name}
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Privacy modal (stage: modal | requesting) */}
      {(stage === "modal" || stage === "requesting") && (
        <PrivacyModal
          onProceed={handleProceed}
          onCancel={() => router.back()}
        />
      )}

      {/* Screen reader live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Main layout */}
      <div className="bg-[#E8DFD2] min-h-screen">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link
            href={`/shop/${product.slug}`}
            aria-label={`Back to ${product.name}`}
            className="p-2 rounded hover:bg-[#D4C9BA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <ArrowLeft className="h-5 w-5 text-[#1A1A1A]" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="font-playfair text-xl font-bold text-[#1A1A1A] leading-tight">
              {product.name}
            </h1>
            <span className="text-xs bg-[#C29E5F]/20 text-[#C29E5F] border border-[#C29E5F]/40 px-2 py-0.5 rounded-full font-medium">
              AI Pilot, Beta
            </span>
          </div>
        </div>

        {stage === "active" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
              {/* Camera feed + overlay */}
              <div className="relative">
                <ARMirror
                  ref={mirrorRef}
                  garmentType={garmentType}
                  wheelchairMode={wheelchairMode}
                  brightness={brightness}
                  highContrast={highContrast}
                  onPoseStatusChange={setPoseStatus}
                />

                {/* Pose status caption */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-medium pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background:
                      poseStatus === "detected"
                        ? "rgba(122,139,117,0.85)"
                        : "rgba(26,26,26,0.70)",
                    color: "#FAFAF7",
                  }}
                >
                  {poseStatus === "loading"
                    ? "Loading pose model..."
                    : poseStatus === "detected"
                    ? "Tracking shoulders and hips"
                    : "Move into frame"}
                </div>
              </div>

              {/* Controls panel */}
              <ARControls
                wheelchairMode={wheelchairMode}
                onWheelchairModeChange={(val) => {
                  setWheelchairMode(val);
                  announce(
                    val ? "Wheelchair mode enabled" : "Wheelchair mode disabled"
                  );
                }}
                brightness={brightness}
                onBrightnessChange={setBrightness}
                highContrast={highContrast}
                onHighContrastChange={setHighContrast}
                onCapture={() => void handleCapture()}
                onShare={() => void handleShare()}
                onClose={() => router.back()}
              />
            </div>

            {/* Privacy note */}
            <p className="mt-6 text-xs text-[#5A5A5A] text-center">
              All processing is local to your device. No frames are uploaded or
              stored.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
