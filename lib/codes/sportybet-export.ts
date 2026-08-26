/**
 * SportyBet Nigeria — event match + share/booking code creation.
 * Uses public share/book endpoints (no paid API).
 */

import {
  normalizeTip,
  type BookableMarket,
  type NormalizedTip,
} from "./tip-normalize";

export const MAX_SPORTY_LEGS = 50;

const BASE = "https://www.sportybet.com/api/ng";

const headers: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  // Avoid Content-Type on GET — some SportyBet list endpoints shrink/alter payloads with it
  Clientid: "web",
  Platform: "web",
  Origin: "https://www.sportybet.com",
  Referer: "https://www.sportybet.com/ng/",
};

export type SlipLegInput = {
  home: string;
  away: string;
  tip: string;
  /** Optional special-market hint: 1x2 | over_25 | btts */
  marketHint?: string | null;
  id?: string;
};

export type BookedLeg = {
  home: string;
  away: string;
  tip: string;
  label: string;
  eventId: string;
  odds: string;
};

export type FailedLeg = {
  home: string;
  away: string;
  tip: string;
  reason: string;
};

export type BookResult = {
  code: string | null;
  url: string | null;
  booked: BookedLeg[];
  failed: FailedLeg[];
};

type SportyOutcome = {
  id: string;
  desc?: string;
  odds?: string;
  isActive?: number;
};

type SportyMarket = {
  id: string;
  desc?: string;
  specifier?: string;
  status?: number;
  outcomes?: SportyOutcome[];
};

type SportyEvent = {
  eventId: string;
  status?: number;
  matchStatus?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  estimateStartTime?: number;
  markets?: SportyMarket[];
};

type SportyTournamentBlock = {
  id?: string;
  name?: string;
  events?: SportyEvent[];
};

type IndexedEvent = SportyEvent & {
  homeTokens: Set<string>;
  awayTokens: Set<string>;
  homeNorm: string;
  awayNorm: string;
};

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(fc|afc|cf|sc|ac|as|ss|club|utd|town|hotspur|athletic|atletico|olympique|sporting|deportivo|the)\b/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(name: string): Set<string> {
  return new Set(normalizeName(name).split(" ").filter((t) => t.length > 1));
}

/** Jaccard-ish similarity on precomputed token sets */
function tokenScore(
  aTokens: Set<string>,
  bTokens: Set<string>,
  aNorm: string,
  bNorm: string
): number {
  if (!aTokens.size || !bTokens.size) return 0;
  let inter = 0;
  aTokens.forEach((t) => {
    if (bTokens.has(t)) inter++;
  });
  const union = aTokens.size + bTokens.size - inter;
  const jaccard = inter / union;
  if (aNorm === bNorm) return 1;
  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) return Math.max(jaccard, 0.85);
  return jaccard;
}

function indexEvents(events: SportyEvent[]): IndexedEvent[] {
  const out: IndexedEvent[] = [];
  for (const ev of events) {
    if (!ev.homeTeamName || !ev.awayTeamName) continue;
    out.push({
      ...ev,
      homeTokens: tokenSet(ev.homeTeamName),
      awayTokens: tokenSet(ev.awayTeamName),
      homeNorm: normalizeName(ev.homeTeamName),
      awayNorm: normalizeName(ev.awayTeamName),
    });
  }
  return out;
}

const FETCH_TIMEOUT_MS = 8_000;
const INDEX_CACHE_TTL_MS = 5 * 60_000;
const BOOKING_DEADLINE_MS = 45_000;
const CATALOG_TIMEOUT_MS = 18_000;

let indexCache: { at: number; events: IndexedEvent[] } | null = null;
let indexInflight: Promise<IndexedEvent[]> | null = null;

/** Always resolves — never hangs the booking flow if SportyBet is slow. */
function raceTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T
): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      }
    );
  });
}

async function sportyGet<T = unknown>(
  path: string,
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers,
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { bizCode?: number; data?: T };
    if (json.bizCode !== 10000) return null;
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Hard-capped GET — returns null if SportyBet is too slow (even if abort fails). */
async function sportyGetCapped<T = unknown>(
  path: string,
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<T | null> {
  return raceTimeout(sportyGet<T>(path, timeoutMs), timeoutMs + 400, null);
}

async function sportyPost<T = unknown>(
  path: string,
  body: unknown,
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<{ ok: boolean; data?: T; message?: string }> {
  const work = (async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: ctrl.signal,
      });
      const json = (await res.json()) as {
        bizCode?: number;
        message?: string;
        data?: T;
      };
      if (json.bizCode === 10000 && json.data) {
        return { ok: true as const, data: json.data };
      }
      return {
        ok: false as const,
        message: json.message || "SportyBet request failed",
      };
    } catch {
      return { ok: false as const, message: "Could not reach SportyBet" };
    } finally {
      clearTimeout(timer);
    }
  })();

  return raceTimeout(work, timeoutMs + 400, {
    ok: false as const,
    message: "SportyBet timed out",
  });
}

