import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const body = Inter_Tight({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krishnendu Dhar | Founder & Builder",
  description:
    "Portfolio of Krishnendu Dhar, a founder and builder from Kolkata making AI products, startups and fun experiments.",
};

export const viewport: Viewport = { themeColor: "#ECE9E2" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${serif.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
