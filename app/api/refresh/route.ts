import { NextRequest, NextResponse } from "next/server";
import { refreshTokensAction } from "@/src/architecture/actions/auth/refresh-tokens.action";

async function handleRefresh(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  const newToken = await refreshTokensAction();

  if (!newToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

export async function GET(request: NextRequest) {
  return handleRefresh(request);
}

export async function POST(request: NextRequest) {
  return handleRefresh(request);
}
