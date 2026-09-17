import { NextResponse } from "next/server";
import { getModelRedirectUrl, getVisitorGeoFromHeaders } from "@/lib/models";
import { isTrackValue, withAttribution } from "@/lib/affiliate-attribution.mjs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const username = url.searchParams.get("username");
  const performerId = username ?? url.searchParams.get("performerId") ?? url.searchParams.get("id");
  const track = url.searchParams.get("track");
  const fallback = new URL("/modelle-webcam/", request.url);
  const visitorGeo = getVisitorGeoFromHeaders(request.headers);
  const feedDestination = performerId
    ? await getModelRedirectUrl(performerId, visitorGeo.country, visitorGeo.region, {
        clientIp: visitorGeo.clientIp,
        provider: provider === "chaturbate" ? provider : undefined,
      })
    : undefined;
  if (feedDestination) {
    const destination = isTrackValue(track) ? withAttribution(feedDestination, track) : feedDestination;
    const response = NextResponse.redirect(destination);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const template = process.env.MODEL_DESTINATION_URL;

  if (!template) {
    const response = NextResponse.redirect(fallback);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const templatedDestination = performerId ? template.replace("{id}", encodeURIComponent(performerId)) : template;
  const destination = isTrackValue(track) ? withAttribution(templatedDestination, track) : templatedDestination;
  const response = NextResponse.redirect(destination);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
