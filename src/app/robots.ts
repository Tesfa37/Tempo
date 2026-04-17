import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account/", "/checkout/", "/cart/", "/login/"],
      },
    ],
    sitemap: "https://tempo.style/sitemap.xml",
  };
}
