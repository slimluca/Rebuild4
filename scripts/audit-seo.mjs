const baseUrl = new URL(process.argv[2] || process.env.SEO_AUDIT_BASE_URL || "http://localhost:3000");
const canonicalOrigin = "https://modellewebcam.com";

const categoryPaths = [
  "/modelle-online-ora/",
  "/modelle-hd/",
  "/nuove-modelle-webcam/",
  "/modelle-popolari/",
  "/modelle-webcam/",
  "/modelle-italiane/",
  "/modelle-asiatiche/",
  "/modelle-europee/",
  "/modelle-mature/",
  "/modelle-bionde/",
  "/modelle-brune/",
  "/modelle-rosse/",
  "/modelle-tattoo/",
  "/modelle-curvy/",
  "/modelle-prosperose/",
  "/modelle-lingerie/",
  "/modelle-trans/",
  "/coppie-webcam/",
  "/modelle-private/",
];

const guidePaths = [
  "/diventare-webcam-model/",
  "/diventare-camgirl/",
  "/lavorare-in-webcam/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
  "/guadagni-webcam-model/",
];

const indexablePaths = ["/", ...categoryPaths, ...guidePaths];
const explicitPaths = new Set(["/", ...categoryPaths]);
const informationalPaths = [...guidePaths, "/academy/", "/faq/", "/privacy-policy/", "/termini/", "/disclaimer/", "/contatti/"];
const priorityPaths = indexablePaths;
const forbiddenPublicTerms = [
  "feed",
  "metadati",
  "inventario",
  "sorgente",
  " api ",
  " seo ",
  "affiliate",
  "commission",
  "tracking",
  "monetization",
  "placeholder",
  "coming soon",
  "lorem ipsum",
  "awe",
];

const failures = [];
const titles = new Map();
const descriptions = new Map();
const fetched = new Map();

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

function metaContent(html, name) {
  const tags = matches(html, /<meta\b[^>]*>/gi).map((match) => match[0]);
  const tag = tags.find((item) => new RegExp(`\\bname=["']${name}["']`, "i").test(item));
  return tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || "";
}

function visibleText(html) {
  return decodeHtml(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  ).toLowerCase();
}

async function request(path, options = {}) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual", ...options });
  return response;
}

async function fetchHtml(path) {
  if (fetched.has(path)) return fetched.get(path);
  const response = await request(path);
  const html = await response.text();
  const result = { response, html };
  fetched.set(path, result);
  return result;
}

