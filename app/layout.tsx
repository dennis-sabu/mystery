
import type { Metadata } from "next";
import { Inter, Outfit, Syne, Archivo_Black } from "next/font/google"; // Removed Press_Start_2P/Permanent_Marker if not strictly needed, or kept for templates. keeping for now.
import { Press_Start_2P, Permanent_Marker } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo" });

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});
const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});

export const metadata: Metadata = {
  title: "New Year 2026 | Gen-Z Edition",
  description: "Send a vibey New Year greeting. No cringe allowed.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${syne.variable} ${archivoBlack.variable} ${pressStart.variable} ${permanentMarker.variable} font-sans antialiased bg-[#050505] text-[#F5F5F5] selection:bg-[#FF007A] selection:text-white overflow-x-hidden`}
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
