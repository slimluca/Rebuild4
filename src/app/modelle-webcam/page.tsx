import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  AvailabilityPulse,
  CategoryChips,
  CreatorBridge,
  HubCategoryRails,
  MatchFinder,
  ModelDiscovery,
  PlatformTabs,
} from "@/components/Sections";
import { breadcrumbSchema, getLiveModels, getVisitorGeoFromHeaders, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Modelle webcam online",
  description:
    "Sfoglia modelle webcam online in un'interfaccia premium 18+ con filtri visivi, preview live e percorsi interni.",
  alternates: { canonical: `${siteUrl}/modelle-webcam/` },
};

export default async function ModelleWebcamPage() {
  const visitorGeo = getVisitorGeoFromHeaders(await headers());
  const models = await getLiveModels(100, visitorGeo.country, visitorGeo.region, { gender: "f", clientIp: visitorGeo.clientIp });

  return (
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
          <p className="eyebrow">Browser live</p>
          <h1>Modelle webcam online</h1>
        </div>
        <CategoryChips />
        <Link className="btn btn-primary" href="/go/live">
          Entra live
        </Link>
      </section>
      <HubCategoryRails />
      <MatchFinder />
      <AvailabilityPulse />
      <ModelDiscovery models={models} page showCategories />
      <CreatorBridge />
    </main>
  );
}
