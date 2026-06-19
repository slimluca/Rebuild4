import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CategoryDiscovery, GuideTemplate, PlatformTabs } from "@/components/Sections";
import { categories, getCategoryBySlug, getCategoryModelOptions, getModelsByCategory } from "@/lib/model-categories";
import {
  academyPage,
  breadcrumbSchema,
  faqSchema,
  globalFaqs,
  guidePages,
  getLiveModels,
  getVisitorGeoFromHeaders,
  legalPages,
  pageMetadata,
  siteUrl,
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
        "Risposte essenziali su 18+, privacy, guadagni, studio, iscrizione e sicurezza.",
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
    ...categories.map((category) => category.slug),
    "academy",
    "faq",
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    const visitorGeo = getVisitorGeoFromHeaders(await headers());
    const models = getModelsByCategory(
      slug,
      await getLiveModels(100, visitorGeo.country, visitorGeo.region, {
        ...getCategoryModelOptions(category),
        clientIp: visitorGeo.clientIp,
      })
    );
    const indexable = models.length >= category.minimumModelCount;

    return {
      title: category.metaTitle,
      description: category.metaDescription,
      alternates: { canonical: `${siteUrl}${category.canonicalPath}` },
      robots: {
        index: indexable,
        follow: true,
      },
      openGraph: {
        title: category.metaTitle,
        description: category.metaDescription,
        url: `${siteUrl}${category.canonicalPath}`,
        siteName: "Modelle Webcam",
        locale: "it_IT",
        type: "website",
      },
    };
  }

  const page = findPage(slug);
  if (!page) return {};
  return pageMetadata(page);
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    const visitorGeo = getVisitorGeoFromHeaders(await headers());
    const models = getModelsByCategory(
      slug,
      await getLiveModels(100, visitorGeo.country, visitorGeo.region, {
        ...getCategoryModelOptions(category),
        clientIp: visitorGeo.clientIp,
      })
    );

    return (
      <main>
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Modelle webcam online", path: "/modelle-webcam/" },
            { name: category.title, path: category.canonicalPath },
          ])}
        />
        <PlatformTabs />
        <CategoryDiscovery category={category} models={models} />
      </main>
    );
  }

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
