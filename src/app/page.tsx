import type { Metadata } from "next";
import { headers } from "next/headers";
import { JsonLd } from "@/components/JsonLd";
import {
  AvailabilityPulse,
  CreatorBridge,
  FullWidthInfoSection,
  Hero,
  HomeCategoryRail,
  ModelDiscovery,
  PlatformTabs,
} from "@/components/Sections";
import { homeInfoSection } from "@/lib/info-sections";
import { breadcrumbSchema, getLiveModels, getVisitorGeoFromHeaders } from "@/lib/site";

export const metadata: Metadata = {
  title: "Modelle webcam live online con profili e categorie",
  description: "Scopri modelle webcam online con anteprime live, profili HD, nuove camgirl e categorie aggiornate per trovare stanze disponibili in modo rapido e discreto.",
  alternates: { canonical: "https://modellewebcam.com" },
  other: { rating: "adult" },
  openGraph: {
    title: "Modelle webcam live online con profili e categorie",
    description: "Scopri modelle webcam online con anteprime live, profili HD, nuove camgirl e categorie aggiornate per trovare stanze disponibili in modo rapido e discreto.",
    url: "https://modellewebcam.com",
    siteName: "Modelle Webcam",
    locale: "it_IT",
    type: "website",
  },
};

export default async function Home() {
  const visitorGeo = getVisitorGeoFromHeaders(await headers());
  const models = await getLiveModels(80, visitorGeo.country, visitorGeo.region, { gender: "f", clientIp: visitorGeo.clientIp });

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
      <PlatformTabs />
      <Hero />
      <ModelDiscovery models={models} track="mw_home" compact />
      <HomeCategoryRail />
      <FullWidthInfoSection content={homeInfoSection} />
      <CreatorBridge />
      <AvailabilityPulse />
    </main>
  );
}
