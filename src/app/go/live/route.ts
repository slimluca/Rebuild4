import { NextResponse } from "next/server";
import { isTrackValue, withAttribution } from "@/lib/affiliate-attribution.mjs";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const track = requestUrl.searchParams.get("track");
  const fallback = new URL("/modelle-webcam/", request.url);
  const configured = process.env.LIVE_DESTINATION_URL;
  const destination = configured && isTrackValue(track) ? withAttribution(configured, track) : configured || fallback;
  const response = NextResponse.redirect(destination);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
