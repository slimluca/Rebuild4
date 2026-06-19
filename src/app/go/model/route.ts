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
  if (feedDestination) return NextResponse.redirect(feedDestination);

  const template = process.env.MODEL_DESTINATION_URL;

  if (!template) return NextResponse.redirect(fallback);

  const destination = performerId ? template.replace("{id}", encodeURIComponent(performerId)) : template;
  return NextResponse.redirect(destination);
}
