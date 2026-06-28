import { NextResponse } from "next/server";
import { getModelRedirectUrl, getVisitorGeoFromHeaders } from "@/lib/models";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const username = url.searchParams.get("username");
  const performerId = username ?? url.searchParams.get("performerId") ?? url.searchParams.get("id");
  const fallback = new URL("/modelle-webcam/", request.url);
  const visitorGeo = getVisitorGeoFromHeaders(request.headers);
  const feedDestination = performerId
    ? await getModelRedirectUrl(performerId, visitorGeo.country, visitorGeo.region, {
        clientIp: visitorGeo.clientIp,
        provider: provider === "chaturbate" ? provider : undefined,
      })
    : undefined;
  if (feedDestination) {
    const response = NextResponse.redirect(feedDestination);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const template = process.env.MODEL_DESTINATION_URL;

  if (!template) {
    const response = NextResponse.redirect(fallback);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const destination = performerId ? template.replace("{id}", encodeURIComponent(performerId)) : template;
  const response = NextResponse.redirect(destination);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
