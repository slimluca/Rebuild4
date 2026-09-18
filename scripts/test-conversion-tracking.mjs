import assert from "node:assert/strict";
import {
  ATTRIBUTION_SOURCE,
  TRACK_VALUES,
  isTrackValue,
  withAttribution,
  withChaturbateAttribution,
} from "../src/lib/affiliate-attribution.mjs";

for (const track of TRACK_VALUES) {
  const result = new URL(withAttribution("https://example.com/room?wm=campaign", track));
  assert.equal(result.searchParams.get("wm"), "campaign", `${track} must preserve the campaign`);
  assert.equal(result.searchParams.get("source"), ATTRIBUTION_SOURCE, `${track} must include source`);
  assert.equal(result.searchParams.get("track"), track, `${track} must include its fixed track value`);
}

assert.equal(isTrackValue("mw_unbounded_value"), false);
assert.equal(new URL(withAttribution("https://example.com/?wm=campaign", "mw_unbounded_value")).searchParams.has("track"), false);

const chaturbate = new URL(
  withChaturbateAttribution("https://chaturbate.com/room/?wm=campaign&tour=NwNd&source=old", "mw_home")
);
assert.equal(chaturbate.searchParams.get("wm"), "campaign", "Chaturbate campaign parameters must remain intact");
assert.equal(chaturbate.searchParams.get("tour"), "NwNd", "Chaturbate revshare parameters must remain intact");
assert.equal(chaturbate.searchParams.get("source"), ATTRIBUTION_SOURCE, "Chaturbate URLs must use the site source");
assert.equal(chaturbate.searchParams.getAll("source").length, 1, "Chaturbate URLs must not duplicate source");
assert.equal(chaturbate.searchParams.get("track"), "mw_home", "Chaturbate URLs must preserve valid tracks");

const unknownTrack = new URL(withChaturbateAttribution("https://chaturbate.com/room/?wm=campaign", "mw_unbounded_value"));
assert.equal(unknownTrack.searchParams.has("track"), false, "Unknown Chaturbate tracks must be discarded");
assert.equal(unknownTrack.searchParams.get("source"), ATTRIBUTION_SOURCE, "Chaturbate URLs must retain the site source without a track");

assert.equal(withChaturbateAttribution("javascript:alert(1)", "mw_home"), undefined, "JavaScript URLs must be rejected");
assert.equal(withChaturbateAttribution("https://example.com/redirect", "mw_home"), undefined, "Non-Chaturbate URLs must be rejected");
assert.equal(withChaturbateAttribution("not a URL", "mw_home"), undefined, "Malformed URLs must be rejected");
console.log(`Conversion attribution passed for ${TRACK_VALUES.length} fixed track values`);
