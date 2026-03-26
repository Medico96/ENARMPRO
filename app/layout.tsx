import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ENARM Pro | Estudia Inteligente, No Memorices",
  description: "Plataforma de preparación ENARM basada en estrategia, palabras pivote y joyas. Simuladores realistas, flashcards inteligentes y GPC actualizadas DGMoSS 2026.",
  keywords: "ENARM, simulador ENARM, medicina, residencia médica, GPC, DGMoSS, palabras pivote",
  authors: [{ name: "ENARM Pro" }],
  openGraph: {
    title: "ENARM Pro | Estudia Inteligente, No Memorices",
    description: "La plataforma #1 para aspirantes ENARM. Metodología basada en palabras pivote y joyas.",
    type: "website",
    url: "https://enarmpro.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENARM Pro",
    description: "Plataforma de preparación ENARM con metodología estratégica",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
