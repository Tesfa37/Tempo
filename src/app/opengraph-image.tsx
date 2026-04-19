import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tempo, Clothes that move at your pace";

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
          backgroundColor: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative arc - top-right */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#C29E5F",
            opacity: 0.12,
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
            borderColor: "#C29E5F",
            opacity: 0.1,
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

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: "auto",
            gap: 24,
          }}
        >
          <div
            style={{
              color: "#C29E5F",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            ADAPTIVE FASHION
          </div>
          <div
            style={{
              color: "#FAFAF7",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: fontData ? "Playfair Display" : "Georgia, serif",
              maxWidth: 720,
            }}
          >
            Clothes that move at your pace.
          </div>
          <div
            style={{
              color: "#9A9A9A",
              fontSize: 22,
              lineHeight: 1.5,
              fontFamily: "Arial, sans-serif",
              maxWidth: 600,
            }}
          >
            Adaptive design, sustainable materials, and a Caregiver-First
            experience. Built with disabled advisors.
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
            tempo.style
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
