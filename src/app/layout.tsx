import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn(inter.variable, playfair.variable, "font-sans", geist.variable)}>
      <body className="bg-sand text-charcoal antialiased">{children}</body>
    </html>
  );
}
