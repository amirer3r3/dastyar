import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  // TODO: persist worksheet document to database when storage is ready.
  return NextResponse.json({
    ok: true,
    stored: "local-pending",
    received: Boolean(body),
  });
}
