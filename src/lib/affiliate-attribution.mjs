export const ATTRIBUTION_SOURCE = "modellewebcam";

export const TRACK_VALUES = Object.freeze([
  "mw_home",
  "mw_hub",
  "mw_hd",
  "mw_new",
  "mw_tattoo",
  "mw_prosperose",
  "mw_italiane",
  "mw_creator_model",
  "mw_creator_camgirl",
  "mw_creator_work",
  "mw_creator_privacy",
  "mw_creator_setup",
  "mw_creator_earnings",
]);

export function isTrackValue(value) {
  return typeof value === "string" && TRACK_VALUES.includes(value);
}

export function withAttribution(destination, track) {
  const url = new URL(destination);
  url.searchParams.set("source", ATTRIBUTION_SOURCE);
  if (isTrackValue(track)) url.searchParams.set("track", track);
  return url.toString();
}
