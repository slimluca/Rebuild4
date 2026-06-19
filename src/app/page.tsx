import { headers } from "next/headers";
import { JsonLd } from "@/components/JsonLd";
import {
  CategoryChips,
  AvailabilityPulse,
  CreatorBridge,
  CreatorReadinessStrip,
  EarningsConsole,
  FaqSection,
  FinalCta,
  Hero,
  HomeCategoryRail,
  MatchFinder,
  ModelDiscovery,
  PlatformTabs,
  RecruitmentStrip,
  SafetyDashboard,
  StudioSetupStrip,
  SignupFlow,
} from "@/components/Sections";
import { breadcrumbSchema, faqSchema, getLiveModels, getVisitorGeoFromHeaders, globalFaqs } from "@/lib/site";

export default async function Home() {
  const visitorGeo = getVisitorGeoFromHeaders(await headers());
  const models = await getLiveModels(80, visitorGeo.country, visitorGeo.region, { gender: "f", clientIp: visitorGeo.clientIp });

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
      <JsonLd data={faqSchema(globalFaqs.slice(0, 4))} />
      <PlatformTabs />
      <Hero />
      <CategoryChips limit={8} />
      <HomeCategoryRail />
      <MatchFinder />
      <AvailabilityPulse />
      <ModelDiscovery models={models} compact />
      <CreatorBridge />
      <RecruitmentStrip />
      <CreatorReadinessStrip />
      <SignupFlow />
      <SafetyDashboard />
      <StudioSetupStrip />
      <EarningsConsole />
      <FaqSection faqs={globalFaqs.slice(0, 4)} />
      <FinalCta />
    </main>
  );
}