function mergeEventBlocks(
  map: Map<string, SportyEvent>,
  blocks: SportyTournamentBlock[] | null
) {
  for (const block of blocks || []) {
    for (const ev of block.events || []) {
      if (!ev?.eventId) continue;
      map.set(ev.eventId, ev);
    }
  }
}

async function loadThumbnailCatalog(): Promise<SportyTournamentBlock[] | null> {
  return sportyGetCapped<SportyTournamentBlock[]>(
    "/factsCenter/commonThumbnailEvents?sportId=sr:sport:1&marketId=1",
    CATALOG_TIMEOUT_MS
  );
}

/**
 * Full prematch catalog (~1200+ events). Cached ~5 min.
 * Warm via /api/booking/sportybet/warmup when the app loads.
 */
export async function fetchSportyEventIndex(
  forceRefresh = false
): Promise<IndexedEvent[]> {
  if (
    !forceRefresh &&
    indexCache &&
    Date.now() - indexCache.at < INDEX_CACHE_TTL_MS
  ) {
    return indexCache.events;
  }

  if (indexInflight) return indexInflight;

  indexInflight = (async () => {
    const thumbnails = await loadThumbnailCatalog();
    const map = new Map<string, SportyEvent>();
    mergeEventBlocks(map, thumbnails);
    const events = indexEvents(Array.from(map.values()));
    if (events.length) {
      indexCache = { at: Date.now(), events };
    }
    return events;
  })();

  try {
    return await indexInflight;
  } finally {
    indexInflight = null;
  }
}

function sportyMarketIdForTip(tip: NormalizedTip): string {
  switch (tip.market) {
    case "1x2":
      return "1";
    case "ou15":
    case "ou25":
      return "18";
    case "btts":
      return "29";
    case "dc":
      return "10";
    default:
      return "1";
  }
}

/** Map tip → SportyBet ids (no odds — share API fills those in). */
function resolveSelectionIds(tip: NormalizedTip): {
  marketId: string;
  outcomeId: string;
  specifier: string;
  label: string;
} | null {
  if (tip.market === "1x2") {
    const outcomeMap: Record<string, string> = {
      home: "1",
      draw: "2",
      away: "3",
    };
    const oid = outcomeMap[tip.pick];
    if (!oid) return null;
    return { marketId: "1", outcomeId: oid, specifier: "", label: tip.label };
  }
  if (tip.market === "ou15") {
    return {
      marketId: "18",
      outcomeId: tip.pick === "under" ? "13" : "12",
      specifier: "total=1.5",
      label: tip.label,
    };
  }
  if (tip.market === "ou25") {
    return {
      marketId: "18",
      outcomeId: tip.pick === "under" ? "13" : "12",
      specifier: "total=2.5",
      label: tip.label,
    };
  }
  if (tip.market === "btts") {
    return {
      marketId: "29",
      outcomeId: tip.pick === "no" ? "76" : "74",
      specifier: "",
      label: tip.label,
    };
  }
  if (tip.market === "dc") {
    const outcomeMap: Record<string, string> = {
      "1x": "9",
      "12": "10",
      x2: "11",
    };
    const oid = outcomeMap[tip.pick];
    if (!oid) return null;
    return { marketId: "10", outcomeId: oid, specifier: "", label: tip.label };
  }
  return null;
}

/** Event details — only for debugging / future use. */
export async function fetchSportyEventDetails(
  eventId: string,
  marketId?: string
): Promise<SportyEvent | null> {
  const qs = new URLSearchParams({ eventId });
  if (marketId) qs.set("marketId", marketId);
  return sportyGetCapped<SportyEvent>(`/factsCenter/event?${qs.toString()}`, 5_000);
}

