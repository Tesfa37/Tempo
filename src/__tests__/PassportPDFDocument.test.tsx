import { describe, it, expect } from "vitest";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PassportPDFDocument } from "@/components/passport/PassportPDFDocument";
import { passports } from "@/data/passports";

describe("PassportPDFDocument", () => {
  it("renders a non-empty PDF buffer for TMP-001", async () => {
    const passport = passports["TMP-001"];
    expect(passport).toBeDefined();
    const buffer = await renderToBuffer(
      React.createElement(PassportPDFDocument, {
        passport,
        qrDataUri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      })
    );
    expect(buffer.byteLength).toBeGreaterThan(100);
  }, 15000);

  it("renders without throwing for all 6 SKUs", async () => {
    const skus = ["TMP-001", "TMP-002", "TMP-003", "TMP-004", "TMP-005", "TMP-006"];
    for (const sku of skus) {
      const passport = passports[sku];
      expect(passport, `passport for ${sku} should exist`).toBeDefined();
      await expect(
        renderToBuffer(
          React.createElement(PassportPDFDocument, {
            passport,
            qrDataUri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          })
        )
      ).resolves.toBeDefined();
    }
  }, 60000);
});
