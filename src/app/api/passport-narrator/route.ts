import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { passports } from "@/data/passports";
import { products } from "@/data/products";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { sku?: string };
    const { sku } = body;

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
      },
      null,
      2
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 350,
      system: `You translate Digital Product Passport data into plain-language summaries for Tempo customers.

      Rules:
      - Write for someone who needs to know: what it's made of, where it came from, whether it's safe for their care needs, and how to wash it
      - Lead with the most actionable information for a disabled customer or caregiver
      - Mention sterilization compatibility prominently if the product is sterilization-safe
      - Mention certifications by name (GOTS, Fair Trade) — but explain what they mean briefly
      - Keep it under 150 words
      - Use plain language — no jargon unless immediately explained
      - Do not start with "This garment" — vary your opening`,
      messages: [
        {
          role: "user",
          content: `Summarize this Digital Product Passport for the ${product.name}:\n\n${passportContext}`,
        },
      ],
    });

    const content = message.content[0] ?? null;
    const summary =
      content?.type === "text" ? content.text : "Summary unavailable.";

    return new Response(JSON.stringify({ summary }), {
      headers: { "Content-Type": "application/json" },
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
