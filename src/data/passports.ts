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
};

export function getPassportBySku(sku: string): DigitalProductPassport | undefined {
  return passports[sku];
}
