import { NextRequest, NextResponse } from "next/server";
import {
  isCurrentPublicPath,
  isWordPressSystemJunk,
  resolveLegacyRedirect,
} from "@/lib/legacy-redirects";

const canonicalHost = "modellewebcam.com";
const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function gone() {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function permanentRedirect(request: NextRequest, destination: string) {
  const url = new URL(destination, request.url);
  return NextResponse.redirect(url, 308);
}

function isLocalHost(hostname: string) {
  return localHosts.has(hostname);
}

function isStaticOrTechnicalPath(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon.png" ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function shouldHaveTrailingSlash(pathname: string) {
  return pathname !== "/" && !pathname.endsWith("/") && !isStaticOrTechnicalPath(pathname) && !pathname.startsWith("/go/");
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = (request.headers.get("host")?.split(":")[0] || url.hostname).toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || url.protocol.replace(":", "");
  const isLocal = isLocalHost(hostname);

  if (!isLocal && (hostname === `www.${canonicalHost}` || (hostname === canonicalHost && protocol === "http"))) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = canonicalHost;
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const legacy = resolveLegacyRedirect(url.pathname);
  if (legacy.type === "redirect") {
    const target = new URL(legacy.destination, request.url);
    target.search = url.search;
    return NextResponse.redirect(target, 308);
  }

  if (isWordPressSystemJunk(url.pathname)) {
    return gone();
  }

  if (url.pathname.startsWith("/go/") || isStaticOrTechnicalPath(url.pathname)) {
    return NextResponse.next();
  }

  if (shouldHaveTrailingSlash(url.pathname) && isCurrentPublicPath(`${url.pathname}/`)) {
    return permanentRedirect(request, `${url.pathname}/${url.search}`);
  }

  if (isCurrentPublicPath(url.pathname)) {
    return NextResponse.next();
  }

  return gone();
}

export const config = {
  matcher: "/:path*",
};
