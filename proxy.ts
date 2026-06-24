import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isNavigationRequest(request: NextRequest): boolean {
  return request.method === "GET" || request.method === "HEAD";
}

function authDebugContext(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  return {
    pathname,
    method: request.method,
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
    isServerAction: request.headers.has("next-action"),
  };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);
  const debug = authDebugContext(request);

  if (
    isNavigationRequest(request) &&
    !accessToken &&
    refreshToken &&
    !isPublicRoute(pathname) &&
    !pathname.startsWith("/api/refresh")
  ) {
    console.warn("[PROXY] Redirecting to token refresh", debug);
    const refreshUrl = new URL("/api/refresh", request.url);
    refreshUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  if (
    !isNavigationRequest(request) &&
    !accessToken &&
    refreshToken &&
    !pathname.startsWith("/api/refresh")
  ) {
    console.warn(
      "[PROXY] Allowing non-GET request without access token (server action / mutation)",
      debug,
    );
  }

  if (
    isNavigationRequest(request) &&
    !isAuthenticated &&
    !isPublicRoute(pathname)
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isNavigationRequest(request) &&
    isAuthenticated &&
    isPublicRoute(pathname)
  ) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
