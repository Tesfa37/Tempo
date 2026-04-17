import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { DigitalProductPassport } from "@/data/passports";

const CERT_EXPLANATIONS: Record<string, string> = {
  GOTS: "Global Organic Textile Standard, certifies organic fiber origin and ethical labor conditions throughout the supply chain.",
  "Fair Trade": "Ethical labor certification, guarantees fair wages and safe working conditions for all workers.",
  "OEKO-TEX": "Tests for harmful substances, no chemicals that could harm wearers or the environment.",
  bluesign: "Sustainable chemical and water use in the manufacturing process.",
};

function co2Miles(kg: number): string {
  const miles = Math.round((kg / 2.5) * 10);
  if (miles === 0) return "< 1 mile driving equivalent";
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
  topRow: { flexDirection: "row", marginBottom: 18 },
  identityBlock: { flex: 1, marginRight: 16 },
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
      {/* Page 1: Identity, Materials, Certifications */}
      <Page size="A4" style={s.page}>
        <PageHeader sku={passport.sku} />

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
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image is a PDF primitive, not an HTML img */}
            <Image src={qrDataUri} style={{ width: 88, height: 88 }} />
            <Text style={s.qrCaption}>tempo.style/passport/{passport.sku}</Text>
          </View>
        </View>

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
                  Certificate: {cert.certificateNumber}, valid until {formatDate(cert.validUntil)}
                </Text>
              </View>
            );
          })}
        </View>

        <PageFooter generatedDate={generatedDate} />
      </Page>

      {/* Page 2: Carbon, Care, End of Life */}
      <Page size="A4" style={s.page}>
        <PageHeader sku={passport.sku} />

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
