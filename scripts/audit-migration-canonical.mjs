const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

const publicPages = [
  "/",
  "/modelle-webcam/",
  "/modelle-online-ora/",
  "/modelle-hd/",
  "/diventare-webcam-model/",
  "/privacy-webcam-model/",
];

const redirectChecks = [
  { path: "/modelle-webcam", target: "/modelle-webcam/" },
  { path: "/tag/modelle-hd", target: "/modelle-hd/" },
  { path: "/category/diventare-webcam-model", target: "/diventare-webcam-model/" },
  { path: "/2024/05/modelle-webcam-hd", target: "/modelle-hd/" },
  { path: "/page/2", target: "/modelle-webcam/" },
];

const failures = [];

function absolute(path) {
  return new URL(path, baseUrl).toString();
}

function sameTarget(location, expectedPath) {
  if (!location) return false;
  const target = new URL(location, baseUrl);
  return target.pathname === expectedPath;
}

async function request(path, init = {}) {
  return fetch(absolute(path), init);
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function assertFinalOk(path) {
  const response = await request(path);
  assert(response.status === 200, `${path} should resolve to 200 after redirects, got ${response.status}`);
}

for (const path of publicPages) {
  const response = await request(path, { redirect: "manual" });
  assert(response.status === 200, `${path} should return 200, got ${response.status}`);
  const robots = response.headers.get("x-robots-tag") || "";
  assert(!/noindex/i.test(robots), `${path} should not have noindex header`);
}

for (const path of ["/go/live", "/go/model-signup"]) {
  const response = await request(path, { redirect: "manual" });
  assert(response.status >= 300 && response.status < 400, `${path} should redirect, got ${response.status}`);
  const robots = response.headers.get("x-robots-tag") || "";
  assert(/noindex/i.test(robots) && /nofollow/i.test(robots), `${path} should include X-Robots-Tag noindex, nofollow`);
}

const sitemapResponse = await request("/sitemap.xml");
assert(sitemapResponse.status === 200, `/sitemap.xml should return 200, got ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const locMatches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert(locMatches.length > 0, "sitemap should contain URLs");
assert(locMatches.every((url) => url.startsWith("https://modellewebcam.com/")), "sitemap should contain only https://modellewebcam.com URLs");
assert(!sitemap.includes("www.modellewebcam.com"), "sitemap should not contain www URLs");
assert(!sitemap.includes("/go/"), "sitemap should not contain /go URLs");

const robotsResponse = await request("/robots.txt");
assert(robotsResponse.status === 200, `/robots.txt should return 200, got ${robotsResponse.status}`);
const robotsText = await robotsResponse.text();
assert(robotsText.includes("User-Agent: *") || robotsText.includes("User-agent: *"), "robots.txt should include user-agent");
assert(robotsText.includes("Allow: /"), "robots.txt should allow /");
assert(robotsText.includes("Disallow: /go/"), "robots.txt should disallow /go/");
assert(robotsText.includes("Sitemap: https://modellewebcam.com/sitemap.xml"), "robots.txt should point at the canonical sitemap");
assert(!robotsText.includes("www.modellewebcam.com"), "robots.txt should not include www");

const wpLogin = await request("/wp-login.php", { redirect: "manual" });
assert(wpLogin.status === 410, `/wp-login.php should return 410, got ${wpLogin.status}`);
const wpRobots = wpLogin.headers.get("x-robots-tag") || "";
assert(/noindex/i.test(wpRobots) && /nofollow/i.test(wpRobots), "/wp-login.php should include X-Robots-Tag noindex, nofollow");

for (const check of redirectChecks) {
  const response = await request(check.path, { redirect: "manual" });
  assert(response.status === 308 || response.status === 301, `${check.path} should redirect permanently, got ${response.status}`);
  assert(sameTarget(response.headers.get("location"), check.target), `${check.path} should redirect to ${check.target}`);
  await assertFinalOk(check.target);
}

if (failures.length) {
  console.error(`Migration canonical audit failed for ${baseUrl}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Migration canonical audit passed for ${baseUrl}`);
console.log(`Sitemap URL count: ${locMatches.length}`);
console.log("No www URLs in sitemap: yes");
console.log("No /go URLs in sitemap: yes");
