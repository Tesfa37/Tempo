import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { VoiceLayer } from "@/components/voice/VoiceLayer";
import { GuestPointsTracker } from "@/components/points/GuestPointsTracker";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildOrganization } from "@/lib/structured-data";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tempo.style"),
  title: "Tempo, Clothes that move at your pace",
  description:
    "Tempo is a sustainable adaptive fashion brand. Adaptive-first design, GOTS-certified materials, Digital Product Passports, and a Caregiver-First shopping experience.",
  keywords: [
    "adaptive clothing",
    "disability fashion",
    "sustainable adaptive wear",
    "wheelchair clothing",
    "post-stroke clothing",
    "caregiver fashion",
  ],
  openGraph: {
    title: "Tempo, Clothes that move at your pace",
    description:
      "Adaptive fashion built with disabled advisors. Sustainable materials, Digital Product Passports, Caregiver Mode.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tempo, Clothes that move at your pace",
    description:
      "Adaptive fashion built with disabled advisors. Sustainable materials, Digital Product Passports, Caregiver Mode.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#E8DFD2] text-[#1A1A1A] antialiased">
        <StructuredData data={buildOrganization()} />
        <Header isAuthed={!!user} />
        <main>{children}</main>
        <Footer />
        <VoiceLayer />
        <Toaster position="bottom-right" richColors={false} />
        <GuestPointsTracker />
      </body>
    </html>
  );
}