function findBestEvent(
  events: IndexedEvent[],
  home: string,
  away: string
): { event: IndexedEvent; score: number } | null {
  const homeTokens = tokenSet(home);
  const awayTokens = tokenSet(away);
  const homeNorm = normalizeName(home);
  const awayNorm = normalizeName(away);

  let best: { event: IndexedEvent; score: number } | null = null;
  for (const ev of events) {
    const homeDirect = tokenScore(
      homeTokens,
      ev.homeTokens,
      homeNorm,
      ev.homeNorm
    );
    const awayDirect = tokenScore(
      awayTokens,
      ev.awayTokens,
      awayNorm,
      ev.awayNorm
    );
    const homeSwap = tokenScore(
      homeTokens,
      ev.awayTokens,
      homeNorm,
      ev.awayNorm
    );
    const awaySwap = tokenScore(
      awayTokens,
      ev.homeTokens,
      awayNorm,
      ev.homeNorm
    );
    const direct = (homeDirect + awayDirect) / 2;
    const swapped = (homeSwap + awaySwap) / 2;
    const directOk = homeDirect >= 0.45 && awayDirect >= 0.45;
    const swapOk = homeSwap >= 0.45 && awaySwap >= 0.45;
    let score = 0;
    if (directOk) score = direct;
    if (swapOk) score = Math.max(score, swapped * 0.95);
    if (score <= 0) continue;
    if (!best || score > best.score) best = { event: ev, score };
  }
  if (!best || best.score < 0.55) return null;
  return best;
}

function resolveMarketOutcome(
  event: SportyEvent,
  tip: NormalizedTip
): {
  marketId: string;
  outcomeId: string;
  specifier: string;
  odds: string;
  label: string;
} | null {
  const markets = event.markets || [];

  if (tip.market === "1x2") {
    const m = markets.find((x) => String(x.id) === "1");
    if (!m?.outcomes?.length) return null;
    const outcomeMap: Record<string, string> = {
      home: "1",
      draw: "2",
      away: "3",
    };
    const oid = outcomeMap[tip.pick];
    const o = m.outcomes.find((x) => String(x.id) === oid);
    if (!o?.odds) return null;
    return {
      marketId: "1",
      outcomeId: oid,
      specifier: "",
      odds: String(o.odds),
      label: tip.label,
    };
  }

  if (tip.market === "ou15") {
    const m = markets.find(
      (x) => String(x.id) === "18" && x.specifier === "total=1.5"
    );
    if (!m?.outcomes?.length) return null;
    const oid = tip.pick === "under" ? "13" : "12";
    const o = m.outcomes.find((x) => String(x.id) === oid);
    if (!o?.odds) return null;
    return {
      marketId: "18",
      outcomeId: oid,
      specifier: "total=1.5",
      odds: String(o.odds),
      label: tip.label,
    };
  }

  if (tip.market === "ou25") {
    const m = markets.find(
      (x) => String(x.id) === "18" && x.specifier === "total=2.5"
    );
    if (!m?.outcomes?.length) return null;
    const oid = tip.pick === "under" ? "13" : "12";
    const o = m.outcomes.find((x) => String(x.id) === oid);
    if (!o?.odds) return null;
    return {
      marketId: "18",
      outcomeId: oid,
      specifier: "total=2.5",
      odds: String(o.odds),
      label: tip.label,
    };
  }

  if (tip.market === "btts") {
    const m = markets.find((x) => String(x.id) === "29");
    if (!m?.outcomes?.length) return null;
    const oid = tip.pick === "no" ? "76" : "74";
    const o = m.outcomes.find((x) => String(x.id) === oid);
    if (!o?.odds) return null;
    return {
      marketId: "29",
      outcomeId: oid,
      specifier: "",
      odds: String(o.odds),
      label: tip.label,
    };
  }

  if (tip.market === "dc") {
    const m = markets.find((x) => String(x.id) === "10");
    if (!m?.outcomes?.length) return null;
    const outcomeMap: Record<string, string> = {
      "1x": "9",
      "12": "10",
      x2: "11",
    };
    const oid = outcomeMap[tip.pick];
    const o = m.outcomes.find((x) => String(x.id) === oid);
    if (!o?.odds) return null;
    return {
      marketId: "10",
      outcomeId: oid,
      specifier: "",
      odds: String(o.odds),
      label: tip.label,
    };
  }

  return null;
}

type ShareSelection = {
  eventId: string;
  marketId: string;
  outcomeId: string;
  odds?: string;
  specifier: string;
};

type ShareOutcome = {
  eventId?: string;
  marketId?: string;
  outcomeId?: string;
  odds?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  desc?: string;
};

type ShareResponse = {
  shareCode?: string;
  shareURL?: string;
  outcomes?: ShareOutcome[];
  unavailableOutcomes?: ShareOutcome[];
};

/**
 * Match tip legs to SportyBet events and create a NG booking/share code.
 * Hard-capped so the UI never spins for minutes.
 */
