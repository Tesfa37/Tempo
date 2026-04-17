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
- Explain certifications in plain language. GOTS = Global Organic Textile Standard, covers fiber origin and labor conditions. Fair Trade = ethical labor and fair wages certification. OEKO-TEX Standard 100 = tests the finished garment for harmful substances. OEKO-TEX Made in Green = adds environmental and social facility criteria on top of Standard 100. Global Recycled Standard (GRS) = verifies recycled content percentage and chain of custody. ZQ Merino = ethical animal welfare standard for merino wool farms.
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
        ? `Given this Digital Product Passport for the ${product.name}:\n\n${passportContext}\n\nAnswer this question in plain language: ${question.trim().slice(0, 500)}`
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
