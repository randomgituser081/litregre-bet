import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const events = await prisma.event.count();
    const sports = await prisma.sport.count();
    return NextResponse.json({ ok: true, events, sports });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    let hint = "Check DATABASE_URL in Coolify and redeploy.";

    if (msg.includes("league_id") || msg.includes("home_team")) {
      hint =
        "Connected to the wrong database. Use database name litregre_bet (not postgres).";
    } else if (
      msg.includes("ECONNREFUSED")
      || msg.includes("timed out")
      || msg.includes("Can't reach")
    ) {
      hint =
        "App cannot reach Postgres. Use the internal Coolify Postgres hostname (not the public IP).";
    } else if (msg.includes("Authentication failed") || msg.includes("password")) {
      hint = "Postgres password in DATABASE_URL is wrong.";
    }

    console.error("[health]", msg);
    return NextResponse.json({ ok: false, events: 0, hint }, { status: 503 });
  }
}
