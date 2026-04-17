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
