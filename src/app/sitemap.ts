import type { MetadataRoute } from "next";
import { getSitemapCategoryPaths } from "@/lib/model-categories";
import { siteUrl } from "@/lib/site";

const creatorGuidePaths = [
  "/diventare-webcam-model/",
  "/diventare-camgirl/",
  "/lavorare-in-webcam/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
  "/guadagni-webcam-model/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...getSitemapCategoryPaths(), ...creatorGuidePaths];
  return Array.from(new Set(paths)).map((path) => ({ url: `${siteUrl}${path}` }));
}
