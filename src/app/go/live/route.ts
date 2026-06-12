import { NextResponse } from "next/server";

export function GET(request: Request) {
  const fallback = new URL("/modelle-webcam/", request.url);
  return NextResponse.redirect(process.env.LIVE_DESTINATION_URL || fallback);
}
