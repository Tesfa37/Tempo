import { NextRequest } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import QRCode from "qrcode";
import React, { type ReactElement } from "react";
import { passports } from "@/data/passports";
import { PassportPDFDocument } from "@/components/passport/PassportPDFDocument";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  const passport = passports[sku];

  if (!passport) {
    return new Response(JSON.stringify({ error: "Passport not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const qrDataUri = await QRCode.toDataURL(
      `https://tempo.style/passport/${sku}`,
      { width: 180, margin: 1 }
    );

    const element = React.createElement(
      PassportPDFDocument,
      { passport, qrDataUri }
    ) as ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(element);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tempo-passport-${sku}.pdf"`,
        "Cache-Control": "no-store",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[passport-pdf] renderToBuffer failed:", error);
    return new Response(
      JSON.stringify({ error: "PDF generation failed. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
