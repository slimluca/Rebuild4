import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ViewerShell } from "@/components/SiteShell";
import {
  CreatorBridge,
  FullWidthInfoSection,
  ModelDiscovery,
  PlatformTabs,
} from "@/components/Sections";
import { webcamHubInfoSection } from "@/lib/info-sections";
import { breadcrumbSchema, getLiveModels, getVisitorGeoFromHeaders, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Modelle webcam online con profili live e categorie",
  description:
    "Sfoglia modelle webcam online con anteprime live, profili HD, nuove modelle, categorie popolari e filtri utili per trovare stanze disponibili.",
  alternates: { canonical: `${siteUrl}/modelle-webcam/` },
  other: { rating: "adult" },
  openGraph: {
    title: "Modelle webcam online con profili live e categorie",
    description: "Sfoglia modelle webcam online con anteprime live, profili HD, nuove modelle, categorie popolari e filtri utili per trovare stanze disponibili.",
    url: `${siteUrl}/modelle-webcam/`,
    siteName: "Modelle Webcam",
    locale: "it_IT",
    type: "website",
  },
};

export default async function ModelleWebcamPage() {
  const visitorGeo = getVisitorGeoFromHeaders(await headers());
  const models = await getLiveModels(100, visitorGeo.country, visitorGeo.region, { gender: "f", clientIp: visitorGeo.clientIp });

  return (
    <ViewerShell>
      <main>
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Modelle webcam online", path: "/modelle-webcam/" },
          ])}
        />
        <PlatformTabs />
        <section className="browse-hero">
          <div>
            <p className="eyebrow">Profili live</p>
            <h1>Modelle webcam online</h1>
          </div>
          <Link className="btn btn-primary" href="/go/live?track=mw_hub" prefetch={false}>
            Guarda modelle online
          </Link>
        </section>
        <ModelDiscovery models={models} track="mw_hub" page showCategories />
        <FullWidthInfoSection content={webcamHubInfoSection} />
        <CreatorBridge />
      </main>
    </ViewerShell>
  );
}
