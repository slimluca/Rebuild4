import { NextResponse } from "next/server";
import { isTrackValue, withAttribution } from "@/lib/affiliate-attribution.mjs";

export function GET(request: Request) {
  // MODEL_SIGNUP_URL is intentionally environment-driven because performer signup destinations
  // vary by commercial setup and should not be exposed in public UI copy.
  const fallback = new URL("/diventare-webcam-model/", request.url);
  const requestUrl = new URL(request.url);
  const track = requestUrl.searchParams.get("track");
  const configured = process.env.MODEL_SIGNUP_URL;
  const destination = configured && isTrackValue(track) ? withAttribution(configured, track) : configured || fallback;
  const response = NextResponse.redirect(destination);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
