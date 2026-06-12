import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const modelId = url.searchParams.get("id");
  const fallback = new URL("/modelle-webcam/", request.url);
  const template = process.env.MODEL_DESTINATION_URL;

  if (!template) return NextResponse.redirect(fallback);

  const destination = modelId ? template.replace("{id}", encodeURIComponent(modelId)) : template;
  return NextResponse.redirect(destination);
}
