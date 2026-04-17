export interface SupplyChainTier {
  tier: 1 | 2 | 3;
  role: string;
  company: string;
  location: string;
  certification: string | null;
}

export interface CarbonBreakdown {
  rawMaterial: number; // kg CO2e
  manufacturing: number;
  transport: number;
  endOfLife: number;
  total: number;
}

export interface DigitalProductPassport {
  // Identity
  sku: string;
  gtin: string;
  productName: string;
  modelNumber: string;
  issueDate: string; // ISO 8601
  lastUpdated: string;

  // Materials (ESPR Article 7)
  materialComposition: Array<{
    fiber: string;
    percentage: number;
    certified: boolean;
    certificationBody?: string;
  }>;
  recycledContent: number; // percentage
  hazardousSubstances: string; // "None detected per REACH Annex XVII"

  // Supply Chain (ESPR Article 8)
  countryOfOrigin: string;
  manufacturingFacility: {
    name: string;
    address: string;
    country: string;
    certifications: string[];
  };
  supplyChain: SupplyChainTier[];

  // Certifications
  certifications: Array<{
    name: string;
    certificationBody: string;
    certificateNumber: string;
    validUntil: string;
  }>;

  // Environmental Impact
  carbonFootprint: CarbonBreakdown;
  waterUsageLiters: number;
  energyKwh: number;

  // Care & Sterilization
  careInstructions: string[];
  sterilizationCompatible: boolean;
  sterilizationProtocol: string;
  maximumWashCycles: number;

  // End of Life
  recyclabilityScore: number; // 0-100
  endOfLifeInstructions: string;
  takeBackProgram: boolean;

  // Digital Verification
  gs1DigitalLinkUrl: string;
  jsonLdContext: string;
  verifiedBy: string[];
  passportVersion: string;
}

