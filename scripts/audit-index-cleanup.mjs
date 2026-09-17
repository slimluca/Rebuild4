const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const pages = [
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

const secondaryPages = ["/modelle-popolari/", "/modelle-bionde/", "/modelle-brune/", "/modelle-asiatiche/", "/modelle-curvy/"];

const failures = [];

for (const path of pages) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  const robots = response.headers.get("x-robots-tag") || "";
  if (response.status !== 200) failures.push(`${path} returned ${response.status}`);
  if (/noindex/i.test(robots)) failures.push(`${path} has noindex header`);
}

for (const path of secondaryPages) {
  const response = await fetch(new URL(path, baseUrl));
  const html = await response.text();
  if (response.status !== 200) failures.push(`${path} returned ${response.status}`);
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) failures.push(`${path} is missing noindex`);
}

const onlineResponse = await fetch(new URL("/modelle-online-ora/", baseUrl), { redirect: "manual" });
if (onlineResponse.status !== 308) failures.push(`/modelle-online-ora/ should return 308, got ${onlineResponse.status}`);

const goResponse = await fetch(new URL("/go/live", baseUrl), { redirect: "manual" });
const goRobots = goResponse.headers.get("x-robots-tag") || "";
if (!/noindex/i.test(goRobots) || !/nofollow/i.test(goRobots)) {
  failures.push("/go/live is missing X-Robots-Tag noindex, nofollow");
}

const sitemap = await (await fetch(new URL("/sitemap.xml", baseUrl))).text();
if (sitemap.includes("www.modellewebcam.com")) failures.push("sitemap contains www URLs");
if (sitemap.includes("/go/")) failures.push("sitemap contains /go URLs");

if (failures.length) {
  console.error(`Index cleanup audit failed for ${baseUrl}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Index cleanup audit passed for ${baseUrl}`);
