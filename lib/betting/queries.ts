import type { EventStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type EventWithMarkets = Prisma.EventGetPayload<{
  include: {
    league: { include: { sport: true } };
    markets: { include: { outcomes: true } };
  };
}>;

export async function fetchEvents(opts?: {
  status?: EventStatus;
  leagueSlug?: string;
  sportSlug?: string;
  featured?: boolean;
  limit?: number;
}) {
  const where: Prisma.EventWhereInput = {};
  if (opts?.status) where.status = opts.status;
  if (opts?.featured) where.isFeatured = true;
  if (opts?.leagueSlug || opts?.sportSlug) {
    where.league = {
      ...(opts.leagueSlug ? { slug: opts.leagueSlug } : {}),
      ...(opts.sportSlug ? { sport: { slug: opts.sportSlug } } : {}),
    };
  }

  return prisma.event.findMany({
    where,
    include: {
      league: { include: { sport: true } },
      markets: { include: { outcomes: true } },
    },
    orderBy: [{ status: "asc" }, { kickoff: "asc" }],
    take: opts?.limit ?? 100,
  });
}

export async function fetchEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      league: { include: { sport: true } },
      markets: { include: { outcomes: true } },
    },
  });
}

export async function fetchSportsWithLeagues() {
  return prisma.sport.findMany({
    include: {
      leagues: { orderBy: [{ isPopular: "desc" }, { sortOrder: "asc" }] },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export function serializeEvent(ev: EventWithMarkets) {
  return {
    id: ev.id,
    homeTeam: ev.homeTeam,
    awayTeam: ev.awayTeam,
    homeScore: ev.homeScore,
    awayScore: ev.awayScore,
    kickoff: ev.kickoff.toISOString(),
    status: ev.status,
    liveMinute: ev.liveMinute,
    isFeatured: ev.isFeatured,
    isHot: ev.isHot,
    league: {
      id: ev.league.id,
      name: ev.league.name,
      slug: ev.league.slug,
      country: ev.league.country,
      sport: { slug: ev.league.sport.slug, name: ev.league.sport.name },
    },
    markets: ev.markets.map((m) => ({
      id: m.id,
      type: m.type,
      specifier: m.specifier,
      outcomes: m.outcomes.map((o) => ({
        id: o.id,
        key: o.key,
        label: o.label,
        odds: Number(o.odds),
        isActive: o.isActive,
      })),
    })),
  };
}

export function get1x2Outcomes(ev: EventWithMarkets) {
  const m = ev.markets.find((x) => x.type === "one_x_two");
  if (!m) return null;
  const map: Record<string, number> = {};
  for (const o of m.outcomes) map[o.key] = Number(o.odds);
  return map;
}
