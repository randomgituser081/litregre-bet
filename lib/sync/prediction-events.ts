import {
  EventStatus,
  MarketType,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { derive1x2Odds } from "@/lib/prediction/derive-odds";
import {
  extractList,
  fetchPredictionJson,
} from "@/lib/prediction/client";
import {
  leagueSlugFromFixture,
  normalizePredictionItem,
  type NormalizedFixture,
} from "@/lib/prediction/normalize";

export type SyncResult = {
  ok: boolean;
  fetched: number;
  upserted: number;
  cancelled: number;
  sources: Record<string, number>;
  error?: string;
};

async function ensureSport(slug: "football" | "basketball") {
  const name = slug === "basketball" ? "Basketball" : "Football";
  const icon = slug;
  return prisma.sport.upsert({
    where: { slug },
    create: {
      name,
      slug,
      icon,
      sortOrder: slug === "football" ? 1 : 2,
    },
    update: {},
  });
}

async function ensureLeague(
  sportId: string,
  f: NormalizedFixture
) {
  const slug = leagueSlugFromFixture(f);
  return prisma.league.upsert({
    where: { sportId_slug: { sportId, slug } },
    create: {
      sportId,
      name: f.leagueName,
      slug,
      country: f.leagueCountry,
      isPopular: f.sportSlug === "football",
      sortOrder: 50,
    },
    update: {
      name: f.leagueName,
      country: f.leagueCountry,
    },
  });
}

async function upsertMarkets(
  eventId: string,
  f: NormalizedFixture
) {
  const odds = derive1x2Odds(f.prediction, f.probability, {
    includeDraw: f.hasDraw,
  });

  const market = await prisma.market.upsert({
    where: {
      eventId_type_specifier: {
        eventId,
        type: MarketType.one_x_two,
        specifier: "",
      },
    },
    create: {
      eventId,
      type: MarketType.one_x_two,
      specifier: "",
    },
    update: {},
  });

  const outcomes: {
    key: string;
    label: string;
    odds: number;
    isActive: boolean;
  }[] = [
    { key: "home", label: "Home", odds: odds.home, isActive: true },
    { key: "away", label: "Away", odds: odds.away, isActive: true },
  ];
  if (f.hasDraw && odds.draw != null) {
    outcomes.splice(1, 0, {
      key: "draw",
      label: "Draw",
      odds: odds.draw,
      isActive: true,
    });
  }

  for (const o of outcomes) {
    await prisma.outcome.upsert({
      where: { marketId_key: { marketId: market.id, key: o.key } },
      create: {
        marketId: market.id,
        key: o.key,
        label: o.label,
        odds: o.odds,
        isActive: o.isActive,
      },
      update: {
        odds: o.odds,
        isActive: o.isActive,
      },
    });
  }

  if (!f.hasDraw) {
    await prisma.outcome.updateMany({
      where: { marketId: market.id, key: "draw" },
      data: { isActive: false },
    });
  }
}

async function upsertFixture(f: NormalizedFixture) {
  const sport = await ensureSport(f.sportSlug);
  const league = await ensureLeague(sport.id, f);

  const existing = await prisma.event.findFirst({
    where: { externalId: f.externalId },
    select: { id: true },
  });

  const data: Prisma.EventCreateInput = {
    league: { connect: { id: league.id } },
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    homeLogo: f.homeLogo,
    awayLogo: f.awayLogo,
    kickoff: f.kickoff,
    status: f.status as EventStatus,
    externalId: f.externalId,
    isFeatured: f.isHot,
    isHot: f.isHot,
  };

  const event = existing
    ? await prisma.event.update({
        where: { id: existing.id },
        data: {
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          homeLogo: data.homeLogo,
          awayLogo: data.awayLogo,
          kickoff: data.kickoff,
          status: data.status,
          isFeatured: data.isFeatured,
          isHot: data.isHot,
          league: data.league,
        },
      })
    : await prisma.event.create({ data });

  await upsertMarkets(event.id, f);
  return event.id;
}

async function collectFixtures(): Promise<{
  fixtures: NormalizedFixture[];
  sources: Record<string, number>;
}> {
  const map = new Map<string, NormalizedFixture>();
  const sources: Record<string, number> = {};

  function addBatch(
    label: string,
    items: Record<string, unknown>[],
    sport: "football" | "basketball"
  ) {
    let n = 0;
    for (const item of items) {
      const f = normalizePredictionItem(item, sport);
      if (!f) continue;
      map.set(f.externalId, f);
      n += 1;
    }
    sources[label] = n;
  }

  const today = await fetchPredictionJson(
    "/api/prediction/general/today/?page_size=100",
    { auth: true }
  );
  if (today) addBatch("today", extractList(today), "football");

  const special = await fetchPredictionJson(
    "/api/special/prediction/?market_type=1x2&page_size=100",
    { auth: true }
  );
  if (special) addBatch("special_1x2", extractList(special), "football");

  const basketball = await fetchPredictionJson(
    "/api/special/other/games?market_type=basketball&page_size=100",
    { auth: true }
  );
  if (basketball) addBatch("basketball", extractList(basketball), "basketball");

  const max = Number(process.env.PREDICTION_SYNC_MAX_FIXTURES || 50) || 50;
  const fixtures = Array.from(map.values())
    .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime())
    .slice(0, max);

  return { fixtures, sources };
}