for (const path of indexablePaths) {
  const { response, html } = await fetchHtml(path);
  assert(response.status === 200, `${path} should return 200, got ${response.status}`);

  const h1s = matches(html, /<h1\b[^>]*>[\s\S]*?<\/h1>/gi);
  const titleTags = matches(html, /<title\b[^>]*>([\s\S]*?)<\/title>/gi);
  const descriptionTags = matches(html, /<meta\b[^>]*\bname=["']description["'][^>]*>/gi);
  const canonicalTags = matches(html, /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi);
  const title = decodeHtml(titleTags[0]?.[1]?.trim() || "");
  const description = decodeHtml(descriptionTags[0]?.[0]?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || "");
  const canonical = canonicalTags[0]?.[0]?.match(/\bhref=["']([^"']*)["']/i)?.[1] || "";
  const expectedCanonical = `${canonicalOrigin}${path}`;
  const robots = metaContent(html, "robots").toLowerCase();
  const rating = metaContent(html, "rating").toLowerCase();

  assert(h1s.length === 1, `${path} should have exactly one H1, got ${h1s.length}`);
  assert(titleTags.length === 1, `${path} should have exactly one title tag, got ${titleTags.length}`);
  assert(descriptionTags.length === 1, `${path} should have exactly one meta description, got ${descriptionTags.length}`);
  assert(canonicalTags.length === 1, `${path} should have exactly one canonical, got ${canonicalTags.length}`);
  assert(Boolean(title), `${path} has an empty title`);
  assert(Boolean(description), `${path} has an empty description`);
  assert(canonical === expectedCanonical, `${path} canonical should be ${expectedCanonical}, got ${canonical}`);
  assert(canonical.startsWith("https://"), `${path} canonical is not HTTPS`);
  assert(!canonical.includes("www."), `${path} canonical contains www`);
  assert(!canonical.includes("localhost") && !canonical.includes("127.0.0.1"), `${path} canonical contains a local host`);
  assert(!robots.includes("noindex"), `${path} is unexpectedly noindex`);
  assert(!title.toLowerCase().includes("modellewebcam.com"), `${path} title contains the domain`);
  assert(!description.toLowerCase().includes("modellewebcam.com"), `${path} description contains the domain`);
  assert(!title.includes("|"), `${path} title contains a pipe`);
  assert(rating === (explicitPaths.has(path) ? "adult" : ""), `${path} has incorrect adult rating metadata`);

  if (titles.has(title)) failures.push(`${path} duplicates title from ${titles.get(title)}`);
  else titles.set(title, path);
  if (descriptions.has(description)) failures.push(`${path} duplicates description from ${descriptions.get(description)}`);
  else descriptions.set(description, path);

  for (const block of matches(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch {
      failures.push(`${path} contains invalid structured data`);
    }
  }
}

for (const path of informationalPaths) {
  const { html } = await fetchHtml(path);
  assert(metaContent(html, "rating") === "", `${path} should not have adult rating metadata`);
}

for (const path of priorityPaths) {
  const { html } = await fetchHtml(path);
  const text = ` ${visibleText(html)} `;
  for (const term of forbiddenPublicTerms) {
    assert(!text.includes(term), `${path} renders forbidden public term: ${term.trim()}`);
  }
}

const sitemapResponseOne = await request("/sitemap.xml");
const sitemapOne = await sitemapResponseOne.text();
const sitemapResponseTwo = await request("/sitemap.xml");
const sitemapTwo = await sitemapResponseTwo.text();
assert(sitemapResponseOne.status === 200, `/sitemap.xml should return 200, got ${sitemapResponseOne.status}`);
assert(sitemapOne === sitemapTwo, "sitemap is not stable between consecutive fetches");
const sitemapUrls = matches(sitemapOne, /<loc>(.*?)<\/loc>/g).map((match) => decodeHtml(match[1]));
assert(sitemapUrls.length === new Set(sitemapUrls).size, "sitemap contains duplicate URLs");
assert(sitemapUrls.length === indexablePaths.length, `sitemap should contain ${indexablePaths.length} URLs, got ${sitemapUrls.length}`);
for (const url of sitemapUrls) {
  assert(url.startsWith(`${canonicalOrigin}/`) || url === canonicalOrigin, `sitemap contains a noncanonical URL: ${url}`);
  assert(!url.startsWith("http://"), `sitemap contains an HTTP URL: ${url}`);
  assert(!url.includes("www."), `sitemap contains a www URL: ${url}`);
  assert(!url.includes("/go/"), `sitemap contains a go route: ${url}`);
  assert(!url.includes("localhost") && !url.includes("vercel.app"), `sitemap contains a preview URL: ${url}`);
  const path = new URL(url).pathname;
  const { response, html } = await fetchHtml(path);
  assert(response.status === 200, `sitemap URL redirects or fails: ${path} returned ${response.status}`);
  assert(!metaContent(html, "robots").toLowerCase().includes("noindex"), `sitemap contains noindex URL: ${path}`);
}

const robotsResponse = await request("/robots.txt");
const robotsText = await robotsResponse.text();
assert(robotsResponse.status === 200, `/robots.txt should return 200, got ${robotsResponse.status}`);
assert(robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), "robots.txt does not point to the canonical sitemap");
assert(robotsText.includes("Disallow: /go/"), "robots.txt does not protect go routes");

const internalLinks = new Set();
for (const { html } of fetched.values()) {
  for (const match of matches(html, /<a\b[^>]*\bhref=["']([^"'#?]+)[^"']*["']/gi)) {
    const href = decodeHtml(match[1]);
    if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next/") && !href.startsWith("/go/")) internalLinks.add(href);
  }
}
for (const href of internalLinks) {
  const response = await request(href);
  assert(response.status === 200, `internal link ${href} returned ${response.status}`);
}

const goResponse = await request("/go/live");
assert(/noindex/i.test(goResponse.headers.get("x-robots-tag") || ""), "/go/live should return an X-Robots-Tag noindex header");

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO audit passed for ${indexablePaths.length} indexable pages at ${baseUrl.origin}`);
console.log(`Sitemap URLs: ${sitemapUrls.length}`);
console.log(`Internal links checked: ${internalLinks.size}`);
