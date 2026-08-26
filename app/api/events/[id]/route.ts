import { NextResponse } from "next/server";
import { fetchEventById, serializeEvent } from "@/lib/betting/queries";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ev = await fetchEventById(params.id);
    if (!ev) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(serializeEvent(ev));
  } catch (e) {
    console.error("[event]", e);
    return NextResponse.json({ error: "Server error" }, { status: 503 });
  }
}
