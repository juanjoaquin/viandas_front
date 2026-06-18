import { NextResponse } from "next/server";
import { refreshTokensAction } from "@/src/architecture/actions/auth/refresh-tokens.action";

export async function GET() {
  const newToken = await refreshTokensAction();

  if (!newToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