export async function syncEventsFromPredictions(): Promise<SyncResult> {
  let fetched = 0;
  let sources: Record<string, number> = {};

  try {
    const collected = await collectFixtures();
    fetched = collected.fixtures.length;
    sources = collected.sources;
    const ids: string[] = [];
    let errors = 0;

    for (const f of collected.fixtures) {
      try {
        const id = await upsertFixture(f);
        ids.push(id);
      } catch (e) {
        errors += 1;
        console.error("[sync-events] fixture", f.externalId, e);
      }
    }

    const externalIds = collected.fixtures.map((f) => f.externalId);
    const cancelled = await prisma.event.updateMany({
      where: {
        externalId: { notIn: externalIds.length ? externalIds : ["__none__"] },
        status: EventStatus.upcoming,
        NOT: { externalId: "" },
      },
      data: { status: EventStatus.cancelled },
    });

    let clearedSeed = { count: 0 };
    if (ids.length > 0) {
      clearedSeed = await prisma.event.updateMany({
        where: { externalId: "", status: EventStatus.upcoming },
        data: { status: EventStatus.cancelled },
      });
    }

    return {
      ok: ids.length > 0 || fetched === 0,
      fetched,
      upserted: ids.length,
      cancelled: cancelled.count + clearedSeed.count,
      sources,
      ...(errors ? { error: `${errors} fixture(s) failed to upsert` } : {}),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "sync failed";
    console.error("[sync-events]", msg);
    return {
      ok: false,
      fetched,
      upserted: 0,
      cancelled: 0,
      sources,
      error: msg,
    };
  }
}

let lastSyncAt = 0;
let syncInflight: Promise<SyncResult> | null = null;

/** Throttled background sync for /api/events when the board is empty or stale. */
export async function maybeSyncEvents(force = false): Promise<SyncResult | null> {
  const enabled = process.env.PREDICTION_SYNC_ON_FETCH !== "false";
  if (!enabled && !force) return null;

  const hasCreds =
    process.env.PREDICTION_API_TOKEN ||
    (process.env.PREDICTION_API_PHONE && process.env.PREDICTION_API_PIN);
  if (!hasCreds && !force) return null;

  const intervalMs =
    Number(process.env.PREDICTION_SYNC_INTERVAL_MS || 15 * 60 * 1000) || 900000;
  const now = Date.now();
  if (!force && now - lastSyncAt < intervalMs) return null;

  if (syncInflight) return syncInflight;

  syncInflight = syncEventsFromPredictions().finally(() => {
    lastSyncAt = Date.now();
    syncInflight = null;
  });
  return syncInflight;
}