export const passports: Record<string, DigitalProductPassport> = {
  "TMP-001": {
    sku: "TMP-001",
    gtin: "09780000000014",
    productName: "Seated-Cut Trouser",
    modelNumber: "TMP-001-V2",
    issueDate: "2025-09-01",
    lastUpdated: "2026-01-15",

    materialComposition: [
      {
        fiber: "Organic Cotton (GOTS)",
        percentage: 95,
        certified: true,
        certificationBody: "Control Union",
      },
      {
        fiber: "Elastane",
        percentage: 5,
        certified: false,
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. OEKO-TEX Standard 100 verified (Certificate No. OT-2025-1847-A).",

    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["GOTS", "Fair Trade", "SA8000", "ISO 14001"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Confecções Sustentáveis do Porto",
        location: "Porto, Portugal",
        certification: "GOTS, Fair Trade",
      },
      {
        tier: 2,
        role: "Fabric Weaving",
        company: "Texteis Orgânicos Minho",
        location: "Braga, Portugal",
        certification: "GOTS",
      },
      {
        tier: 3,
        role: "Cotton Ginning & Spinning",
        company: "Cooperativa Agrícola de Bela Vista",
        location: "Mato Grosso, Brazil",
        certification: "GOTS, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Global Organic Textile Standard (GOTS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GOTS-2025-18847",
        validUntil: "2026-08-31",
      },
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2025-9921",
        validUntil: "2026-07-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2025-1847-A",
        validUntil: "2026-05-31",
      },
    ],

    carbonFootprint: {
      rawMaterial: 1.2,
      manufacturing: 0.8,
      transport: 0.4,
      endOfLife: 0.1,
      total: 2.5,
    },
    waterUsageLiters: 1200,
    energyKwh: 3.8,

    careInstructions: [
      "Machine wash at 40°C (care facility: up to 60°C)",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
      "Do not dry clean",
    ],
    sterilizationCompatible: true,
    sterilizationProtocol:
      "Thermal disinfection at 60°C for 10 minutes. Compatible with standard hospital laundry cycles per EN 14065. Magnets retain field strength for 200+ wash cycles at 60°C.",
    maximumWashCycles: 300,

    recyclabilityScore: 72,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program for fiber recycling. The 95/5 cotton-elastane blend is mechanically recyclable via our partner Recover Upcycled Textile. Magnets are recovered and reused.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000014",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-002": {
    sku: "TMP-002",
    gtin: "09780000000021",
    productName: "Knotless Wrap Blouse",
    modelNumber: "TMP-002-V1",
    issueDate: "2025-09-01",
    lastUpdated: "2026-01-15",
    materialComposition: [
      {
        fiber: "Organic Cotton Jersey (GOTS)",
        percentage: 100,
        certified: true,
        certificationBody: "Control Union",
      },
    ],
    recycledContent: 0,
    hazardousSubstances: "None detected. REACH compliant.",
    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["GOTS", "Fair Trade"],
    },
    supplyChain: [
      { tier: 1, role: "Cut & Sew", company: "Confecções Sustentáveis do Porto", location: "Porto, Portugal", certification: "GOTS" },
      { tier: 2, role: "Knitting", company: "Texteis Orgânicos Minho", location: "Braga, Portugal", certification: "GOTS" },
      { tier: 3, role: "Cotton Farming", company: "Cooperativa Agrícola de Bela Vista", location: "Mato Grosso, Brazil", certification: "Fairtrade" },
    ],
    certifications: [
      { name: "GOTS", certificationBody: "Control Union", certificateNumber: "CU-GOTS-2025-18848", validUntil: "2026-08-31" },
      { name: "Fair Trade Certified", certificationBody: "Fair Trade USA", certificateNumber: "FT-2025-9922", validUntil: "2026-07-31" },
    ],
    carbonFootprint: { rawMaterial: 0.9, manufacturing: 0.5, transport: 0.3, endOfLife: 0.1, total: 1.8 },
    waterUsageLiters: 900,
    energyKwh: 2.9,
    careInstructions: ["Machine wash cold, gentle", "Do not bleach", "Lay flat to dry", "Cool iron"],
    sterilizationCompatible: false,
    sterilizationProtocol: "Not suitable for institutional hot-wash cycles. Home care use only.",
    maximumWashCycles: 200,
    recyclabilityScore: 92,
    endOfLifeInstructions: "100% cotton. Return to Tempo Take-Back for fiber recovery or donate to textile recycling.",
    takeBackProgram: true,
    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000021",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: ["GS1 Digital Link Standard v1.2", "Control Union Certifications"],
    passportVersion: "1.0.0",
  },

  "TMP-003": {
    sku: "TMP-003",
    gtin: "09780000000038",
    productName: "Magnetic-Front Cardigan",
    modelNumber: "TMP-003-V1",
    issueDate: "2025-09-01",
    lastUpdated: "2026-01-15",
    materialComposition: [
      { fiber: "Recycled Wool (GRS)", percentage: 60, certified: true, certificationBody: "Control Union" },
      { fiber: "Organic Cotton (GOTS)", percentage: 35, certified: true, certificationBody: "Control Union" },
      { fiber: "Elastane", percentage: 5, certified: false },
    ],
    recycledContent: 60,
    hazardousSubstances: "None detected. REACH compliant. No AZO dyes.",
    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["GOTS", "GRS", "Fair Trade"],
    },
    supplyChain: [
      { tier: 1, role: "Cut & Sew", company: "Confecções Sustentáveis do Porto", location: "Porto, Portugal", certification: "GRS, GOTS" },
      { tier: 2, role: "Yarn Spinning", company: "Re-Yarn Ibérica", location: "Barcelona, Spain", certification: "GRS" },
      { tier: 3, role: "Post-Consumer Wool Collection", company: "Eco-Fibres UK", location: "Bradford, UK", certification: "GRS" },
    ],
    certifications: [
      { name: "Global Recycled Standard (GRS)", certificationBody: "Control Union", certificateNumber: "CU-GRS-2025-7741", validUntil: "2026-08-31" },
      { name: "OEKO-TEX Standard 100", certificationBody: "OEKO-TEX", certificateNumber: "OT-2025-1849-A", validUntil: "2026-05-31" },
    ],
    carbonFootprint: { rawMaterial: 0.6, manufacturing: 1.1, transport: 0.5, endOfLife: 0.2, total: 2.4 },
    waterUsageLiters: 400,
    energyKwh: 4.2,
    careInstructions: ["Machine wash 40°C wool cycle", "Do not bleach", "Tumble dry low", "Cool iron on reverse"],
    sterilizationCompatible: true,
    sterilizationProtocol: "Wool-cycle compatible up to 60°C. Magnets rated 200+ cycles.",
    maximumWashCycles: 200,
    recyclabilityScore: 65,
    endOfLifeInstructions: "Blended fiber. Return to Tempo Take-Back for blended fiber recycling pathway.",
    takeBackProgram: true,
    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000038",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: ["GS1 Digital Link Standard v1.2", "Control Union Certifications"],
    passportVersion: "1.0.0",
  },

  "TMP-004": {
    sku: "TMP-004",
    gtin: "09780000000045",
    productName: "Side-Zip Adaptive Jogger",
    modelNumber: "TMP-004-V1",
    issueDate: "2025-09-01",
    lastUpdated: "2026-01-15",
    materialComposition: [
      { fiber: "Organic Cotton French Terry (GOTS)", percentage: 92, certified: true, certificationBody: "Control Union" },
      { fiber: "Elastane", percentage: 8, certified: false },
    ],
    recycledContent: 0,
    hazardousSubstances: "None detected. REACH compliant.",
    countryOfOrigin: "Portugal",
    manufacturingFacility: { name: "Confecções Sustentáveis do Porto", address: "Rua da Fábrica 24, 4150-288 Porto", country: "Portugal", certifications: ["GOTS", "Fair Trade"] },
    supplyChain: [
      { tier: 1, role: "Cut & Sew", company: "Confecções Sustentáveis do Porto", location: "Porto, Portugal", certification: "GOTS" },
      { tier: 2, role: "Loopback Knitting", company: "Texteis Orgânicos Minho", location: "Braga, Portugal", certification: "GOTS" },
      { tier: 3, role: "Cotton Farming", company: "Cooperativa Agrícola de Bela Vista", location: "Mato Grosso, Brazil", certification: "Fairtrade" },
    ],
    certifications: [
      { name: "GOTS", certificationBody: "Control Union", certificateNumber: "CU-GOTS-2025-18850", validUntil: "2026-08-31" },
      { name: "Fair Trade Certified", certificationBody: "Fair Trade USA", certificateNumber: "FT-2025-9924", validUntil: "2026-07-31" },
    ],
    carbonFootprint: { rawMaterial: 1.1, manufacturing: 0.9, transport: 0.4, endOfLife: 0.1, total: 2.5 },
    waterUsageLiters: 1100,
    energyKwh: 3.5,
    careInstructions: ["Machine wash 60°C", "Do not bleach", "Tumble dry low", "Do not iron zippers"],
    sterilizationCompatible: true,
    sterilizationProtocol: "Machine wash at 60°C. YKK zippers rated 100+ care-facility cycles.",
    maximumWashCycles: 250,
    recyclabilityScore: 68,
    endOfLifeInstructions: "Return to Tempo Take-Back. YKK zippers recovered for hardware recycling.",
    takeBackProgram: true,
    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000045",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: ["GS1 Digital Link Standard v1.2", "Control Union Certifications"],
    passportVersion: "1.0.0",
  },

  "TMP-005": {
    sku: "TMP-005",
    gtin: "09780000000052",
    productName: "Easy-Pull Dress",
    modelNumber: "TMP-005-V1",
    issueDate: "2025-09-01",
    lastUpdated: "2026-01-15",
    materialComposition: [
      { fiber: "Organic Cotton (GOTS)", percentage: 70, certified: true, certificationBody: "Control Union" },
      { fiber: "Tencel Modal (FSC-certified)", percentage: 25, certified: true, certificationBody: "Lenzing" },
      { fiber: "Elastane", percentage: 5, certified: false },
    ],
    recycledContent: 0,
    hazardousSubstances: "None detected. REACH compliant. Tencel produced via closed-loop lyocell process.",
    countryOfOrigin: "Portugal",
    manufacturingFacility: { name: "Confecções Sustentáveis do Porto", address: "Rua da Fábrica 24, 4150-288 Porto", country: "Portugal", certifications: ["GOTS", "Fair Trade"] },
    supplyChain: [
      { tier: 1, role: "Cut & Sew", company: "Confecções Sustentáveis do Porto", location: "Porto, Portugal", certification: "GOTS" },
      { tier: 2, role: "Modal Fiber Supply", company: "Lenzing AG", location: "Lenzing, Austria", certification: "FSC, OEKO-TEX" },
      { tier: 3, role: "Beech Forestry", company: "FSC-certified Austrian forestry consortium", location: "Upper Austria", certification: "FSC" },
    ],
    certifications: [
      { name: "GOTS", certificationBody: "Control Union", certificateNumber: "CU-GOTS-2025-18851", validUntil: "2026-08-31" },
      { name: "OEKO-TEX Standard 100", certificationBody: "OEKO-TEX", certificateNumber: "OT-2025-1851-A", validUntil: "2026-05-31" },
    ],
    carbonFootprint: { rawMaterial: 0.8, manufacturing: 0.7, transport: 0.3, endOfLife: 0.2, total: 2.0 },
    waterUsageLiters: 700,
    energyKwh: 3.1,
    careInstructions: ["Machine wash cold, gentle cycle", "Do not bleach", "Lay flat to dry", "Cool iron only"],
    sterilizationCompatible: false,
    sterilizationProtocol: "Not suitable for institutional hot-wash. Tencel Modal requires low-heat care.",
    maximumWashCycles: 150,
    recyclabilityScore: 58,
    endOfLifeInstructions: "Blended fiber. Return to Tempo Take-Back. Tencel composted via industrial pathway.",
    takeBackProgram: true,
    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000052",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: ["GS1 Digital Link Standard v1.2", "Control Union Certifications"],
    passportVersion: "1.0.0",
  },

  "TMP-006": {
    sku: "TMP-006",
    gtin: "09780000000069",
    productName: "Button-Free Linen Shirt",
    modelNumber: "TMP-006-V1",
    issueDate: "2025-09-01",
    lastUpdated: "2026-01-15",
    materialComposition: [
      { fiber: "Belgian Linen (GOTS)", percentage: 100, certified: true, certificationBody: "Control Union" },
    ],
    recycledContent: 0,
    hazardousSubstances: "None detected. REACH compliant.",
    countryOfOrigin: "Portugal",
    manufacturingFacility: { name: "Confecções Sustentáveis do Porto", address: "Rua da Fábrica 24, 4150-288 Porto", country: "Portugal", certifications: ["GOTS", "Fair Trade"] },
    supplyChain: [
      { tier: 1, role: "Cut & Sew", company: "Confecções Sustentáveis do Porto", location: "Porto, Portugal", certification: "GOTS" },
      { tier: 2, role: "Linen Weaving", company: "Linen Masters Belgium", location: "Ghent, Belgium", certification: "GOTS" },
      { tier: 3, role: "Flax Farming", company: "Cooperative des Liniers du Nord", location: "Normandy, France", certification: "GOTS" },
    ],
    certifications: [
      { name: "GOTS", certificationBody: "Control Union", certificateNumber: "CU-GOTS-2025-18852", validUntil: "2026-08-31" },
      { name: "Fair Trade Certified", certificationBody: "Fair Trade USA", certificateNumber: "FT-2025-9926", validUntil: "2026-07-31" },
    ],
    carbonFootprint: { rawMaterial: 0.7, manufacturing: 0.6, transport: 0.4, endOfLife: 0.1, total: 1.8 },
    waterUsageLiters: 500,
    energyKwh: 2.8,
    careInstructions: ["Machine wash cold or hand wash", "Do not bleach", "Lay flat or line dry", "Iron while damp"],
    sterilizationCompatible: false,
    sterilizationProtocol: "Not suitable for institutional hot-wash. Linen fiber integrity degrades above 40°C wash.",
    maximumWashCycles: 200,
    recyclabilityScore: 95,
    endOfLifeInstructions: "100% linen. Compostable. Return to Tempo Take-Back for natural fiber composting pathway.",
    takeBackProgram: true,
    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000069",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: ["GS1 Digital Link Standard v1.2", "Control Union Certifications"],
    passportVersion: "1.0.0",
  },
};

export function getPassportBySku(sku: string): DigitalProductPassport | undefined {
  return passports[sku];
}
