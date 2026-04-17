import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/data/products";
import { products } from "@/data/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return [
    {
      id: slug,
      alt: product
        ? `${product.name} by Tempo Adaptive Fashion`
        : "Tempo Adaptive Fashion",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const fontData = await loadPlayfair();

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            backgroundColor: "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FAFAF7",
            fontFamily: "Georgia, serif",
            fontSize: 40,
          }}
        >
          Tempo
        </div>
      ),
      { ...size }
    );
  }

  const feature = product.adaptiveFeatures[0];

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
        {/* Decorative arc */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#C29E5F",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "#C29E5F",
            opacity: 0.09,
          }}
        />

        {/* Header row: wordmark + "new" badge if applicable */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
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
          {product.isNew && (
            <div
              style={{
                backgroundColor: "#7A8B75",
                color: "#FAFAF7",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 20,
                fontFamily: "Arial, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              NEW
            </div>
          )}
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
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {product.category.toUpperCase()}
          </div>

          <div
            style={{
              color: "#FAFAF7",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: fontData ? "Playfair Display" : "Georgia, serif",
              maxWidth: 700,
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              color: "#C29E5F",
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
            }}
          >
            ${product.price}
          </div>

          {feature && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                backgroundColor: "rgba(194,158,95,0.12)",
                border: "1px solid rgba(194,158,95,0.3)",
                borderRadius: 8,
                padding: "10px 18px",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  color: "#C29E5F",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {feature.name}
              </div>
              <div
                style={{
                  color: "#9A9A9A",
                  fontSize: 14,
                  fontFamily: "Arial, sans-serif",
                  maxWidth: 380,
                  overflow: "hidden",
                }}
              >
                — {feature.description}
              </div>
            </div>
          )}
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
            tempo.style/shop/{product.slug}
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