export async function createSportyBetBookingCode(
  legs: SlipLegInput[]
): Promise<BookResult> {
  const work = createSportyBetBookingCodeInner(legs);
  return raceTimeout(work, BOOKING_DEADLINE_MS, {
    code: null,
    url: null,
    booked: [] as BookedLeg[],
    failed: legs.map((l) => ({
      home: l.home,
      away: l.away,
      tip: l.tip,
      reason: "Timed out talking to SportyBet — try again with fewer selections",
    })),
  });
}

async function createSportyBetBookingCodeInner(
  legs: SlipLegInput[]
): Promise<BookResult> {
  const booked: BookedLeg[] = [];
  const failed: FailedLeg[] = [];

  if (!legs.length) {
    return {
      code: null,
      url: null,
      booked,
      failed: [{ home: "", away: "", tip: "", reason: "Slip is empty" }],
    };
  }

  const index = await fetchSportyEventIndex();
  if (!index.length) {
    return {
      code: null,
      url: null,
      booked,
      failed: legs.map((l) => ({
        home: l.home,
        away: l.away,
        tip: l.tip,
        reason: "Could not load SportyBet fixtures",
      })),
    };
  }

  type PendingLeg = {
    leg: SlipLegInput;
    selection: ShareSelection;
    label: string;
    home: string;
    away: string;
  };

  const pending: PendingLeg[] = [];
  const slice = legs.slice(0, MAX_SPORTY_LEGS);

  for (const leg of slice) {
    const tip = normalizeTip(leg.tip, leg.marketHint, {
      home: leg.home,
      away: leg.away,
    });
    if (!tip) {
      failed.push({
        home: leg.home,
        away: leg.away,
        tip: leg.tip,
        reason:
          "Tip market not supported (use 1/X/2, Over 1.5/2.5, or BTTS)",
      });
      continue;
    }

    const match = findBestEvent(index, leg.home, leg.away);
    if (!match) {
      failed.push({
        home: leg.home,
        away: leg.away,
        tip: leg.tip,
        reason: "No matching SportyBet fixture found",
      });
      continue;
    }

    const resolved = resolveSelectionIds(tip);
    if (!resolved) {
      failed.push({
        home: leg.home,
        away: leg.away,
        tip: leg.tip,
        reason: "Could not map tip to SportyBet market",
      });
      continue;
    }

    pending.push({
      leg,
      selection: {
        eventId: match.event.eventId,
        marketId: resolved.marketId,
        outcomeId: resolved.outcomeId,
        specifier: resolved.specifier,
      },
      label: resolved.label,
      home: match.event.homeTeamName || leg.home,
      away: match.event.awayTeamName || leg.away,
    });
  }

  if (!pending.length) {
    return { code: null, url: null, booked, failed };
  }

  const shareTimeout = pending.length > 25 ? 15_000 : 10_000;
  const share = await sportyPost<ShareResponse>(
    "/orders/share",
    { selections: pending.map((p) => p.selection) },
    shareTimeout
  );

  if (!share.ok || !share.data?.shareCode) {
    return {
      code: null,
      url: null,
      booked,
      failed: [
        ...failed,
        {
          home: "",
          away: "",
          tip: "",
          reason: share.message || "SportyBet refused to create booking code",
        },
      ],
    };
  }

  const oddsByKey = new Map<string, string>();
  for (const o of share.data.outcomes || []) {
    if (!o.eventId || !o.marketId || !o.outcomeId) continue;
    oddsByKey.set(
      `${o.eventId}|${o.marketId}|${o.outcomeId}`,
      String(o.odds || "")
    );
  }

  const unavailable = new Set(
    (share.data.unavailableOutcomes || [])
      .map((o) =>
        o.eventId && o.marketId && o.outcomeId
          ? `${o.eventId}|${o.marketId}|${o.outcomeId}`
          : ""
      )
      .filter(Boolean)
  );

  for (const p of pending) {
    const key = `${p.selection.eventId}|${p.selection.marketId}|${p.selection.outcomeId}`;
    if (unavailable.has(key)) {
      failed.push({
        home: p.leg.home,
        away: p.leg.away,
        tip: p.leg.tip,
        reason: "Market closed or unavailable on SportyBet",
      });
      continue;
    }
    booked.push({
      home: p.home,
      away: p.away,
      tip: p.leg.tip,
      label: p.label,
      eventId: p.selection.eventId,
      odds: oddsByKey.get(key) || "",
    });
  }

  const code = share.data.shareCode;
  const url =
    share.data.shareURL?.replace(/^http:/, "https:") ||
    `https://www.sportybet.com/ng/?shareCode=${code}`;

  return { code, url, booked, failed };
}

export type { BookableMarket, NormalizedTip };
