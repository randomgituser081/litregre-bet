import type { EventStatus } from "@prisma/client";

export type NormalizedFixture = {
  externalId: string;
  sportSlug: "football" | "basketball";
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  leagueName: string;
  leagueCountry: string;
  kickoff: Date;
  status: EventStatus;
  prediction: string;
  probability: number | null;
  hasDraw: boolean;
  isHot: boolean;
};

type JsonRecord = Record<string, unknown>;

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "unknown"
  );
}

function str(v: unknown) {
  return v == null ? "" : String(v).trim();
}

function parseKickoff(item: JsonRecord): Date | null {
  const iso = str(item.date || item.kickoff || item.datetime);
  const time = str(item.time);
  if (iso && /^\d{4}-\d{2}-\d{2}T/.test(iso)) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (iso && time) {
    const d = new Date(`${iso}T${time}:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (iso) {
    const d = new Date(`${iso}T12:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function mapStatus(item: JsonRecord): EventStatus {
  if (item.is_finished === true) return "finished";
  const s = str(item.status).toUpperCase();
  if (s === "LIVE" || s === "1H" || s === "2H" || s === "HT") return "live";
  if (s === "CANC" || s === "ABD") return "cancelled";
  return "upcoming";
}

function leagueLabel(item: JsonRecord, sportSlug: NormalizedFixture["sportSlug"]) {
  const comp = str(
    item.competition_name || item.league || item.competition || item.country
  );
  const country = str(item.competition_country || item.country);
  if (comp && country && !comp.toLowerCase().includes(country.toLowerCase())) {
    return { name: `${country} · ${comp}`, country, slug: slugify(`${country}-${comp}`) };
  }
  if (comp) return { name: comp, country, slug: slugify(comp) };
  return {
    name: sportSlug === "basketball" ? "Basketball" : "Football",
    country: country || "International",
    slug: sportSlug,
  };
}

function probabilityOf(item: JsonRecord): number | null {
  const raw =
    item.prediction_probability ?? item.probability ?? item.confidence ?? null;
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function isUpcoming(item: JsonRecord, kickoff: Date | null) {
  if (item.is_finished === true) return false;
  const s = str(item.status).toUpperCase();
  if (s === "FT" || s === "AET" || s === "PEN") return false;
  if (kickoff) {
    const cutoff = Date.now() - 3 * 60 * 60 * 1000;
    return kickoff.getTime() >= cutoff;
  }
  return item.is_finished !== true;
}

export function normalizePredictionItem(
  item: JsonRecord,
  sportSlug: NormalizedFixture["sportSlug"]
): NormalizedFixture | null {
  const home = str(
    item.home_team || item.home_name || item.home || item.fighter_1
  );
  const away = str(
    item.away_team || item.away_name || item.away || item.fighter_2
  );
  if (!home || !away) return null;

  const externalId = str(item.game_id || item.match_id || item.id);
  if (!externalId) return null;

  const kickoff = parseKickoff(item);
  if (!isUpcoming(item, kickoff)) return null;

  const league = leagueLabel(item, sportSlug);
  const market = str(item.market_type).toLowerCase();
  const hasDraw = sportSlug === "football" && market !== "basketball";

  let prediction = str(item.prediction || item.label || item.tip);
  if (!prediction && market === "basketball") prediction = "1";

  return {
    externalId,
    sportSlug,
    homeTeam: home,
    awayTeam: away,
    homeLogo: str(item.home_logo),
    awayLogo: str(item.away_logo),
    leagueName: league.name,
    leagueCountry: league.country || "International",
    kickoff: kickoff ?? new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: mapStatus(item),
    prediction,
    probability: probabilityOf(item),
    hasDraw,
    isHot: probabilityOf(item) != null && Number(probabilityOf(item)) >= 55,
  };
}

export function leagueSlugFromFixture(f: NormalizedFixture) {
  return slugify(`${f.leagueCountry}-${f.leagueName}`);
}
