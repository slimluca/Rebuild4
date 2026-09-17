import assert from "node:assert/strict";
import { ATTRIBUTION_SOURCE, TRACK_VALUES, isTrackValue, withAttribution } from "../src/lib/affiliate-attribution.mjs";

for (const track of TRACK_VALUES) {
  const result = new URL(withAttribution("https://example.com/room?wm=campaign", track));
  assert.equal(result.searchParams.get("wm"), "campaign", `${track} must preserve the campaign`);
  assert.equal(result.searchParams.get("source"), ATTRIBUTION_SOURCE, `${track} must include source`);
  assert.equal(result.searchParams.get("track"), track, `${track} must include its fixed track value`);
}

assert.equal(isTrackValue("mw_unbounded_value"), false);
assert.equal(new URL(withAttribution("https://example.com/?wm=campaign", "mw_unbounded_value")).searchParams.has("track"), false);
console.log(`Conversion attribution passed for ${TRACK_VALUES.length} fixed track values`);
