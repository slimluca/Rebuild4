import { NextResponse } from "next/server";

export function GET(request: Request) {
  const fallback = new URL("/modelle-webcam/", request.url);
  const response = NextResponse.redirect(process.env.LIVE_DESTINATION_URL || fallback);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
