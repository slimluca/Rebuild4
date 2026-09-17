import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const recoverySitemapPaths = [
  "/",
  "/modelle-webcam/",
  "/modelle-hd/",
  "/nuove-modelle-webcam/",
  "/modelle-tattoo/",
  "/modelle-prosperose/",
  "/modelle-italiane/",
  "/diventare-webcam-model/",
  "/diventare-camgirl/",
  "/lavorare-in-webcam/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
  "/guadagni-webcam-model/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return recoverySitemapPaths.map((path) => ({ url: `${siteUrl}${path}` }));
}
