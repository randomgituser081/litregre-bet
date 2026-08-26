import { NextResponse } from "next/server";
import type { SlipLeg } from "@/lib/betting/markets";
import { combinedOdds, parseStakeToKobo } from "@/lib/utils";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  let body: { legs?: SlipLeg[]; stake?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const legs = Array.isArray(body.legs) ? body.legs : [];
  if (!legs.length) {
    return NextResponse.json({ error: "Slip is empty" }, { status: 400 });
  }

  for (const leg of legs) {
    const outcome = await prisma.outcome.findFirst({
      where: {
        market: { eventId: leg.eventId, type: leg.marketType },
        key: leg.outcomeKey,
        isActive: true,
      },
    });
    if (!outcome) {
      return NextResponse.json(
        { error: `Selection unavailable: ${leg.homeTeam} vs ${leg.awayTeam}` },
        { status: 400 }
      );
    }
    leg.odds = Number(outcome.odds);
  }

  const totalOdds = combinedOdds(legs.map((l) => l.odds));
  const stakeKobo = parseStakeToKobo(body.stake || "100");
  const potential = Number(stakeKobo) * totalOdds;

  return NextResponse.json({
    legs,
    totalOdds,
    potential: Math.round(potential),
    legCount: legs.length,
  });
}
