import { NextResponse } from "next/server";
import { EventStatus } from "@prisma/client";
import {
  fetchEvents,
  serializeEvent,
  get1x2Outcomes,
  countSyncedUpcoming,
} from "@/lib/betting/queries";
import { maybeSyncEvents } from "@/lib/sync/prediction-events";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const league = searchParams.get("league") || undefined;
  const sport = searchParams.get("sport") || undefined;

  let status: EventStatus | undefined;
  let featured: boolean | undefined;
  if (filter === "live") status = EventStatus.live;
  if (filter === "featured") featured = true;

  try {
    const syncedUpcoming = await countSyncedUpcoming();
    if (syncedUpcoming < 3) {
      await maybeSyncEvents(true);
    } else {
      void maybeSyncEvents();
    }

    const syncedOnly = true;

    const events = await fetchEvents({
      status,
      featured,
      leagueSlug: league,
      sportSlug: sport,
      syncedOnly,
      limit: 80,
    });

    const items = events.map((ev) => {
      const serialized = serializeEvent(ev);
      const o = get1x2Outcomes(ev);
      return {
        ...serialized,
        odds1x2: o
          ? { home: o.home, draw: o.draw, away: o.away }
          : undefined,
        leagueName: ev.league.name,
      };
    });

    return NextResponse.json({ items, count: items.length });
  } catch (e) {
    console.error("[events]", e);
    return NextResponse.json(
      { error: "Could not load events", items: [] },
      { status: 503 }
    );
  }
}
