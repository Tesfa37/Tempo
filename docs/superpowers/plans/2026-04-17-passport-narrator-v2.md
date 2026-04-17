# Passport Narrator v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the AI Passport Narrator to stream token-by-token, add four suggestion chips, voice read-aloud controls, and a server-generated two-page PDF download for caregiver handoff.

**Architecture:** The narrator API route is rewritten to stream via `anthropic.messages.stream()` (same pattern as `/api/fit-concierge`) and now correctly handles follow-up questions by including the `question` field in the user message. A new GET route `/api/passport-pdf/[sku]` generates a PDF server-side using `@react-pdf/renderer` and returns `application/pdf`. `PassportNarratorButton.tsx` is rewritten to consume the stream with a `ReadableStream` reader loop, display suggestion chips on completion, provide voice output via the Web Speech Synthesis API, and link to the PDF route via a plain `<a download>` element.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, `@anthropic-ai/sdk` streaming, `@react-pdf/renderer`, `qrcode` (Node-side QR PNG generation), Web Speech Synthesis API (browser-only, guarded), Vitest + Testing Library for tests.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/app/api/passport-narrator/route.ts` | Streaming + follow-up fix + system prompt additions |
| Create | `src/app/api/passport-pdf/[sku]/route.ts` | Server-side PDF generation endpoint |
| Create | `src/components/passport/PassportPDFDocument.tsx` | Pure `@react-pdf/renderer` 2-page layout |
| Modify | `src/components/passport/PassportNarratorButton.tsx` | Streaming UI, chips, voice controls, PDF link |
| Create | `src/__tests__/passport-narrator.route.test.ts` | API validation tests |
| Create | `src/__tests__/passport-pdf.route.test.ts` | PDF API 404 test |
| Create | `src/__tests__/PassportPDFDocument.test.tsx` | Render-without-crash test |
| Create | `src/__tests__/PassportNarratorButton.test.tsx` | Chips visibility + click behavior |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install runtime and dev packages**

```bash
cd "C:/Users/Tesfa/OneDrive/Desktop/Tempo"
pnpm add @react-pdf/renderer qrcode
pnpm add -D @types/qrcode
```

Expected output: packages added without errors, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Verify TypeScript resolves the new types**

```bash
pnpm typecheck
```

Expected: passes (or only pre-existing errors — zero new errors from the new packages).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @react-pdf/renderer, qrcode, @types/qrcode"
```

---

## Task 2: Overhaul narrator API route

**Files:**
- Modify: `src/app/api/passport-narrator/route.ts`
- Create: `src/__tests__/passport-narrator.route.test.ts`

- [ ] **Step 1: Write the failing validation tests**

Create `src/__tests__/passport-narrator.route.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/passport-narrator/route";
import { NextRequest } from "next/server";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/passport-narrator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/passport-narrator", () => {
  it("returns 400 when sku is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string };
    expect(data.error).toBe("SKU is required");
  });

  it("returns 400 when sku is not a string", async () => {
    const res = await POST(makeRequest({ sku: 42 }));
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string };
    expect(data.error).toBe("SKU is required");
  });

  it("returns 404 for an unknown sku", async () => {
    const res = await POST(makeRequest({ sku: "TMP-999" }));
    expect(res.status).toBe(404);
    const data = (await res.json()) as { error: string };
    expect(data.error).toBe("Product not found");
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test -- passport-narrator.route
```

Expected: all 3 tests FAIL (function not yet updated).

- [ ] **Step 3: Rewrite the narrator route**

