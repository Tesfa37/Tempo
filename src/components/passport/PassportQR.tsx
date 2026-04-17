"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface PassportQRProps {
  sku: string;
  productName: string;
}

const TEMPO_LOGO_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect width="32" height="32" rx="4" fill="#E8DFD2"/>' +
      '<text x="16" y="24" font-family="Georgia,serif" font-size="20" font-weight="700" fill="#1A1A1A" text-anchor="middle">T</text>' +
      "</svg>"
  );

const IMAGE_SETTINGS = {
  src: TEMPO_LOGO_SRC,
  height: 22,
  width: 22,
  excavate: true,
};

export function PassportQR({ sku, productName }: PassportQRProps) {
  const [origin, setOrigin] = useState(
    process.env.NEXT_PUBLIC_SITE_URL ?? ""
  );

  useEffect(() => {
    if (!origin) {
      setOrigin(window.location.origin);
    }
  }, [origin]);

  const passportUrl = `${origin}/passport/${sku}`;

  return (
    <div
      role="img"
      aria-label={`QR code linking to Digital Product Passport for ${productName}`}
      className="flex flex-col items-center"
    >
      <div className="sm:hidden">
        <QRCodeSVG
          value={passportUrl || `/passport/${sku}`}
          size={112}
          fgColor="#18181B"
          bgColor="#FAFAF9"
          level="M"
          imageSettings={IMAGE_SETTINGS}
        />
      </div>
      <div className="hidden sm:block">
        <QRCodeSVG
          value={passportUrl || `/passport/${sku}`}
          size={144}
          fgColor="#18181B"
          bgColor="#FAFAF9"
          level="M"
          imageSettings={IMAGE_SETTINGS}
        />
      </div>
      <p className="text-xs text-[#9A9A9A] mt-2">Scan to verify</p>
      <p className="text-xs font-mono text-[#9A9A9A] mt-0.5 break-all text-center max-w-[144px]">
        {passportUrl || `/passport/${sku}`}
      </p>
    </div>
  );
}
