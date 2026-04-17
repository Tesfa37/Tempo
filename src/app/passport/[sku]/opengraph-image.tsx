import { ImageResponse } from "next/og";
import { passports } from "@/data/passports";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return Object.keys(passports).map((sku) => ({ sku }));
}

async function loadPlayfair(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1]);
    const fontUrl = urls[urls.length - 1];
    if (!fontUrl) return null;
    return fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const passport = passports[sku];
  return [
    {
      id: sku,
      alt: passport
        ? `Digital Product Passport for ${passport.productName}`
        : `Digital Product Passport ${sku}`,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const passport = passports[sku];
  const fontData = await loadPlayfair();

  const productName = passport?.productName ?? sku;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#003399",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#003399",
            opacity: 0.14,
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            color: "#C29E5F",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: fontData ? "Playfair Display" : "Georgia, serif",
          }}
        >
          TEMPO
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: "auto",
            gap: 20,
          }}
        >
          <div
            style={{
              color: "#9A9A9A",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            DIGITAL PRODUCT PASSPORT
          </div>

          <div
            style={{
              color: "#FAFAF7",
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.15,
              fontFamily: fontData ? "Playfair Display" : "Georgia, serif",
              maxWidth: 700,
            }}
          >
            {productName}
          </div>

          <div
            style={{
              color: "#9A9A9A",
              fontSize: 18,
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            SKU: {sku}
          </div>

          {/* ESPR badge */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(0,51,153,0.2)",
                border: "1px solid rgba(0,51,153,0.5)",
                borderRadius: 8,
                padding: "8px 16px",
              }}
            >
              {/* EU stars circle */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#003399",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFD700",
                  fontSize: 12,
                }}
              >
                ★
              </div>
              <div
                style={{
                  color: "#FAFAF7",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ESPR-ready 2027
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(122,139,117,0.15)",
                border: "1px solid rgba(122,139,117,0.35)",
                borderRadius: 8,
                padding: "8px 16px",
              }}
            >
              <div
                style={{
                  color: "#7A8B75",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                GS1 Digital Link
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 20,
            borderTop: "1px solid",
            borderColor: "#C29E5F",
          }}
        >
          <div
            style={{
              color: "#9A9A9A",
              fontSize: 14,
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            tempo.style/passport/{sku}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fontData
        ? {
            fonts: [
              {
                name: "Playfair Display",
                data: fontData,
                style: "normal",
                weight: 700,
              },
            ],
          }
        : {}),
    }
  );
}
