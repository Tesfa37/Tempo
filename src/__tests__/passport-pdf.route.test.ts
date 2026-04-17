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
