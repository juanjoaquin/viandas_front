import { NextResponse } from "next/server";
import { refreshTokensAction } from "@/src/architecture/actions/auth/refresh-tokens.action";

export async function GET() {
  const result = await refreshTokensAction();

  if (result.status === "inactive") {
    return NextResponse.json({ ok: false, inactive: true }, { status: 403 });
  }

  if (result.status === "failed") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
