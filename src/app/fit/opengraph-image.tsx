import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI Virtual Fitting, Tempo Adaptive Fashion";

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
        {/* Decorative circle — camera lens motif */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 640,
            height: 640,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#C29E5F",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 440,
            height: 440,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#C29E5F",
            opacity: 0.08,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#C29E5F",
            opacity: 0.06,
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
              color: "#C29E5F",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            AI VIRTUAL FITTING
          </div>
          <div
            style={{
              color: "#FAFAF7",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: fontData ? "Playfair Display" : "Georgia, serif",
              maxWidth: 680,
            }}
          >
            See it before you buy it.
          </div>
          <div
            style={{
              color: "#9A9A9A",
              fontSize: 20,
              lineHeight: 1.5,
              fontFamily: "Arial, sans-serif",
              maxWidth: 560,
            }}
          >
            Real-time garment preview. Wheelchair mode for seated proportions.
            Your camera never leaves your device.
          </div>
        </div>

        {/* Privacy badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: 20,
            borderTop: "1px solid",
            borderColor: "#2A2A2A",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#7A8B75",
              borderRadius: 6,
              padding: "6px 14px",
            }}
          >
            <div
              style={{
                color: "#FAFAF7",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Arial, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              On-device processing only
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
            tempo.style/fit
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
