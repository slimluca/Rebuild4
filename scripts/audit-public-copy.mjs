import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = new URL(process.argv[2] || process.env.COPY_AUDIT_BASE_URL || "http://127.0.0.1:3000");
const strategicPaths = [
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
const forbidden = [
  /il selezione/i,
  /informazioni ricevuti/i,
  /l(?:\u00e2\u20ac\u2122|')disponibilit\u00c3(?:\u00a0|\s)/i,
  /\bfeed\b/i,
  /\bmetadati\b/i,
  /\binventario\b/i,
  /\bsorgente\b/i,
  /\bAPI\b/i,
  /\bSEO\b/i,
  /\baffiliate\b/i,
  /\bcommission\b/i,
  /\btracking\b/i,
  /\bmonetization\b/i,
  /\bplaceholder\b/i,
  /coming soon/i,
  /lorem ipsum/i,
  /\bAWE\b/i,
];
const failures = [];

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:#x27|#39);/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
}

const removedRuntimeIdentifier = ["public", "Info", "Copy"].join("");
const ignoredDirectories = new Set([".git", ".next", "node_modules"]);

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) files.push(...(await sourceFiles(target)));
    else if (entry.isFile() && /\.(?:ts|tsx|js|jsx|mjs|md|json)$/.test(entry.name)) files.push(target);
  }
  return files;
}

for (const file of await sourceFiles(path.resolve("."))) {
  if ((await readFile(file, "utf8")).includes(removedRuntimeIdentifier)) {
    failures.push(`${file} still contains the removed runtime copy rewriter`);
  }
}

for (const route of strategicPaths) {
  const response = await fetch(new URL(route, baseUrl));
  if (response.status !== 200) {
    failures.push(`${route} returned ${response.status}`);
    continue;
  }
  const text = visibleText(await response.text());
  for (const pattern of forbidden) {
    if (pattern.test(text)) failures.push(`${route} renders forbidden copy matching ${pattern}`);
  }
}

if (failures.length) {
  console.error(`Public copy audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Public copy audit passed for ${strategicPaths.length} strategic pages at ${baseUrl.origin}`);
