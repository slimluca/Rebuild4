import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { brand, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Modelle Webcam Italia | Live e Creator Platform 18+",
    template: `%s | ${brand}`,
  },
  description:
    "Piattaforma italiana 18+ per modelle live, discovery premium e candidatura creator con privacy, setup e aspettative realistiche.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Modelle Webcam Italia | Live e Creator Platform 18+",
    description:
      "Discovery premium, modelle live e candidatura creator in un'interfaccia 18+ moderna.",
    url: siteUrl,
    siteName: brand,
    locale: "it_IT",
    type: "website",
    images: [{ url: "/images/modelle-webcam-hero.jpg", width: 1200, height: 630, alt: brand }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: siteUrl,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand,
    url: siteUrl,
    inLanguage: "it-IT",
  };

  return (
    <html lang="it" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <JsonLd data={organization} />
        <JsonLd data={website} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
