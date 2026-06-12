import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { FilterBar, ModelDiscovery, PlatformTabs } from "@/components/Sections";
import { breadcrumbSchema, getLiveModels, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Modelle webcam online",
  description:
    "Sfoglia modelle webcam online in un'interfaccia premium 18+ con filtri visivi, preview live e percorsi interni.",
  alternates: { canonical: `${siteUrl}/modelle-webcam/` },
};

export default async function ModelleWebcamPage() {
  const models = await getLiveModels();

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
        <FilterBar compact />
        <Link className="btn btn-primary" href="/go/live">
          Entra live
        </Link>
      </section>
      <ModelDiscovery models={models} page />
    </main>
  );
}
