import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { GuideTemplate } from "@/components/Sections";
import {
  academyPage,
  breadcrumbSchema,
  faqSchema,
  globalFaqs,
  guidePages,
  legalPages,
  pageMetadata,
  type GuidePage,
} from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

function findPage(slug: string): GuidePage | undefined {
  if (slug === "academy") return academyPage;
  if (slug === "faq") {
    return {
      slug: "faq",
      title: "FAQ Modelle Webcam",
      description:
        "Risposte rapide su 18+, privacy, guadagni, studio, iscrizione e sicurezza.",
      eyebrow: "FAQ",
      intro:
        "Domande essenziali per usare la piattaforma e valutare il percorso creator con controllo.",
      sections: [
        {
          title: "Prima di iniziare",
          body: "Prima controlla età, privacy, studio, confini e aspettative. Poi scegli il prossimo passo.",
        },
      ],
      faqs: globalFaqs,
    };
  }
  return guidePages[slug] ?? legalPages[slug];
}

export async function generateStaticParams() {
  return [
    ...Object.keys(guidePages),
    ...Object.keys(legalPages),
    "academy",
    "faq",
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  return pageMetadata(page);
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: page.title, path: `/${page.slug}/` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {page.faqs ? <JsonLd data={faqSchema(page.faqs)} /> : null}
      <GuideTemplate page={page} />
    </>
  );
}
