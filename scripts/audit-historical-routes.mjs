import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3100";
const languages = ["pt", "pl", "tr", "fi", "en", "es", "zh", "no", "ja", "da", "us", "it", "ru", "sv", "fr", "ko", "nl", "de", "br"];
const statuses = {};

for (const language of languages) {
  const response = await fetch(new URL(`/${language}/`, baseUrl), { redirect: "manual" });
  assert(response.status < 500, `/${language}/ returned ${response.status}`);
  statuses[response.status] = (statuses[response.status] || 0) + 1;
}

const trailing = await fetch(new URL("/modelle-hd", baseUrl), { redirect: "manual" });
assert.equal(trailing.status, 308);
assert.equal(new URL(trailing.headers.get("location"), baseUrl).pathname, "/modelle-hd/");
assert.equal((await fetch(new URL("/modelle-hd/", baseUrl), { redirect: "manual" })).status, 200);

function responseHeaders(host, protocol) {
  return execFileSync("curl.exe", ["-s", "-o", "NUL", "-D", "-", "-H", `Host: ${host}`, "-H", `X-Forwarded-Proto: ${protocol}`, `${baseUrl}/`], { encoding: "utf8" });
}

for (const headers of [responseHeaders("modellewebcam.com", "http"), responseHeaders("www.modellewebcam.com", "https")]) {
  assert.match(headers, /^HTTP\/1\.1 308/m);
  assert.match(headers, /^location: https:\/\/modellewebcam\.com\//mi);
}

console.log(`Historical language routes tested: ${languages.length}`);
console.log(`Status distribution: ${Object.entries(statuses).map(([status, count]) => `${status}=${count}`).join(", ")}`);
console.log("HTTP and www canonical redirects: passed");
console.log("Trailing slash redirect: passed without a chain");
