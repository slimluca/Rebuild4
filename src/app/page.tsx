import { JsonLd } from "@/components/JsonLd";
import {
  EarningsConsole,
  FaqSection,
  FinalCta,
  Hero,
  ModelDiscovery,
  PlatformTabs,
  RecruitmentStrip,
  SafetyDashboard,
  SignupFlow,
} from "@/components/Sections";
import { breadcrumbSchema, faqSchema, getLiveModels, globalFaqs } from "@/lib/site";

export default async function Home() {
  const models = await getLiveModels();

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
      <JsonLd data={faqSchema(globalFaqs.slice(0, 4))} />
      <PlatformTabs />
      <Hero />
      <ModelDiscovery models={models} compact />
      <RecruitmentStrip />
      <SignupFlow />
      <SafetyDashboard />
      <EarningsConsole />
      <FaqSection faqs={globalFaqs.slice(0, 4)} />
      <FinalCta />
    </main>
  );
}
