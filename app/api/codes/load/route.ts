import { NextResponse } from "next/server";
import { loadShareCode } from "@/lib/codes/share";

export async function POST(req: Request) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = String(body.code || "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  const legs = await loadShareCode(code);
  if (!legs?.length) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
  }

  return NextResponse.json({ code, legs });
}
