import { NextResponse } from "next/server";
import { BetStatus } from "@prisma/client";
import { getSession } from "@/lib/auth/session";
import type { SlipLeg } from "@/lib/betting/markets";
import {
  PlaceBetError,
  placeBet,
  serializeBet,
} from "@/lib/betting/place-bet";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Log in to place a bet" },
      { status: 401 }
    );
  }

  let body: { legs?: SlipLeg[]; stake?: string | number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const legs = Array.isArray(body.legs) ? body.legs : [];

  try {
    const bet = await placeBet(session.sub, legs, body.stake ?? "100");
    return NextResponse.json({
      ok: true,
      bet: serializeBet(bet),
    });
  } catch (e) {
    if (e instanceof PlaceBetError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[bets/place]", e);
    return NextResponse.json(
      { error: "Could not place bet" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab");

  const where =
    tab === "history"
      ? { userId: session.sub, status: { in: [BetStatus.won, BetStatus.lost, BetStatus.void, BetStatus.cashed_out] } }
      : tab === "open"
        ? { userId: session.sub, status: BetStatus.pending }
        : { userId: session.sub };

  const bets = await prisma.bet.findMany({
    where,
    include: {
      selections: {
        include: {
          event: { include: { league: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    items: bets.map(serializeBet),
    count: bets.length,
  });
}
