import { NextResponse } from "next/server";

export function GET(request: Request) {
  // MODEL_SIGNUP_URL is intentionally environment-driven because performer signup destinations
  // vary by commercial setup and should not be exposed in public UI copy.
  const fallback = new URL("/diventare-webcam-model/", request.url);
  return NextResponse.redirect(process.env.MODEL_SIGNUP_URL || fallback);
}
