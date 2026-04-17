import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VoiceLayer } from "@/components/voice/VoiceLayer";
import { GuestPointsTracker } from "@/components/points/GuestPointsTracker";
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
  title: "Tempo — Clothes that move at your pace",
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
    title: "Tempo — Clothes that move at your pace",
    description:
      "Adaptive fashion built with disabled advisors. Sustainable materials, Digital Product Passports, Caregiver Mode.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#E8DFD2] text-[#1A1A1A] antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <VoiceLayer />
        <Toaster position="bottom-right" richColors={false} />
        <GuestPointsTracker />
      </body>
    </html>
  );
}
