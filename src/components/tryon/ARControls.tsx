"use client";

import { Accessibility, Sun, Camera, Share2, X, SunMoon } from "lucide-react";

interface ARControlsProps {
  wheelchairMode: boolean;
  onWheelchairModeChange: (value: boolean) => void;
  brightness: number;
  onBrightnessChange: (value: number) => void;
  highContrast: boolean;
  onHighContrastChange: (value: boolean) => void;
  onCapture: () => void;
  onShare: () => void;
  onClose: () => void;
}

export function ARControls({
  wheelchairMode,
  onWheelchairModeChange,
  brightness,
  onBrightnessChange,
  highContrast,
  onHighContrastChange,
  onCapture,
  onShare,
  onClose,
}: ARControlsProps) {
  return (
    <div
      role="region"
      aria-label="AI Virtual Fitting controls"
      className="bg-[#1A1A1A]/95 rounded-xl p-4 flex flex-col gap-4"
    >
      {/* Wheelchair mode toggle */}
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="wheelchair-toggle"
          className="flex items-center gap-2 text-sm text-[#FAFAF7] font-medium cursor-pointer select-none"
        >
          <Accessibility
            className="h-4 w-4 text-[#C29E5F] shrink-0"
            aria-hidden="true"
          />
          Wheelchair Mode
          <span className="text-xs text-[#9A9A9A]">(W)</span>
        </label>
        <button
          id="wheelchair-toggle"
          type="button"
          role="switch"
          aria-checked={wheelchairMode}
          onClick={() => onWheelchairModeChange(!wheelchairMode)}
          className={`relative w-11 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] shrink-0 ${
            wheelchairMode ? "bg-[#C29E5F]" : "bg-[#5A5A5A]"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              wheelchairMode ? "translate-x-5" : "translate-x-1"
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Brightness slider */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="brightness-slider"
          className="flex items-center gap-2 text-sm text-[#FAFAF7] font-medium"
        >
          <Sun className="h-4 w-4 text-[#C29E5F] shrink-0" aria-hidden="true" />
          Lighting
        </label>
        <input
          id="brightness-slider"
          type="range"
          min={60}
          max={150}
          value={brightness}
          onChange={(e) => onBrightnessChange(Number(e.target.value))}
          aria-valuemin={60}
          aria-valuemax={150}
          aria-valuenow={brightness}
          aria-label={`Brightness ${brightness} percent`}
          className="w-full h-2 rounded accent-[#C29E5F] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
        />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCapture}
          aria-label="Capture still image (keyboard shortcut C)"
          className="flex items-center justify-center gap-1.5 bg-[#7A8B75] text-[#FAFAF7] text-xs font-medium px-3 py-2.5 rounded hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
          Capture (C)
        </button>

        <button
          type="button"
          onClick={onShare}
          aria-label="Share or copy image"
          className="flex items-center justify-center gap-1.5 bg-[#5A5A5A] text-[#FAFAF7] text-xs font-medium px-3 py-2.5 rounded hover:bg-[#4A4A4A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Share
        </button>

        <button
          type="button"
          onClick={() => onHighContrastChange(!highContrast)}
          aria-pressed={highContrast}
          aria-label={`High contrast overlay — ${highContrast ? "on" : "off"}`}
          className={`flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
            highContrast
              ? "bg-[#FAFAF7] text-[#1A1A1A]"
              : "bg-[#5A5A5A] text-[#FAFAF7] hover:bg-[#4A4A4A]"
          }`}
        >
          <SunMoon className="h-4 w-4 shrink-0" aria-hidden="true" />
          Contrast
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Virtual Fitting (Escape)"
          className="flex items-center justify-center gap-1.5 bg-[#C4725A]/80 text-[#FAFAF7] text-xs font-medium px-3 py-2.5 rounded hover:bg-[#C4725A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <X className="h-4 w-4 shrink-0" aria-hidden="true" />
          Close (Esc)
        </button>
      </div>
    </div>
  );
}
