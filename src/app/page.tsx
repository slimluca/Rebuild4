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

export default async function Home() {
  const visitorGeo = getVisitorGeoFromHeaders(await headers());
  const models = await getLiveModels(80, visitorGeo.country, visitorGeo.region, { gender: "f", clientIp: visitorGeo.clientIp });

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
      <PlatformTabs />
      <Hero />
      <ModelDiscovery models={models} compact />
      <HomeCategoryRail />
      <FullWidthInfoSection content={homeInfoSection} />
      <CreatorBridge />
      <AvailabilityPulse />
    </main>
  );
}
