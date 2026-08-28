import { NextResponse } from "next/server";
import { EventStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { syncEventsFromPredictions } from "@/lib/sync/prediction-events";

/** Cancel demo seed fixtures (empty externalId) so only API-synced games show. */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const cleared = await prisma.event.updateMany({
    where: { externalId: "", status: { not: EventStatus.cancelled } },
    data: { status: EventStatus.cancelled },
  });

  const sync = await syncEventsFromPredictions();

  return NextResponse.json({
    clearedSeed: cleared.count,
    ...sync,
  });
}

export async function GET(req: Request) {
  return POST(req);
}
