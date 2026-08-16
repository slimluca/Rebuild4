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
  title: "Modelle webcam live online con profili e categorie",
  description:
    "Scopri modelle webcam online con anteprime live, profili HD, nuove camgirl e categorie aggiornate per trovare stanze disponibili in modo rapido e discreto.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Modelle webcam live online con profili e categorie",
    description:
      "Scopri modelle webcam online con anteprime live, profili HD, nuove camgirl e categorie aggiornate per trovare stanze disponibili in modo rapido e discreto.",
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
