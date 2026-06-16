import type { MetadataRoute } from "next";
import { getSitemapCategoryPaths } from "@/lib/model-categories";
import { allStaticPages, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = allStaticPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: page.path === "/" ? 1 : 0.75,
  }));

  const categoryEntries = getSitemapCategoryPaths().map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.72,
  }));

  return [...staticEntries, ...categoryEntries];
}
