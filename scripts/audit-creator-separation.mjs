import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3100";
const creatorPaths = [
  "/diventare-webcam-model/",
  "/diventare-camgirl/",
  "/lavorare-in-webcam/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
  "/guadagni-webcam-model/",
];
const viewerPaths = [
  "/",
  "/modelle-webcam/",
  "/modelle-hd/",
  "/nuove-modelle-webcam/",
  "/modelle-tattoo/",
  "/modelle-prosperose/",
  "/modelle-italiane/",
];
const sitemapPaths = [...viewerPaths, ...creatorPaths];
const forbiddenCreatorDestinations = new Set(viewerPaths);
const creatorDestinations = new Set(creatorPaths);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const path of creatorPaths) {
  const response = await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} should return 200`);
  assert.equal(await page.locator('meta[name="rating"]').count(), 0, `${path} must not have adult rating metadata`);
  assert.equal(await page.locator(".model-card").count(), 0, `${path} must not render model cards`);
  assert.equal(await page.locator("main img").count(), 0, `${path} must not render performer imagery`);
  assert.equal(await page.locator('.friend-sites, nav[aria-label="Siti amici"]').count(), 0, `${path} must not render Siti amici`);
  assert.equal(await page.locator(".viewer-header, .viewer-footer, .platform-tabs").count(), 0, `${path} renders viewer chrome`);
  assert.equal(await page.locator(".creator-header").count(), 1, `${path} is missing the creator header`);
  assert.equal(await page.locator(".creator-footer").count(), 1, `${path} is missing the creator footer`);
  assert.equal(await page.locator(".creator-nav a").count(), 6, `${path} should render six desktop creator links`);
  assert.equal(await page.locator(".creator-mobile-nav a").count(), 6, `${path} should render six mobile creator links`);

  const internalHrefs = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  const forbidden = internalHrefs.filter((href) => href && forbiddenCreatorDestinations.has(new URL(href, "https://modellewebcam.com").pathname));
  assert.deepEqual(forbidden, [], `${path} links to viewer destinations: ${forbidden.join(", ")}`);

  const contextualCreatorLinks = new Set(
    (await page.locator('main a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href"))))
      .map((href) => href && new URL(href, "https://modellewebcam.com").pathname)
      .filter((href) => href && href !== path && creatorDestinations.has(href))
  );
  assert(contextualCreatorLinks.size >= 3, `${path} should link to at least three other creator guides`);
}

for (const path of viewerPaths) {
  const response = await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, `${path} should return 200`);
  assert.equal(await page.locator('meta[name="rating"][content="adult"]').count(), 1, `${path} should retain adult rating metadata`);
  assert.equal(await page.locator(".viewer-header").count(), 1, `${path} is missing the viewer header`);
  assert.equal(await page.locator(".viewer-footer").count(), 1, `${path} is missing the viewer footer`);
  assert.equal(await page.locator(".creator-header, .creator-footer").count(), 0, `${path} renders creator-only chrome`);
  assert.equal(await page.locator('nav[aria-label="Siti amici"] a').count(), 6, `${path} should retain six Siti amici links`);
}

await page.goto(new URL("/", baseUrl).toString(), { waitUntil: "networkidle" });
const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
const organization = jsonLd
  .map((value) => {
    try { return JSON.parse(value); } catch { return null; }
  })
  .find((value) => value?.["@type"] === "Organization");
assert.deepEqual(organization, {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Modelle Webcam",
  url: "https://modellewebcam.com",
  logo: "https://modellewebcam.com/images/modelle-webcam-logo.png",
});

const sitemapXml = await (await fetch(new URL("/sitemap.xml", baseUrl))).text();
const actualSitemapPaths = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
assert.deepEqual(actualSitemapPaths, sitemapPaths, "The strategic sitemap changed");
assert.equal(new Set(actualSitemapPaths).size, 13, "The sitemap contains duplicates");

const consolidated = await fetch(new URL("/modelle-online-ora/", baseUrl), { redirect: "manual" });
assert.equal(consolidated.status, 308, "/modelle-online-ora/ should return 308");
const consolidatedTarget = new URL(consolidated.headers.get("location"), baseUrl);
assert.equal(consolidatedTarget.pathname + consolidatedTarget.hash, "/modelle-webcam/#online");

await browser.close();
console.log(`Creator separation audit passed for ${creatorPaths.length} creator pages and ${viewerPaths.length} viewer pages`);
console.log("Creator metadata, navigation, footer, imagery, links, Organization logo, sitemap, and consolidation redirect: passed");