Replace the entire contents of `src/app/api/passport-narrator/route.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { passports } from "@/data/passports";
import { products } from "@/data/products";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You translate Digital Product Passport data into plain-language summaries for Tempo customers.

Rules:
- Write for someone who needs to know: what it is made of, where it came from, whether it is safe for their care needs, and how to wash it
- Lead with the most actionable information for a disabled customer or caregiver
- Mention sterilization compatibility prominently if the product is sterilization-safe
- Explain certifications in plain language. GOTS = Global Organic Textile Standard, covers fiber origin and labor conditions. Fair Trade = ethical labor and fair wages certification.
- Ground carbon footprint numbers in familiar references: 2.5 kg CO2e equals approximately driving a car for 10 miles.
- Mention the Take-Back program when discussing end-of-life options.
- Never say "environmentally friendly". Use "lower-impact" and quantify the claim.
- Keep summaries under 200 words
- Use plain language with no jargon unless immediately explained
- Do not start with "This garment" when summarizing, vary your opening`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { sku?: unknown; question?: unknown };
    const { sku, question } = body;

    if (!sku || typeof sku !== "string") {
      return new Response(JSON.stringify({ error: "SKU is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const passport = passports[sku];
    const product = products.find((p) => p.sku === sku);

    if (!passport || !product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const passportContext = JSON.stringify(
      {
        productName: passport.productName,
        sku: passport.sku,
        gtin: passport.gtin,
        materialComposition: passport.materialComposition,
        recycledContent: passport.recycledContent,
        countryOfOrigin: passport.countryOfOrigin,
        manufacturingFacility: passport.manufacturingFacility,
        supplyChain: passport.supplyChain,
        certifications: passport.certifications,
        carbonFootprint: passport.carbonFootprint,
        waterUsageLiters: passport.waterUsageLiters,
        careInstructions: passport.careInstructions,
        sterilizationCompatible: passport.sterilizationCompatible,
        sterilizationProtocol: passport.sterilizationProtocol,
        recyclabilityScore: passport.recyclabilityScore,
        endOfLifeInstructions: passport.endOfLifeInstructions,
        takeBackProgram: passport.takeBackProgram,
      },
      null,
      2
    );

    const userMessage =
      typeof question === "string" && question.trim()
        ? `Given this Digital Product Passport for the ${product.name}:\n\n${passportContext}\n\nAnswer this question in plain language: ${question.trim()}`
        : `Summarize this Digital Product Passport for the ${product.name}:\n\n${passportContext}`;

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Narrator is temporarily unavailable." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test -- passport-narrator.route
```

Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/passport-narrator/route.ts src/__tests__/passport-narrator.route.test.ts
git commit -m "feat: stream narrator API, fix follow-up bug, expand system prompt"
```

---

## Task 3: Create PassportPDFDocument component

**Files:**
- Create: `src/components/passport/PassportPDFDocument.tsx`
- Create: `src/__tests__/PassportPDFDocument.test.tsx`

- [ ] **Step 1: Write the failing render test**

Create `src/__tests__/PassportPDFDocument.test.tsx`:

```typescript
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test -- PassportPDFDocument
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the PDF document component**

Create `src/components/passport/PassportPDFDocument.tsx`:

```tsx
import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { DigitalProductPassport } from "@/data/passports";

const CERT_EXPLANATIONS: Record<string, string> = {
  GOTS: "Global Organic Textile Standard — certifies organic fiber origin and ethical labor conditions throughout the supply chain.",
  "Fair Trade": "Ethical labor certification — guarantees fair wages and safe working conditions for all workers.",
  "OEKO-TEX": "Tests for harmful substances — no chemicals that could harm wearers or the environment.",
  bluesign: "Sustainable chemical and water use in the manufacturing process.",
};

function co2Miles(kg: number): string {
  const miles = Math.round((kg / 2.5) * 10);
  return `approx. ${miles} miles driving`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const s = StyleSheet.create({
  page: {
    backgroundColor: "#FAFAF7",
    paddingHorizontal: 40,
    paddingTop: 0,
    paddingBottom: 40,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: -40,
    paddingHorizontal: 40,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerWordmark: { color: "#FAFAF7", fontSize: 16, fontFamily: "Helvetica-Bold" },
  headerSub: { color: "#C29E5F", fontSize: 9, marginTop: 2 },
  skuBadge: {
    backgroundColor: "#C29E5F",
    color: "#1A1A1A",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  topRow: { flexDirection: "row", gap: 16, marginBottom: 18 },
  identityBlock: { flex: 1 },
  productName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A1A",
    marginBottom: 3,
  },
  gtin: { fontSize: 10, color: "#C29E5F", fontFamily: "Helvetica-Bold", marginBottom: 3 },
  meta: { fontSize: 9, color: "#5A5A5A", marginBottom: 2 },
  qrBlock: { alignItems: "center" },
  qrCaption: { fontSize: 7, color: "#5A5A5A", marginTop: 3 },
  sectionBox: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A1A",
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#D4C9BA",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#D4C9BA",
    paddingBottom: 4,
    marginBottom: 3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8DFD2",
    paddingVertical: 4,
  },
  colFiber: { flex: 3, fontSize: 10, color: "#1A1A1A" },
  colPct: { flex: 1, fontSize: 10, color: "#C29E5F", fontFamily: "Helvetica-Bold" },
  colCert: { flex: 2, fontSize: 9, color: "#7A8B75" },
  colHdr: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#5A5A5A" },
  certBox: {
    backgroundColor: "#E8DFD2",
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  certName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  certDetail: { fontSize: 9, color: "#5A5A5A" },
  carbonRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8DFD2",
    paddingVertical: 4,
  },
  carbonLabel: { flex: 2, fontSize: 10, color: "#5A5A5A" },
  carbonValue: { flex: 2, fontSize: 10, color: "#1A1A1A", fontFamily: "Helvetica-Bold" },
  carbonEquiv: { flex: 3, fontSize: 9, color: "#7A8B75", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E8DFD2",
    padding: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  totalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1A1A1A" },
  totalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#C29E5F" },
  footnote: { fontSize: 8, color: "#5A5A5A", marginTop: 5 },
  bullet: { fontSize: 10, color: "#1A1A1A", marginBottom: 3 },
  sterilYes: {
    backgroundColor: "#7A8B75",
    color: "white",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  sterilNo: {
    backgroundColor: "#D4C9BA",
    color: "#5A5A5A",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  protocol: { fontSize: 10, color: "#1A1A1A", marginBottom: 4 },
  washCycles: { fontSize: 9, color: "#5A5A5A" },
  eolText: { fontSize: 10, color: "#1A1A1A", marginBottom: 6 },
  recyclability: { fontSize: 10, color: "#5A5A5A", marginBottom: 6 },
  takeBackBox: {
    backgroundColor: "#7A8B75",
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  takeBackText: { fontSize: 10, color: "white", fontFamily: "Helvetica-Bold" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: "#9A9A9A" },
});

interface Props {
  passport: DigitalProductPassport;
  qrDataUri: string;
}

function PageHeader({ sku }: { sku: string }) {
  return (
    <View style={s.header} fixed>
      <View>
        <Text style={s.headerWordmark}>Tempo</Text>
        <Text style={s.headerSub}>Digital Product Passport</Text>
      </View>
      <Text style={s.skuBadge}>{sku}</Text>
    </View>
  );
}

function PageFooter({ generatedDate }: { generatedDate: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        Generated by Tempo on {generatedDate}. For caregiver handoff.
      </Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

export function PassportPDFDocument({ passport, qrDataUri }: Props) {
  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={`Tempo Passport - ${passport.productName}`}>
      {/* ── Page 1: Identity, Materials, Certifications ── */}
      <Page size="A4" style={s.page}>
        <PageHeader sku={passport.sku} />

        {/* Identity + QR */}
        <View style={s.topRow}>
          <View style={s.identityBlock}>
            <Text style={s.productName}>{passport.productName}</Text>
            <Text style={s.gtin}>GTIN: {passport.gtin}</Text>
            <Text style={s.meta}>Model: {passport.modelNumber}</Text>
            <Text style={s.meta}>Issued: {formatDate(passport.issueDate)}</Text>
            <Text style={s.meta}>Updated: {formatDate(passport.lastUpdated)}</Text>
            <Text style={s.meta}>Version: v{passport.passportVersion}</Text>
          </View>
          <View style={s.qrBlock}>
            <Image src={qrDataUri} style={{ width: 88, height: 88 }} />
            <Text style={s.qrCaption}>tempo.style/passport/{passport.sku}</Text>
          </View>
        </View>

        {/* Materials */}
        <View style={s.sectionBox}>
          <Text style={s.sectionTitle}>Materials</Text>
          <View style={s.tableHeader}>
            <Text style={[s.colFiber, s.colHdr]}>Fiber</Text>
            <Text style={[s.colPct, s.colHdr, { color: "#5A5A5A" }]}>%</Text>
            <Text style={[s.colCert, s.colHdr, { color: "#5A5A5A" }]}>Certified</Text>
          </View>
          {passport.materialComposition.map((mat, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={s.colFiber}>{mat.fiber}</Text>
              <Text style={s.colPct}>{mat.percentage}%</Text>
              <Text style={s.colCert}>
                {mat.certified
                  ? `Yes${mat.certificationBody ? ` (${mat.certificationBody})` : ""}`
                  : "No"}
              </Text>
            </View>
          ))}
        </View>

        {/* Certifications */}
        <View style={s.sectionBox}>
          <Text style={s.sectionTitle}>Certifications</Text>
          {passport.certifications.map((cert, i) => {
            const explanation =
              CERT_EXPLANATIONS[cert.name] ?? cert.certificationBody;
            return (
              <View key={i} style={s.certBox}>
                <Text style={s.certName}>{cert.name}</Text>
                <Text style={s.certDetail}>{explanation}</Text>
                <Text style={[s.certDetail, { marginTop: 2 }]}>
                  Certificate: {cert.certificateNumber} — Valid until:{" "}
                  {formatDate(cert.validUntil)}
                </Text>
              </View>
            );
          })}
        </View>

        <PageFooter generatedDate={generatedDate} />
      </Page>

      {/* ── Page 2: Carbon, Care, End of Life ── */}
      <Page size="A4" style={s.page}>
        <PageHeader sku={passport.sku} />

        {/* Carbon Footprint */}
        <View style={s.sectionBox}>
          <Text style={s.sectionTitle}>Carbon Footprint</Text>
          {(
            [
              { label: "Raw Material", value: passport.carbonFootprint.rawMaterial },
              { label: "Manufacturing", value: passport.carbonFootprint.manufacturing },
              { label: "Transport", value: passport.carbonFootprint.transport },
              { label: "End of Life", value: passport.carbonFootprint.endOfLife },
            ] as const
          ).map(({ label, value }) => (
            <View key={label} style={s.carbonRow}>
              <Text style={s.carbonLabel}>{label}</Text>
              <Text style={s.carbonValue}>{value} kg CO2e</Text>
              <Text style={s.carbonEquiv}>{co2Miles(value)}</Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>{passport.carbonFootprint.total} kg CO2e</Text>
          </View>
          <Text style={s.footnote}>
            2.5 kg CO2e is approximately equal to driving a car 10 miles.
          </Text>
        </View>

        {/* Care & Sterilization */}
        <View style={s.sectionBox}>
          <Text style={s.sectionTitle}>Care & Sterilization</Text>
          {passport.careInstructions.map((instr, i) => (
            <Text key={i} style={s.bullet}>
              • {instr}
            </Text>
          ))}
          <Text
            style={passport.sterilizationCompatible ? s.sterilYes : s.sterilNo}
          >
            {passport.sterilizationCompatible
              ? "Sterilization-safe: YES"
              : "Sterilization-safe: NO"}
          </Text>
          <Text style={s.protocol}>{passport.sterilizationProtocol}</Text>
          <Text style={s.washCycles}>
            Maximum wash cycles: {passport.maximumWashCycles}
          </Text>
        </View>

        {/* End of Life */}
        <View style={s.sectionBox}>
          <Text style={s.sectionTitle}>End of Life</Text>
          <Text style={s.eolText}>{passport.endOfLifeInstructions}</Text>
          <Text style={s.recyclability}>
            Recyclability score: {passport.recyclabilityScore}/100
          </Text>
          {passport.takeBackProgram && (
            <View style={s.takeBackBox}>
              <Text style={s.takeBackText}>
                Take-Back Program: Return this garment to Tempo for responsible
                end-of-life processing.
              </Text>
            </View>
          )}
        </View>

        <PageFooter generatedDate={generatedDate} />
      </Page>
    </Document>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test -- PassportPDFDocument
```

Expected: 2 tests PASS. Note: these tests invoke the real renderer — they may take 10-15 seconds.

- [ ] **Step 5: Commit**

```bash
git add src/components/passport/PassportPDFDocument.tsx src/__tests__/PassportPDFDocument.test.tsx
git commit -m "feat: add PassportPDFDocument two-page A4 renderer component"
```

---

## Task 4: Create PDF API route

**Files:**
- Create: `src/app/api/passport-pdf/[sku]/route.ts`
- Create: `src/__tests__/passport-pdf.route.test.ts`

- [ ] **Step 1: Write the failing 404 test**

Create `src/__tests__/passport-pdf.route.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/passport-pdf/[sku]/route";
import { NextRequest } from "next/server";

describe("GET /api/passport-pdf/[sku]", () => {
  it("returns 404 for an unknown sku", async () => {
    const req = new NextRequest("http://localhost/api/passport-pdf/TMP-999");
    const res = await GET(req, {
      params: Promise.resolve({ sku: "TMP-999" }),
    });
    expect(res.status).toBe(404);
    const data = (await res.json()) as { error: string };
    expect(data.error).toBe("Passport not found");
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test -- passport-pdf.route
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the PDF route**

Create `src/app/api/passport-pdf/[sku]/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import React from "react";
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

    const buffer = await renderToBuffer(
      React.createElement(PassportPDFDocument, { passport, qrDataUri })
    );

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tempo-passport-${sku}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "PDF generation failed. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
pnpm test -- passport-pdf.route
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/passport-pdf/ src/__tests__/passport-pdf.route.test.ts
git commit -m "feat: add /api/passport-pdf/[sku] server-side PDF generation route"
```

---

## Task 5: Overhaul PassportNarratorButton

**Files:**
- Modify: `src/components/passport/PassportNarratorButton.tsx`
- Create: `src/__tests__/PassportNarratorButton.test.tsx`

- [ ] **Step 1: Write the failing component tests**

Create `src/__tests__/PassportNarratorButton.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PassportNarratorButton } from "@/components/passport/PassportNarratorButton";

vi.mock("@/hooks/useSpeechRecognition", () => ({
  useSpeechRecognition: () => ({
    state: "idle",
    supported: false,
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

function makeStreamFetch(text: string) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  let consumed = false;
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    body: {
      getReader: () => ({
        read: vi.fn(() => {
          if (!consumed) {
            consumed = true;
            return Promise.resolve({ done: false, value: encoded });
          }
          return Promise.resolve({ done: true, value: undefined });
        }),
      }),
    },
  });
}

describe("PassportNarratorButton", () => {
  beforeEach(() => vi.clearAllMocks());

  it("chips are not visible before summary loads", () => {
    render(<PassportNarratorButton sku="TMP-001" />);
    expect(
      screen.queryByText("What does GOTS certification guarantee?")
    ).not.toBeInTheDocument();
  });

  it("chips are visible after summary streams in", async () => {
    vi.stubGlobal("fetch", makeStreamFetch("Safe for hospital laundry at 60C."));
    render(<PassportNarratorButton sku="TMP-001" />);
    fireEvent.click(
      screen.getByRole("button", { name: /plain language/i })
    );
    await waitFor(() => {
      expect(
        screen.getByText("What does GOTS certification guarantee?")
      ).toBeInTheDocument();
    });
  });

  it("clicking a chip fires a follow-up fetch with the chip text as question", async () => {
    const fetchMock = makeStreamFetch("Organic cotton standard.");
    vi.stubGlobal("fetch", fetchMock);
    render(<PassportNarratorButton sku="TMP-001" />);

    // Load initial summary
    fireEvent.click(screen.getByRole("button", { name: /plain language/i }));
    await waitFor(() =>
      expect(
        screen.getByText("What does GOTS certification guarantee?")
      ).toBeInTheDocument()
    );

    // Click chip — expect a second fetch call with the question field
    fireEvent.click(
      screen.getByText("What does GOTS certification guarantee?")
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const secondCall = fetchMock.mock.calls[1] as [string, RequestInit];
    const body = JSON.parse(secondCall[1].body as string) as {
      sku: string;
      question: string;
    };
    expect(body.sku).toBe("TMP-001");
    expect(body.question).toBe("What does GOTS certification guarantee?");
  });

  it("PDF download link points to the correct API route", async () => {
    vi.stubGlobal("fetch", makeStreamFetch("Summary text."));
    render(<PassportNarratorButton sku="TMP-002" />);
    fireEvent.click(screen.getByRole("button", { name: /plain language/i }));
    await waitFor(() =>
      expect(
        screen.getByText("What does GOTS certification guarantee?")
      ).toBeInTheDocument()
    );
    const link = screen.getByRole("link", { name: /download passport pdf/i });
    expect(link).toHaveAttribute("href", "/api/passport-pdf/TMP-002");
    expect(link).toHaveAttribute("download", "tempo-passport-TMP-002.pdf");
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test -- PassportNarratorButton
```

Expected: tests FAIL (component does not yet have chips or PDF link).

- [ ] **Step 3: Rewrite the component**

Replace the entire contents of `src/components/passport/PassportNarratorButton.tsx`:

```tsx
"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Volume2, Pause, Square, FileDown } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

const SUGGESTION_CHIPS = [
  "What does GOTS certification guarantee?",
  "Why Portugal?",
  "Is this compatible with hospital laundry?",
  "How does the Take-Back program work?",
] as const;

type VoiceState = "idle" | "speaking" | "paused";

interface PassportNarratorButtonProps {
  sku: string;
}

async function readStream(
  res: Response,
  onChunk: (text: string) => void
): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("Unable to read response.");
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

export function PassportNarratorButton({ sku }: PassportNarratorButtonProps) {
  const [summary, setSummary] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [shown, setShown] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [followUpStreaming, setFollowUpStreaming] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const hasSpeech =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const {
    state: micState,
    supported: micSupported,
    start: micStart,
    stop: micStop,
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setFollowUp(text);
      if (isFinal) micStop();
    },
  });

  const handleClick = async () => {
    if (summary) {
      setShown((s) => !s);
      return;
    }
    setStreaming(true);
    setError("");
    setShown(true);
    try {
      const res = await fetch("/api/passport-narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to generate summary.");
      }
      await readStream(res, (chunk) =>
        setSummary((prev) => prev + chunk)
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to generate summary. Please try again."
      );
    } finally {
      setStreaming(false);
    }
  };

  async function handleFollowUpWithText(question: string) {
    if (!question.trim()) return;
    setFollowUpStreaming(true);
    setFollowUpResponse("");
    try {
      const res = await fetch("/api/passport-narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, question }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to answer that question.");
      }
      await readStream(res, (chunk) =>
        setFollowUpResponse((prev) => prev + chunk)
      );
    } catch (e) {
      setFollowUpResponse(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setFollowUpStreaming(false);
    }
  }

  function handleFollowUp() {
    void handleFollowUpWithText(followUp);
  }

  function handleChipClick(text: string) {
    setFollowUp(text);
    void handleFollowUpWithText(text);
  }

  function getPreferredVoice(): SpeechSynthesisVoice | null {
    const voices = speechSynthesis.getVoices();
    return (
      voices.find(
        (v) => v.name.includes("Natural") && v.lang.startsWith("en")
      ) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null
    );
  }

  function handleReadAloud() {
    if (!hasSpeech) return;
    if (voiceState === "speaking") {
      speechSynthesis.pause();
      setVoiceState("paused");
      return;
    }
    if (voiceState === "paused") {
      speechSynthesis.resume();
      setVoiceState("speaking");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(summary);
    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => setVoiceState("idle");
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setVoiceState("speaking");
  }

  function handleStopVoice() {
    if (!hasSpeech) return;
    speechSynthesis.cancel();
    setVoiceState("idle");
  }

  const summaryReady = shown && !!summary && !streaming;

  return (
    <div className="mb-8">
      {/* Trigger button */}
      <button
        onClick={() => void handleClick()}
        disabled={streaming}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C29E5F] border border-[#C29E5F] px-4 py-2 rounded hover:bg-[#C29E5F]/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        aria-expanded={shown}
        aria-controls="passport-summary"
      >
        {streaming
          ? "Generating plain-language summary..."
          : shown && summary
          ? "Hide plain-language summary"
          : "Tell me about this passport in plain language"}
      </button>

      {/* Streaming summary */}
      {shown && (summary || streaming) && (
        <div
          id="passport-summary"
          className="mt-4 p-4 bg-[#FAFAF7] border border-[#D4C9BA] rounded text-sm text-[#1A1A1A] leading-relaxed"
          role="region"
          aria-label="Plain-language passport summary"
          aria-live="polite"
        >
          {summary}
          {streaming && (
            <span
              className="motion-safe:animate-pulse ml-0.5"
              aria-hidden="true"
            >
              |
            </span>
          )}
        </div>
      )}

      {summaryReady && (
        <>
          {/* Voice controls */}
          {hasSpeech && (
            <div
              className="mt-3 flex items-center gap-2"
              role="group"
              aria-label="Read aloud controls"
            >
              <button
                type="button"
                onClick={handleReadAloud}
                aria-label={
                  voiceState === "speaking"
                    ? "Pause narration"
                    : voiceState === "paused"
                    ? "Resume narration"
                    : "Read aloud"
                }
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#D4C9BA] bg-[#FAFAF7] text-[#5A5A5A] hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                {voiceState === "speaking" ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    Pause
                  </>
                ) : voiceState === "paused" ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Resume
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Read aloud
                  </>
                )}
              </button>
              {voiceState !== "idle" && (
                <button
                  type="button"
                  onClick={handleStopVoice}
                  aria-label="Stop narration"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#D4C9BA] bg-[#FAFAF7] text-[#5A5A5A] hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                >
                  <Square className="h-3.5 w-3.5" aria-hidden="true" />
                  Stop
                </button>
              )}
            </div>
          )}

          {/* Suggestion chips */}
          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Follow-up suggestions"
          >
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                disabled={followUpStreaming}
                className="text-xs px-3 py-1.5 rounded-full border border-[#7A8B75]/40 bg-[#7A8B75]/10 text-[#7A8B75] hover:bg-[#7A8B75]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* PDF download */}
          <a
            href={`/api/passport-pdf/${sku}`}
            download={`tempo-passport-${sku}.pdf`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#5A5A5A] border border-[#D4C9BA] px-3 py-1.5 rounded hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            Download passport PDF
          </a>

          {/* Free-text follow-up */}
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-xs font-medium text-[#5A5A5A]">Ask a follow-up</p>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFollowUp();
                }}
                placeholder="e.g. Is it safe to tumble dry?"
                aria-label="Follow-up question about this passport"
                className="flex-1 px-3 py-2 text-sm border border-[#D4C9BA] rounded bg-[#FAFAF7] text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
              {micSupported && (
                <button
                  type="button"
                  onClick={micState === "listening" ? micStop : micStart}
                  aria-label={
                    micState === "listening"
                      ? "Stop voice input"
                      : "Dictate follow-up question"
                  }
                  aria-pressed={micState === "listening"}
                  className={`p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
                    micState === "listening"
                      ? "bg-[#C4725A] text-white"
                      : "bg-[#E8DFD2] text-[#5A5A5A] hover:bg-[#D4C9BA]"
                  }`}
                >
                  {micState === "listening" ? (
                    <MicOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleFollowUp}
                disabled={!followUp.trim() || followUpStreaming}
                className="px-3 py-2 text-xs font-medium bg-[#7A8B75] text-white rounded hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {followUpStreaming ? "…" : "Ask"}
              </button>
            </div>

            {(followUpResponse || followUpStreaming) && (
              <div
                className="p-3 bg-[#FAFAF7] border border-[#D4C9BA] rounded text-sm text-[#1A1A1A] leading-relaxed"
                aria-live="polite"
                role="region"
                aria-label="Follow-up answer"
              >
                {followUpResponse}
                {followUpStreaming && (
                  <span
                    className="motion-safe:animate-pulse ml-0.5"
                    aria-hidden="true"
                  >
                    |
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="mt-2 text-sm text-[#C4725A]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test -- PassportNarratorButton
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/passport/PassportNarratorButton.tsx src/__tests__/PassportNarratorButton.test.tsx
git commit -m "feat: stream narrator, add chips, voice read-aloud, PDF download button"
```

---

## Task 6: Final verification

**Files:** No changes — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all tests PASS (new tests + any pre-existing tests).

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: 0 errors, 0 warnings. Fix any reported issues before continuing.

- [ ] **Step 3: Run type check**

```bash
pnpm typecheck
```

Expected: 0 errors. Fix any reported issues before continuing.

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: build completes with 0 errors. The PDF route will appear as a dynamic route in the build output.

- [ ] **Step 5: Final commit and manual checklist**

```bash
git add -A
git commit -m "chore: verify Passport Narrator v2 — all checks pass"
```

Manual verification checklist (do these in a running dev server with `pnpm dev`):

- [ ] Navigate to `/passport/TMP-001` — click "Tell me about this passport in plain language" — text streams token-by-token with blinking cursor
- [ ] After streaming completes, all 4 suggestion chips are visible
- [ ] Click "What does GOTS certification guarantee?" — follow-up answer streams, blinking cursor appears during stream
- [ ] Click "Read aloud" — narration starts; Pause/Resume/Stop controls work
- [ ] Click "Download passport PDF" — browser downloads a file named `tempo-passport-TMP-001.pdf`; open in PDF viewer — 2 pages, A4, QR code visible, carbon numbers with mileage equivalency present
- [ ] Repeat PDF download for TMP-002 through TMP-006
- [ ] Tab through all interactive elements — focus rings visible on every element
- [ ] Test in Chrome (voice + PDF)
- [ ] Test in Safari (voice + PDF)
- [ ] Confirm no em dashes appear in any generated text or UI copy

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Verify narrator route returns structured responses | Task 2 (streaming response, 400/404 validation) |
| 4 suggestion chips with exact text | Task 5 |
| Convert to streaming, token-by-token with cursor blink | Tasks 2 + 5 |
| Voice output: play/pause/stop, natural English voice | Task 5 |
| Download passport PDF button | Tasks 3 + 4 + 5 |
| PDF: 2-page A4, QR code, formatted for caregiver | Task 3 |
| System prompt: GOTS plain language | Task 2 |
| System prompt: CO2 grounding in miles | Task 2 |
| System prompt: mention Take-Back | Task 2 |
| System prompt: never "environmentally friendly" | Task 2 |
| Fix follow-up question bug | Task 2 |
| pnpm install @react-pdf/renderer | Task 1 |
