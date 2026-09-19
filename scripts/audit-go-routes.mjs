import assert from "node:assert/strict";

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3100";
const base = new URL(baseUrl);

async function redirect(path, expectedTrack, allowLocalFallback = false) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  assert(response.status >= 300 && response.status < 400, `${path} should redirect`);
  assert.match(response.headers.get("x-robots-tag") || "", /noindex/i, `${path} must be noindex`);
  assert.match(response.headers.get("x-robots-tag") || "", /nofollow/i, `${path} must be nofollow`);
  const location = response.headers.get("location");
  assert(location, `${path} is missing a redirect location`);
  const destination = new URL(location, baseUrl);
  const isEquivalentLoopbackOrigin =
    ["localhost", "127.0.0.1"].includes(destination.hostname) && destination.port === base.port;
  if (allowLocalFallback && (destination.origin === base.origin || isEquivalentLoopbackOrigin)) {
    assert.equal(destination.pathname, "/modelle-webcam/");
    assert.equal(destination.search, "", `${path} local fallback must not contain query parameters`);
    assert.equal(destination.hash, "", `${path} local fallback must not contain a fragment`);
    return { destination, outbound: false };
  }
  assert.equal(destination.searchParams.get("source"), "modellewebcam", `${path} is missing source`);
  assert.equal(destination.searchParams.get("track"), expectedTrack, `${path} has the wrong track`);
  return { destination, outbound: true };
}

const home = await (await fetch(new URL("/", baseUrl))).text();
const modelHref = home.match(/href="(\/go\/model\?[^" ]+)"/)?.[1]?.replaceAll("&amp;", "&");
assert(modelHref, "Homepage did not render a model redirect link");

const liveDestination = await redirect("/go/live?track=mw_hub", "mw_hub", true);
const signupDestination = await redirect("/go/model-signup?track=mw_creator_model", "mw_creator_model");
const modelDestination = await redirect(modelHref, "mw_home", true);
if (modelDestination.outbound) {
  assert.equal(modelDestination.destination.protocol, "https:", "/go/model outbound destination must use HTTPS");
  assert.match(modelDestination.destination.hostname, /(^|\.)chaturbate\.com$/i, "/go/model outbound destination must be Chaturbate");
}

const destinations = [liveDestination, signupDestination, modelDestination];

const outboundDestinations = destinations.filter((result) => result.outbound).map((result) => result.destination);
assert(outboundDestinations.length >= 2, "Creator signup and model routes should both reach an outbound destination");
assert(
  outboundDestinations.every((url) => ["wm", "campaign", "tour"].some((key) => url.searchParams.has(key))),
  "A tested Chaturbate destination did not preserve its campaign configuration"
);

const invalid = await fetch(new URL("/go/live?track=unbounded_value", baseUrl), { redirect: "manual" });
const invalidDestination = new URL(invalid.headers.get("location"), baseUrl);
assert.equal(invalidDestination.searchParams.has("track"), false, "An unknown track value was forwarded");

console.log("Outbound redirect audit passed for live, creator signup, and model routes");
console.log("Source and fixed track values present: yes");
console.log("Existing campaign parameters preserved: yes");
console.log(`Live destination configured locally: ${destinations[0].outbound ? "yes" : "no, verified safe hub fallback"}`);
