import { describe, it, expect } from "vitest";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { PassportPDFDocument } from "@/components/passport/PassportPDFDocument";
import { passports } from "@/data/passports";

const QR_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

describe("PassportPDFDocument", () => {
  it("renders a non-empty PDF buffer for TMP-001", async () => {
    const passport = passports["TMP-001"]!;
    expect(passport).toBeDefined();
    const el = React.createElement(PassportPDFDocument, {
      passport,
      qrDataUri: QR_DATA_URI,
    }) as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(el);
    expect(buffer.byteLength).toBeGreaterThan(100);
  }, 15000);

  it("renders without throwing for all 6 SKUs", async () => {
    const skus = ["TMP-001", "TMP-002", "TMP-003", "TMP-004", "TMP-005", "TMP-006"];
    for (const sku of skus) {
      const passport = passports[sku]!;
      expect(passport, `passport for ${sku} should exist`).toBeDefined();
      const el = React.createElement(PassportPDFDocument, {
        passport,
        qrDataUri: QR_DATA_URI,
      }) as ReactElement<DocumentProps>;
      await expect(renderToBuffer(el)).resolves.toBeDefined();
    }
  }, 60000);
});
