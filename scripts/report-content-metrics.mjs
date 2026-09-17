const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3100";
const modelRoutes = [
  "/",
  "/modelle-webcam/",
  "/modelle-hd/",
  "/nuove-modelle-webcam/",
  "/modelle-tattoo/",
  "/modelle-prosperose/",
  "/modelle-italiane/",
];
const guideRoutes = [
  "/diventare-webcam-model/",
  "/diventare-camgirl/",
  "/lavorare-in-webcam/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
  "/guadagni-webcam-model/",
];

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:#x27|#39);/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

for (const route of modelRoutes) {
  const html = await (await fetch(new URL(route, baseUrl))).text();
  const count = [...html.matchAll(/class="model-card real"/g)].length;
  console.log(`models ${route} ${count}`);
}

for (const route of guideRoutes) {
  const html = await (await fetch(new URL(route, baseUrl))).text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const words = visibleText(main).split(/\s+/).filter(Boolean).length;
  console.log(`words ${route} ${words}`);
}
