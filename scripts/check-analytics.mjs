import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return /\.(?:ts|tsx)$/.test(entry.name) ? [target] : [];
    })
  );
  return files.flat();
}

const component = await readFile("src/components/GoogleAnalytics.tsx", "utf8");
const layout = await readFile("src/app/layout.tsx", "utf8");
const source = `${component}\n${layout}`;
const applicationSource = (await Promise.all((await sourceFiles("src")).map((file) => readFile(file, "utf8")))).join("\n");

assert.match(component, /next\/script/, "GA4 must use Next.js Script handling");
assert.match(layout, /process\.env\.NEXT_PUBLIC_GA_MEASUREMENT_ID/, "GA4 must use the public measurement-ID environment variable");
assert.equal((applicationSource.match(/googletagmanager\.com\/gtag\/js/g) ?? []).length, 1, "GA4 script must be loaded once across the application");
assert.equal((applicationSource.match(/gtag\('config'/g) ?? []).length, 1, "GA4 must be configured once across the application");
assert.equal((source.match(/NEXT_PUBLIC_GA_MEASUREMENT_ID/g) ?? []).length, 1, "The measurement-ID variable must have one application use");
assert.doesNotMatch(applicationSource, /G-[A-Z0-9]{6,}/, "A measurement ID must not be hardcoded in application source");
assert.doesNotMatch(source, /email|username|performerId|clientIp/i, "GA4 source must not include personal-data parameters");

console.log("Analytics implementation check passed");
