import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Match-Set Builder, Tempo Adaptive Fashion";

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

export default async function Image() {
  const fontData = await loadPlayfair();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#E8DFD2",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative paired rectangles - top/bottom pairing motif */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 64,
            display: "flex",
            gap: 16,
            opacity: 0.15,
          }}
        >
          <div
            style={{
              width: 120,
              height: 320,
              backgroundColor: "#C29E5F",
              borderRadius: 12,
            }}
          />
          <div
            style={{
              width: 120,
              height: 320,
              backgroundColor: "#7A8B75",
              borderRadius: 12,
              marginTop: 40,
            }}
          />
        </div>

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
              color: "#C29E5F",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            MATCH-SET BUILDER
          </div>
          <div
            style={{
              color: "#1A1A1A",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: fontData ? "Playfair Display" : "Georgia, serif",
              maxWidth: 640,
            }}
          >
            Build a set that works together.
          </div>
          <div
            style={{
              color: "#5A5A5A",
              fontSize: 20,
              lineHeight: 1.5,
              fontFamily: "Arial, sans-serif",
              maxWidth: 540,
            }}
          >
            Adaptive compatibility scoring pairs tops and bottoms by shared
            features and complementary closures.
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
            borderColor: "#D4C9BA",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#1A1A1A",
              borderRadius: 6,
              padding: "6px 14px",
            }}
          >
            <div
              style={{
                color: "#C29E5F",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Arial, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Adaptive pairing
            </div>
          </div>
          <div
            style={{
              color: "#9A9A9A",
              fontSize: 14,
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            tempo.style/style/build
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
