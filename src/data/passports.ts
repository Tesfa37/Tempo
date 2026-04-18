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
  hazardousSubstances: string;

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
    modelNumber: "TMP-002-V2",
    issueDate: "2025-09-15",
    lastUpdated: "2026-01-15",

    materialComposition: [
      {
        fiber: "Tencel Lyocell (OEKO-TEX Certified)",
        percentage: 95,
        certified: true,
        certificationBody: "Lenzing AG",
      },
      {
        fiber: "Elastane",
        percentage: 5,
        certified: false,
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. Produced via Lenzing closed-loop lyocell solvent process with 99.5% solvent recovery. OEKO-TEX Standard 100 verified (Certificate No. OT-2025-2301-B).",

    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["OEKO-TEX", "GOTS", "Fair Trade", "ISO 14001"],
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
        role: "Lyocell Fiber Spinning",
        company: "Lenzing AG",
        location: "Lenzing, Austria",
        certification: "OEKO-TEX, FSC, EU Ecolabel",
      },
      {
        tier: 3,
        role: "Beech Forestry (FSC)",
        company: "FSC-certified forestry consortium",
        location: "Upper Austria",
        certification: "FSC",
      },
    ],

    certifications: [
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2025-2301-B",
        validUntil: "2026-05-31",
      },
      {
        name: "Made in Green by OEKO-TEX",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "MIG-2025-0447-B",
        validUntil: "2026-09-30",
      },
      {
        name: "EU Ecolabel for Textile Products",
        certificationBody: "Austrian Federal Environment Agency",
        certificateNumber: "EU-ECO-2025-2218",
        validUntil: "2027-03-31",
      },
    ],

    carbonFootprint: {
      rawMaterial: 0.8,
      manufacturing: 0.6,
      transport: 0.4,
      endOfLife: 0.2,
      total: 2.0,
    },
    waterUsageLiters: 900,
    energyKwh: 2.8,

    careInstructions: [
      "Machine wash at 40°C gentle cycle (care facility: up to 60°C)",
      "Do not bleach",
      "Tumble dry low or lay flat to dry",
      "Cool iron on reverse side",
      "Do not dry clean",
    ],
    sterilizationCompatible: true,
    sterilizationProtocol:
      "Thermal disinfection at 60°C gentle cycle for 10 minutes per EN 14065. Lyocell fibers maintain structural integrity at care-facility temperatures. Recommended: delicates or wool programme at 60°C.",
    maximumWashCycles: 270,

    recyclabilityScore: 78,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. Tencel lyocell is biodegradable and compostable in industrial facilities. Elastane component mechanically separated prior to composting via Lenzing EcoVero closed-loop recovery.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000021",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-003": {
    sku: "TMP-003",
    gtin: "09780000000038",
    productName: "Magnetic-Front Cardigan",
    modelNumber: "TMP-003-V2",
    issueDate: "2025-10-01",
    lastUpdated: "2026-01-15",

    materialComposition: [
      {
        fiber: "Merino Wool (ZQ Merino)",
        percentage: 70,
        certified: true,
        certificationBody: "ZQ Merino Programme",
      },
      {
        fiber: "Recycled Polyester (GRS)",
        percentage: 30,
        certified: true,
        certificationBody: "Control Union",
      },
    ],
    recycledContent: 30,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. No AZO dyes. OEKO-TEX Standard 100 verified (Certificate No. OT-2025-3312-C). ZQ Merino certified mulesing-free.",

    countryOfOrigin: "Italy",
    manufacturingFacility: {
      name: "Cooperativa Tessile Lombarda",
      address: "Via della Lana 42, 13900 Biella BI",
      country: "Italy",
      certifications: ["ZQ Merino", "GRS", "OEKO-TEX", "ISO 14001"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Knitting & Assembly",
        company: "Cooperativa Tessile Lombarda",
        location: "Biella, Italy",
        certification: "ZQ Merino, GRS, OEKO-TEX",
      },
      {
        tier: 2,
        role: "Yarn Spinning & Blending",
        company: "Lanificio Alpino del Monte Rosa",
        location: "Biella, Italy",
        certification: "ZQ Merino, GRS",
      },
      {
        tier: 3,
        role: "Merino Wool Farming",
        company: "ZQ Merino Station Partners",
        location: "Canterbury, New Zealand",
        certification: "ZQ Merino, ZQRX",
      },
    ],

    certifications: [
      {
        name: "ZQ Merino Standard",
        certificationBody: "The New Zealand Merino Company",
        certificateNumber: "ZQM-2025-4419",
        validUntil: "2026-09-30",
      },
      {
        name: "Global Recycled Standard (GRS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GRS-2025-7742",
        validUntil: "2026-08-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2025-3312-C",
        validUntil: "2026-05-31",
      },
    ],

    carbonFootprint: {
      rawMaterial: 0.9,
      manufacturing: 0.9,
      transport: 0.5,
      endOfLife: 0.1,
      total: 2.4,
    },
    waterUsageLiters: 850,
    energyKwh: 3.8,

    careInstructions: [
      "Machine wash at 40°C wool cycle (care facility: up to 60°C wool programme)",
      "Do not bleach",
      "Tumble dry low or dry flat",
      "Cool iron on reverse — do not iron magnets",
      "Do not dry clean",
    ],
    sterilizationCompatible: true,
    sterilizationProtocol:
      "Wool-safe thermal disinfection at 60°C wool programme for 10 minutes per EN 14065. Neodymium magnets maintain rated field strength for 300+ wash cycles at 60°C. Test on reverse seam before institutional use.",
    maximumWashCycles: 280,

    recyclabilityScore: 70,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. Merino/recycled polyester blend processed via mechanical fiber separation. Neodymium magnets recovered for industrial magnet reuse programme.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000038",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-004": {
    sku: "TMP-004",
    gtin: "09780000000045",
    productName: "Side-Zip Adaptive Jogger",
    modelNumber: "TMP-004-V2",
    issueDate: "2025-10-15",
    lastUpdated: "2026-01-15",

    materialComposition: [
      {
        fiber: "Organic Cotton French Terry (GOTS)",
        percentage: 80,
        certified: true,
        certificationBody: "Control Union",
      },
      {
        fiber: "Recycled Polyester (GRS)",
        percentage: 15,
        certified: true,
        certificationBody: "Control Union",
      },
      {
        fiber: "Elastane",
        percentage: 5,
        certified: false,
      },
    ],
    recycledContent: 15,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. OEKO-TEX Standard 100 verified (Certificate No. OT-2025-4423-D). Recycled polyester sourced from post-consumer PET bottles.",

    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["GOTS", "GRS", "Fair Trade", "SA8000"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Confecções Sustentáveis do Porto",
        location: "Porto, Portugal",
        certification: "GOTS, GRS, Fair Trade",
      },
      {
        tier: 2,
        role: "French Terry Knitting",
        company: "Texteis Orgânicos Minho",
        location: "Braga, Portugal",
        certification: "GOTS, GRS",
      },
      {
        tier: 3,
        role: "Cotton Ginning & Spinning",
        company: "Pamukova Organik Tekstil",
        location: "Sakarya, Turkey",
        certification: "GOTS, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Global Organic Textile Standard (GOTS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GOTS-2025-19203",
        validUntil: "2026-08-31",
      },
      {
        name: "Global Recycled Standard (GRS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GRS-2025-7743",
        validUntil: "2026-08-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2025-4423-D",
        validUntil: "2026-05-31",
      },
    ],

    carbonFootprint: {
      rawMaterial: 1.3,
      manufacturing: 1.0,
      transport: 0.5,
      endOfLife: 0.2,
      total: 3.0,
    },
    waterUsageLiters: 1350,
    energyKwh: 4.1,

    careInstructions: [
      "Machine wash at 60°C (care facility: hospital laundry cycle approved)",
      "Do not bleach",
      "Tumble dry low",
      "Do not iron the YKK zipper pull",
      "Do not dry clean",
    ],
    sterilizationCompatible: true,
    sterilizationProtocol:
      "Thermal disinfection at 60°C for 10 minutes per EN 14065. YKK side zippers rated for 300+ institutional wash cycles at 60°C. Compatible with standard care-facility laundry processes.",
    maximumWashCycles: 300,

    recyclabilityScore: 68,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. Cotton/recycled polyester blend mechanically separated for fiber recovery. YKK zippers recovered and returned to YKK hardware recycling stream.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000045",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-005": {
    sku: "TMP-005",
    gtin: "09780000000052",
    productName: "Easy-Pull Dress",
    modelNumber: "TMP-005-V2",
    issueDate: "2025-11-01",
    lastUpdated: "2026-01-15",

    materialComposition: [
      {
        fiber: "Tencel Lyocell (OEKO-TEX Certified)",
        percentage: 100,
        certified: true,
        certificationBody: "Lenzing AG",
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. Produced via Lenzing closed-loop lyocell solvent process with 99.5% solvent recovery. No chemical finishing agents. OEKO-TEX Standard 100 verified (Certificate No. OT-2025-5534-E).",

    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["OEKO-TEX", "GOTS", "Fair Trade", "EU Ecolabel"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Confecções Sustentáveis do Porto",
        location: "Porto, Portugal",
        certification: "OEKO-TEX, GOTS, Fair Trade",
      },
      {
        tier: 2,
        role: "Lyocell Fiber Spinning",
        company: "Lenzing AG",
        location: "Lenzing, Austria",
        certification: "OEKO-TEX, FSC, EU Ecolabel",
      },
      {
        tier: 3,
        role: "Beech Forestry (FSC)",
        company: "FSC-certified forestry consortium",
        location: "Upper Austria",
        certification: "FSC",
      },
    ],

    certifications: [
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2025-5534-E",
        validUntil: "2026-05-31",
      },
      {
        name: "EU Ecolabel for Textile Products",
        certificationBody: "Austrian Federal Environment Agency",
        certificateNumber: "EU-ECO-2025-3381",
        validUntil: "2027-03-31",
      },
      {
        name: "Made in Green by OEKO-TEX",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "MIG-2025-0891-E",
        validUntil: "2026-09-30",
      },
    ],

    carbonFootprint: {
      rawMaterial: 0.6,
      manufacturing: 0.7,
      transport: 0.4,
      endOfLife: 0.1,
      total: 1.8,
    },
    waterUsageLiters: 800,
    energyKwh: 2.6,

    careInstructions: [
      "Machine wash at 40°C gentle cycle (care facility: up to 60°C delicates programme)",
      "Do not bleach",
      "Tumble dry low or lay flat to dry",
      "Cool iron only",
      "Do not dry clean",
    ],
    sterilizationCompatible: true,
    sterilizationProtocol:
      "Thermal disinfection at 60°C delicates programme for 10 minutes per EN 14065. Lyocell maintains structural integrity at care-facility temperatures. Recommended: delicates or wool programme at 60°C.",
    maximumWashCycles: 260,

    recyclabilityScore: 82,
    endOfLifeInstructions:
      "100% Tencel lyocell. Biodegradable and compostable in certified industrial composting facilities. Return to Tempo Take-Back for Lenzing EcoVero closed-loop fiber recovery programme.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000052",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-006": {
    sku: "TMP-006",
    gtin: "09780000000069",
    productName: "Button-Free Linen Shirt",
    modelNumber: "TMP-006-V2",
    issueDate: "2025-12-15",
    lastUpdated: "2026-01-15",

    materialComposition: [
      {
        fiber: "European Flax Linen (Masters of Linen)",
        percentage: 100,
        certified: true,
        certificationBody: "CELC Masters of Linen",
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. Natural water retting only — no chemical retting agents used. OEKO-TEX Standard 100 verified (Certificate No. OT-2025-6645-F).",

    countryOfOrigin: "Italy",
    manufacturingFacility: {
      name: "Linificio Toscano",
      address: "Via della Filatura 88, 59100 Prato PO",
      country: "Italy",
      certifications: ["Masters of Linen", "OEKO-TEX", "European Flax", "SA8000"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Linificio Toscano",
        location: "Prato, Italy",
        certification: "Masters of Linen, OEKO-TEX",
      },
      {
        tier: 2,
        role: "Linen Weaving",
        company: "Tessuti Biologici di Biella",
        location: "Biella, Italy",
        certification: "Masters of Linen, European Flax",
      },
      {
        tier: 3,
        role: "Flax Farming & Water Retting",
        company: "Cooperative des Liniers Normands",
        location: "Normandy, France",
        certification: "Masters of Linen, European Flax",
      },
    ],

    certifications: [
      {
        name: "Masters of Linen",
        certificationBody: "CELC — Confédération Européenne du Lin et du Chanvre",
        certificateNumber: "MOL-2025-7723",
        validUntil: "2026-11-30",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2025-6645-F",
        validUntil: "2026-05-31",
      },
      {
        name: "European Flax Certification",
        certificationBody: "CELC — Confédération Européenne du Lin et du Chanvre",
        certificateNumber: "EF-2025-1156",
        validUntil: "2026-11-30",
      },
    ],

    carbonFootprint: {
      rawMaterial: 0.4,
      manufacturing: 0.9,
      transport: 0.5,
      endOfLife: 0.1,
      total: 1.9,
    },
    waterUsageLiters: 1600,
    energyKwh: 2.4,

    careInstructions: [
      "Machine wash at 40°C or hand wash (care facility: up to 60°C cotton programme)",
      "Do not bleach",
      "Line dry or lay flat — linen softens with each wash",
      "Iron while slightly damp for best results",
      "Do not dry clean",
    ],
    sterilizationCompatible: true,
    sterilizationProtocol:
      "Thermal disinfection at 60°C cotton programme for 10 minutes per EN 14065. European flax linen naturally antibacterial and strengthens when wet, suitable for institutional laundry. Suitable for care-facility hot-wash protocols.",
    maximumWashCycles: 250,

    recyclabilityScore: 84,
    endOfLifeInstructions:
      "100% European flax linen. Compostable in certified industrial composting facilities within 2 years. Return to Tempo Take-Back for natural fiber composting pathway or direct donation to textile recovery.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000069",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-007": {
    sku: "TMP-007",
    gtin: "09780000000076",
    productName: "Women's Everyday Tee",
    modelNumber: "TMP-007-V1",
    issueDate: "2026-02-01",
    lastUpdated: "2026-04-15",

    materialComposition: [
      {
        // Source: Textile Exchange Preferred Fiber & Materials Report 2023
        fiber: "Organic Cotton (GOTS)",
        percentage: 100,
        certified: true,
        certificationBody: "Control Union",
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. OEKO-TEX Standard 100 verified (Certificate No. OT-2026-7001-G). GOTS-compliant dyehouse: reactive dyes only, no heavy metals.",

    // Representative supplier -- pending confirmed onboarding
    countryOfOrigin: "Turkey",
    manufacturingFacility: {
      name: "Meridyen Tekstil Fabrikasi",
      address: "Ikitelli Organize Sanayi Bolgesi, 34306 Istanbul",
      country: "Turkey",
      certifications: ["GOTS", "Fair Trade", "OEKO-TEX", "SA8000"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        // Representative supplier -- pending confirmed onboarding
        company: "Meridyen Tekstil Fabrikasi",
        location: "Istanbul, Turkey",
        certification: "GOTS, Fair Trade, SA8000",
      },
      {
        tier: 2,
        role: "Jersey Knitting & Yarn Spinning",
        // Representative supplier -- pending confirmed onboarding
        company: "Pamukova Organik Tekstil",
        location: "Sakarya, Turkey",
        certification: "GOTS, OEKO-TEX",
      },
      {
        tier: 3,
        role: "Organic Cotton Farming",
        // Representative supplier -- Aegean region is Turkey's primary organic cotton growing area
        company: "Ege Organik Pamuk Kooperatifi",
        location: "Izmir, Turkey",
        certification: "GOTS, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Global Organic Textile Standard (GOTS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GOTS-2026-20147",
        validUntil: "2027-01-31",
      },
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2026-11322",
        validUntil: "2027-01-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2026-7001-G",
        validUntil: "2027-05-31",
      },
    ],

    // Source: Textile Exchange PFM Report 2023; Higg MSI organic cotton ~1.9 kg CO2e/kg fiber
    // Garment weight ~180g; field-to-gate + cut-and-sew + transport + EOL breakdown below
    carbonFootprint: {
      rawMaterial: 1.87,
      manufacturing: 0.74,
      transport: 0.43,
      endOfLife: 0.08,
      total: 3.12,
    },
    // Source: Textile Exchange 2022 -- organic cotton tee 1,000-1,500L; Izmir growing region
    waterUsageLiters: 1340,
    energyKwh: 5.2,

    careInstructions: [
      "Machine wash at 30-40 degrees C",
      "Do not bleach",
      "Tumble dry low or line dry",
      "Warm iron if needed",
      "Do not dry clean",
    ],
    sterilizationCompatible: false,
    sterilizationProtocol:
      "Not rated for institutional sterilization protocols. Home laundering at up to 40 degrees C. For care-setting use, consult laundry compatibility with facility manager.",
    // Source: Textile Exchange -- quality-constructed organic cotton jersey degrades after 200-400 cycles
    maximumWashCycles: 312,

    // Source: Ellen MacArthur Foundation -- mono-material natural fiber = highest recyclability tier
    recyclabilityScore: 91,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program for mechanical fiber recycling. 100% organic cotton is fully mechanically recyclable via open-loop cotton recycling. Fibers recovered as new yarn or industrial fill.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000076",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-008": {
    sku: "TMP-008",
    gtin: "09780000000083",
    productName: "Women's Tailored Trouser",
    modelNumber: "TMP-008-V1",
    issueDate: "2026-02-01",
    lastUpdated: "2026-04-15",

    materialComposition: [
      {
        // Source: product spec -- Fair Trade and OEKO-TEX certified
        fiber: "Cotton Twill (OEKO-TEX Certified)",
        percentage: 98,
        certified: true,
        certificationBody: "OEKO-TEX Association",
      },
      {
        fiber: "Elastane",
        percentage: 2,
        certified: false,
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. OEKO-TEX Standard 100 verified (Certificate No. OT-2026-7002-H). No AZO dyes or restricted chemical finishing agents.",

    // Representative supplier -- pending confirmed onboarding
    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["OEKO-TEX", "Fair Trade", "SA8000", "ISO 14001"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Confecções Sustentáveis do Porto",
        location: "Porto, Portugal",
        certification: "Fair Trade, SA8000",
      },
      {
        tier: 2,
        role: "Cotton Twill Weaving",
        company: "Texteis Orgânicos Minho",
        location: "Braga, Portugal",
        certification: "OEKO-TEX",
      },
      {
        tier: 3,
        role: "Cotton Spinning",
        // Representative supplier -- pending confirmed onboarding
        company: "Pamukova Organik Tekstil",
        location: "Sakarya, Turkey",
        certification: "OEKO-TEX, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2026-11323",
        validUntil: "2027-01-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2026-7002-H",
        validUntil: "2027-05-31",
      },
    ],

    // Source: Quantis/MADE-BY benchmark for cotton-elastane blended trousers 8-12 kg CO2e
    // Garment weight ~350g; woven twill more energy-intensive than jersey knit
    carbonFootprint: {
      rawMaterial: 5.23,
      manufacturing: 3.42,
      transport: 0.89,
      endOfLife: 0.33,
      total: 9.87,
    },
    // Source: Textile Exchange 2022 -- woven cotton trousers 3,000-5,000L; dyeing adds 600-900L
    waterUsageLiters: 4210,
    energyKwh: 14.2,

    careInstructions: [
      "Machine wash at 30 degrees C",
      "Do not bleach",
      "Hang to dry or tumble dry low",
      "Warm iron if needed",
      "Do not dry clean",
    ],
    sterilizationCompatible: false,
    sterilizationProtocol:
      "Not rated for institutional sterilization protocols. Home laundering at 30 degrees C recommended to preserve elastane stretch recovery. For care-setting use, consult facility manager.",
    // Source: Textile Exchange -- quality-constructed cotton twill 300-400 wash cycles
    maximumWashCycles: 356,

    // Source: Ellen MacArthur Foundation A New Textiles Economy -- elastane contamination prevents
    // clean mechanical separation at most recyclers; chemical recycling possible at specialist facilities
    // Material transparency note: 2% elastane limits recyclability at most municipal and textile recycling streams.
    // Chemical recycling via Worn Again or Renewlane can separate the blend.
    recyclabilityScore: 48,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. The 98/2 cotton-elastane blend requires chemical recycling for fiber separation. Partner facility: Renewlane chemical recycling stream. Alternatively, mechanical recycling for industrial fill if chemical recycling unavailable in your region.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000083",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-009": {
    sku: "TMP-009",
    gtin: "09780000000090",
    productName: "Men's Crew Neck Tee",
    modelNumber: "TMP-009-V1",
    issueDate: "2026-02-01",
    lastUpdated: "2026-04-15",

    materialComposition: [
      {
        // Source: Textile Exchange PFM Report 2023 -- GOTS organic cotton jersey
        fiber: "Organic Cotton (GOTS)",
        percentage: 100,
        certified: true,
        certificationBody: "Control Union",
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. OEKO-TEX Standard 100 verified (Certificate No. OT-2026-7003-I). GOTS-compliant dyehouse: reactive dyes only, no heavy metals.",

    // Representative supplier -- pending confirmed onboarding
    countryOfOrigin: "Turkey",
    manufacturingFacility: {
      name: "Meridyen Tekstil Fabrikasi",
      address: "Ikitelli Organize Sanayi Bolgesi, 34306 Istanbul",
      country: "Turkey",
      certifications: ["GOTS", "Fair Trade", "OEKO-TEX", "SA8000"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        // Representative supplier -- pending confirmed onboarding
        company: "Meridyen Tekstil Fabrikasi",
        location: "Istanbul, Turkey",
        certification: "GOTS, Fair Trade, SA8000",
      },
      {
        tier: 2,
        role: "Jersey Knitting & Yarn Spinning",
        company: "Pamukova Organik Tekstil",
        location: "Sakarya, Turkey",
        certification: "GOTS, OEKO-TEX",
      },
      {
        tier: 3,
        role: "Organic Cotton Farming",
        company: "Ege Organik Pamuk Kooperatifi",
        location: "Izmir, Turkey",
        certification: "GOTS, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Global Organic Textile Standard (GOTS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GOTS-2026-20148",
        validUntil: "2027-01-31",
      },
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2026-11324",
        validUntil: "2027-01-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2026-7003-I",
        validUntil: "2027-05-31",
      },
    ],

    // Source: Textile Exchange PFM 2023; Higg MSI -- men's tee ~10-15% heavier cut than women's
    // Garment weight ~200g; same Turkish organic cotton supply chain
    carbonFootprint: {
      rawMaterial: 1.94,
      manufacturing: 0.83,
      transport: 0.43,
      endOfLife: 0.08,
      total: 3.28,
    },
    // Source: Textile Exchange 2022 -- organic cotton tee 1,000-1,500L; slightly higher due to larger cut
    waterUsageLiters: 1420,
    energyKwh: 5.6,

    careInstructions: [
      "Machine wash at 30-40 degrees C",
      "Do not bleach",
      "Tumble dry low or line dry",
      "Warm iron if needed",
      "Do not dry clean",
    ],
    sterilizationCompatible: false,
    sterilizationProtocol:
      "Not rated for institutional sterilization protocols. Home laundering at up to 40 degrees C. For care-setting use, consult laundry compatibility with facility manager.",
    // Source: Textile Exchange -- quality-constructed organic cotton jersey degrades after 200-400 cycles
    maximumWashCycles: 305,

    // Source: Ellen MacArthur Foundation -- mono-material natural fiber = highest recyclability tier
    recyclabilityScore: 91,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program for mechanical fiber recycling. 100% organic cotton is fully mechanically recyclable via open-loop cotton recycling. Fibers recovered as new yarn or industrial fill.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000090",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-010": {
    sku: "TMP-010",
    gtin: "09780000000106",
    productName: "Men's Straight Trouser",
    modelNumber: "TMP-010-V1",
    issueDate: "2026-02-01",
    lastUpdated: "2026-04-15",

    materialComposition: [
      {
        fiber: "Cotton Twill (OEKO-TEX Certified)",
        percentage: 98,
        certified: true,
        certificationBody: "OEKO-TEX Association",
      },
      {
        fiber: "Elastane",
        percentage: 2,
        certified: false,
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. OEKO-TEX Standard 100 verified (Certificate No. OT-2026-7004-J). No AZO dyes or restricted chemical finishing agents.",

    // Representative supplier -- pending confirmed onboarding
    countryOfOrigin: "Portugal",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["OEKO-TEX", "Fair Trade", "SA8000", "ISO 14001"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Confecções Sustentáveis do Porto",
        location: "Porto, Portugal",
        certification: "Fair Trade, SA8000",
      },
      {
        tier: 2,
        role: "Cotton Twill Weaving",
        company: "Texteis Orgânicos Minho",
        location: "Braga, Portugal",
        certification: "OEKO-TEX",
      },
      {
        tier: 3,
        role: "Cotton Spinning",
        company: "Pamukova Organik Tekstil",
        location: "Sakarya, Turkey",
        certification: "OEKO-TEX, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2026-11325",
        validUntil: "2027-01-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2026-7004-J",
        validUntil: "2027-05-31",
      },
    ],

    // Source: Quantis/MADE-BY benchmark for cotton-elastane trousers 8-12 kg CO2e
    // Men's straight trouser ~390g -- slightly heavier cut than women's tailored trouser
    carbonFootprint: {
      rawMaterial: 5.47,
      manufacturing: 3.68,
      transport: 0.93,
      endOfLife: 0.06,
      total: 10.14,
    },
    // Source: Textile Exchange 2022 -- woven cotton trousers 3,000-5,000L; larger cut = higher water
    waterUsageLiters: 4480,
    energyKwh: 15.1,

    careInstructions: [
      "Machine wash at 30 degrees C",
      "Do not bleach",
      "Hang to dry or tumble dry low",
      "Warm iron if needed",
      "Do not dry clean",
    ],
    sterilizationCompatible: false,
    sterilizationProtocol:
      "Not rated for institutional sterilization protocols. Home laundering at 30 degrees C recommended to preserve elastane stretch recovery. For care-setting use, consult facility manager.",
    // Source: Textile Exchange -- quality-constructed cotton twill 300-400 wash cycles
    maximumWashCycles: 341,

    // Source: Ellen MacArthur Foundation -- elastane contamination limits recyclability
    // Material transparency: 2% elastane limits recyclability at most municipal recycling streams.
    recyclabilityScore: 48,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. The 98/2 cotton-elastane blend requires chemical recycling for fiber separation via Renewlane partner stream. Mechanical recycling to industrial fill available as secondary pathway.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000106",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-011": {
    sku: "TMP-011",
    gtin: "09780000000113",
    productName: "Adaptive Magnetic Button-Down",
    modelNumber: "TMP-011-V1",
    issueDate: "2026-02-15",
    lastUpdated: "2026-04-15",

    materialComposition: [
      {
        // Source: Textile Exchange PFM 2023 -- GOTS organic cotton poplin
        // Poplin: balanced plain weave, higher thread count than jersey = tighter specification
        fiber: "Organic Cotton Poplin (GOTS)",
        percentage: 100,
        certified: true,
        certificationBody: "Control Union",
      },
    ],
    recycledContent: 0,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. GOTS-compliant dyehouse: reactive dyes only. Neodymium magnets: N35 grade, nickel-plated, RoHS compliant -- no restricted substances. OEKO-TEX Standard 100 applied to fabric only (Certificate No. OT-2026-7005-K).",

    // Representative supplier -- pending confirmed onboarding
    countryOfOrigin: "India",
    manufacturingFacility: {
      name: "Gujarat Organic Apparel",
      address: "Plot 14, GIDC Naroda, Ahmedabad 382330, Gujarat",
      country: "India",
      certifications: ["GOTS", "Fair Trade", "SA8000", "OEKO-TEX"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut, Sew & Magnet Installation",
        // Representative supplier -- pending confirmed onboarding
        company: "Gujarat Organic Apparel",
        location: "Ahmedabad, Gujarat, India",
        certification: "GOTS, Fair Trade, SA8000",
      },
      {
        tier: 2,
        role: "Poplin Weaving",
        // Representative supplier -- pending confirmed onboarding
        company: "Ahmedabad Cotton Mills",
        location: "Ahmedabad, Gujarat, India",
        certification: "GOTS, OEKO-TEX",
      },
      {
        tier: 3,
        role: "Organic Cotton Farming",
        // Representative supplier -- Kheda is Gujarat's leading organic cotton district
        company: "Kheda Organic Farmers Cooperative",
        location: "Kheda District, Gujarat, India",
        certification: "GOTS, Fairtrade International",
      },
    ],

    certifications: [
      {
        name: "Global Organic Textile Standard (GOTS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GOTS-2026-20149",
        validUntil: "2027-01-31",
      },
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2026-11326",
        validUntil: "2027-01-31",
      },
    ],

    // Source: Patagonia LCA for woven cotton shirts ~4-7 kg CO2e; poplin more energy-intensive
    // than jersey knit due to tighter weave specification + magnetic hardware component
    carbonFootprint: {
      rawMaterial: 2.91,
      manufacturing: 1.89,
      // India-origin transport higher than Turkey or Portugal due to shipping distance
      transport: 0.76,
      // Magnetic hardware separation adds complexity and energy at EOL
      endOfLife: 0.28,
      total: 5.84,
    },
    // Source: Textile Exchange 2022 -- woven cotton shirts 2,000-3,000L; poplin similar to broadcloth
    waterUsageLiters: 2640,
    energyKwh: 9.3,

    careInstructions: [
      "Machine wash at 30 degrees C gentle cycle",
      "Do not bleach",
      "Lay flat to dry or line dry",
      "Cool iron only -- do not iron over magnets",
      "Do not dry clean",
    ],
    sterilizationCompatible: false,
    sterilizationProtocol:
      "Not rated for institutional sterilization protocols. Neodymium magnets maintain field strength through 200+ home wash cycles at 30-40 degrees C. Hot water above 60 degrees C may demagnetize neodymium closures over time. For care-setting use, consult facility manager.",
    // Source: Textile Exchange -- quality-constructed organic cotton woven shirts 200-350 wash cycles
    maximumWashCycles: 278,

    // Source: Ellen MacArthur Foundation -- 100% cotton fabric = high recyclability; neodymium magnets
    // require magnetic separation before fiber recycling; post-separation fabric recyclability: 90+
    // Magnets are recoverable via magnetic separation -- e-waste streams or specialist hardware recyclers
    recyclabilityScore: 74,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. Step 1: Neodymium magnets removed via magnetic separation and returned to industrial magnet recovery stream (e-waste specialist). Step 2: 100% organic cotton fabric mechanically recycled via open-loop fiber recovery. Both components have established end-of-life pathways.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000113",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },

  "TMP-012": {
    sku: "TMP-012",
    gtin: "09780000000120",
    productName: "Adaptive Pull-On Jean",
    modelNumber: "TMP-012-V1",
    issueDate: "2026-02-15",
    lastUpdated: "2026-04-15",

    materialComposition: [
      {
        // Source: Recover brand (Alcoy, Spain) LCA -- recycled cotton fiber ~0.3 kg CO2e/kg
        // vs virgin cotton ~1.7 kg CO2e/kg; pre-consumer textile waste feedstock
        fiber: "Recycled Cotton Denim (GRS)",
        percentage: 92,
        certified: true,
        certificationBody: "Control Union",
      },
      {
        fiber: "Elastane",
        percentage: 8,
        certified: false,
      },
    ],
    recycledContent: 92,
    hazardousSubstances:
      "None detected. REACH Annex XVII compliant. Global Recycled Standard (GRS) verified. Enzyme wash process used (no pumice stone). OEKO-TEX Standard 100 verified (Certificate No. OT-2026-7006-L). Elastic waistband: food-grade silicone grip tape, no PVC or restricted plasticizers.",

    // Representative supplier -- pending confirmed onboarding
    countryOfOrigin: "Spain",
    manufacturingFacility: {
      name: "Confecções Sustentáveis do Porto",
      address: "Rua da Fábrica 24, 4150-288 Porto",
      country: "Portugal",
      certifications: ["GRS", "Fair Trade", "SA8000", "OEKO-TEX"],
    },
    supplyChain: [
      {
        tier: 1,
        role: "Cut & Sew",
        company: "Confecções Sustentáveis do Porto",
        location: "Porto, Portugal",
        certification: "GRS, Fair Trade",
      },
      {
        tier: 2,
        role: "Recycled Denim Fabric Processing",
        // Representative supplier -- Recover is the leading recycled cotton brand in Spain
        // Pending confirmed onboarding
        company: "Recover Fiber S.L.",
        location: "Alcoy, Spain",
        certification: "GRS, OEKO-TEX",
      },
      {
        tier: 3,
        role: "Pre-Consumer Textile Waste Collection",
        // Representative -- RCOT is a fictional representative for the European textile waste collection network
        company: "RCOT Pan-European Collection Network",
        location: "Pan-European",
        certification: "GRS",
      },
    ],

    certifications: [
      {
        name: "Global Recycled Standard (GRS)",
        certificationBody: "Control Union Certifications",
        certificateNumber: "CU-GRS-2026-8891",
        validUntil: "2027-01-31",
      },
      {
        name: "Fair Trade Certified",
        certificationBody: "Fair Trade USA",
        certificateNumber: "FT-2026-11327",
        validUntil: "2027-01-31",
      },
      {
        name: "OEKO-TEX Standard 100",
        certificationBody: "OEKO-TEX Association",
        certificateNumber: "OT-2026-7006-L",
        validUntil: "2027-05-31",
      },
    ],

    // Source: Recover brand LCA -- recycled cotton ~60% lower CO2 vs virgin cotton
    // Levi's 501 jean (virgin cotton) published LCA: ~33.4 kg CO2e
    // At 92% recycled cotton + elastane: estimated 14-18 kg CO2e range
    carbonFootprint: {
      rawMaterial: 8.23,
      manufacturing: 4.87,
      // Multi-country supply chain: Spain fiber + Portugal cut & sew + US distribution
      transport: 1.94,
      // Elastane content requires chemical separation at EOL; higher energy than pure cotton
      endOfLife: 0.43,
      total: 15.47,
    },
    // Source: Recover brand LCA -- recycled cotton manufacturing saves ~90% water vs virgin denim
    // Levi's virgin jean: ~7,000-10,000L; recycled cotton at 92% content: ~3,500-5,000L estimated
    waterUsageLiters: 4120,
    energyKwh: 22.4,

    careInstructions: [
      "Machine wash at 30 degrees C inside out",
      "Do not bleach",
      "Tumble dry low or line dry",
      "Cool iron only if needed",
      "Do not dry clean",
    ],
    sterilizationCompatible: false,
    sterilizationProtocol:
      "Not rated for institutional sterilization protocols. Elastane content (8%) may degrade at temperatures above 60 degrees C over repeated cycles. Home laundering at 30 degrees C preserves elastane recovery and fabric structure. For care-setting use, consult facility manager.",
    // Source: Textile Exchange -- quality-constructed denim 250-400 wash cycles
    maximumWashCycles: 312,

    // Source: Ellen MacArthur Foundation A New Textiles Economy -- elastane-blended denim
    // recyclability score 50-60%; chemical recycling via Worn Again or Renewlane separates blend
    // Elastic waistband (flat inner face, no external hardware) is separable before fiber recycling
    recyclabilityScore: 54,
    endOfLifeInstructions:
      "Return to Tempo Take-Back program. Step 1: Elastic waistband removed and recycled separately (rubber/silicone recycling stream). Step 2: 92/8 recycled cotton-elastane denim processed via chemical recycling partner (Renewlane or Worn Again) for fiber separation. Alternatively, recycled cotton content recoverable via open-loop mechanical recycling to industrial fill.",
    takeBackProgram: true,

    gs1DigitalLinkUrl: "https://id.gs1.org/01/09780000000120",
    jsonLdContext: "https://schema.org/Product",
    verifiedBy: [
      "GS1 Digital Link Standard v1.2",
      "ESPR Delegated Act (EU) 2024/1781",
      "Control Union Certifications",
    ],
    passportVersion: "2.1.0",
  },
};

export function getPassportBySku(sku: string): DigitalProductPassport | undefined {
  return passports[sku];
}
