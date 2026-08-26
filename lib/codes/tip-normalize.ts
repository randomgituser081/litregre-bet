/**
 * Normalize prediction tip strings into bookable SportyBet markets.
 * MVP: 1x2 | ou15 | ou25 | btts | dc
 */

export type BookableMarket = "1x2" | "ou15" | "ou25" | "btts" | "dc";

export type NormalizedTip = {
  market: BookableMarket;
  /** SportyBet outcome pick key */
  pick:
    | "home"
    | "draw"
    | "away"
    | "over"
    | "under"
    | "yes"
    | "no"
    | "1x"
    | "12"
    | "x2";
  label: string;
};

function clean(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeTip(
  tipRaw: string,
  marketHint?: string | null,
  teams?: { home?: string; away?: string } | null
): NormalizedTip | null {
  const tip = clean(String(tipRaw ?? ""));
  const hint = clean(String(marketHint ?? ""));
  const homeName = clean(String(teams?.home ?? ""));
  const awayName = clean(String(teams?.away ?? ""));

  // Explicit market hints from Daily Special tabs
  if (hint === "over_15" || hint === "ou15" || hint.includes("over_15")) {
    if (/under/.test(tip)) {
      return { market: "ou15", pick: "under", label: "Under 1.5" };
    }
    return { market: "ou15", pick: "over", label: "Over 1.5" };
  }
  if (hint === "over_25" || hint === "ou25" || hint.includes("over_25")) {
    if (/under/.test(tip)) {
      return { market: "ou25", pick: "under", label: "Under 2.5" };
    }
    // tip may be "Over", "O", empty, or full "Over 2.5"
    return { market: "ou25", pick: "over", label: "Over 2.5" };
  }
  if (hint === "btts" || hint === "bts" || hint.includes("btts")) {
    if (/\bno\b|\bng\b/.test(tip) && !/\byes\b/.test(tip)) {
      return { market: "btts", pick: "no", label: "BTTS No" };
    }
    return { market: "btts", pick: "yes", label: "BTTS Yes" };
  }
  if (
    hint === "1x2" ||
    hint === "basketball" ||
    hint === "tennis" ||
    hint === "mma"
  ) {
    if (
      tip === "1" ||
      /^home( win)?$/.test(tip) ||
      (homeName && (tip === `${homeName} win` || tip === homeName))
    ) {
      return { market: "1x2", pick: "home", label: "Home" };
    }
    if (tip === "x" || tip === "0" || /draw/.test(tip)) {
      return { market: "1x2", pick: "draw", label: "Draw" };
    }
    if (
      tip === "2" ||
      /^away( win)?$/.test(tip) ||
      (awayName && (tip === `${awayName} win` || tip === awayName))
    ) {
      return { market: "1x2", pick: "away", label: "Away" };
    }
  }

  // VIP / double chance labels
  if (
    tip === "1x" ||
    tip === "home_or_draw" ||
    /home or draw|home\/draw|1 or x/.test(tip)
  ) {
    return { market: "dc", pick: "1x", label: "1X" };
  }
  if (
    tip === "x2" ||
    tip === "away_or_draw" ||
    /away or draw|draw or away|draw\/away|x or 2/.test(tip)
  ) {
    return { market: "dc", pick: "x2", label: "X2" };
  }
  if (
    tip === "12" ||
    tip === "home_or_away" ||
    /home or away|home\/away|1 or 2|no draw/.test(tip)
  ) {
    return { market: "dc", pick: "12", label: "12" };
  }

  // Over/Under from tip text
  if (
    /over[_\s]*1\.?5|o\s*1\.?5|over_15/.test(tip) ||
    tip === "over 1.5"
  ) {
    if (/under|no/.test(tip) && !/yes/.test(tip)) {
      return { market: "ou15", pick: "under", label: "Under 1.5" };
    }
    return { market: "ou15", pick: "over", label: "Over 1.5" };
  }
  if (/over\s*2\.?5|o\s*2\.?5|over 2,5|over_25/.test(tip) || tip === "over" || tip === "o") {
    return { market: "ou25", pick: "over", label: "Over 2.5" };
  }
  if (
    /under\s*2\.?5|u\s*2\.?5|under 2,5/.test(tip) ||
    tip === "under" ||
    tip === "u"
  ) {
    return { market: "ou25", pick: "under", label: "Under 2.5" };
  }

  // BTTS / GG (incl. "BTTS: Yes")
  if (
    /btts\s*:?\s*yes|gg\b|both teams? to score|both to score|goal goal/.test(
      tip
    ) ||
    tip === "gg" ||
    tip === "yes"
  ) {
    return { market: "btts", pick: "yes", label: "BTTS Yes" };
  }
  if (/btts\s*:?\s*no|ng\b|no goal/.test(tip)) {
    return { market: "btts", pick: "no", label: "BTTS No" };
  }

  // Classic 1X2 codes
  if (tip === "1" || /^home( win)?$/.test(tip) || tip === "hw") {
    return { market: "1x2", pick: "home", label: "Home" };
  }
  if (tip === "x" || tip === "0" || tip === "draw" || tip === "d") {
    return { market: "1x2", pick: "draw", label: "Draw" };
  }
  if (tip === "2" || /^away( win)?$/.test(tip) || tip === "aw") {
    return { market: "1x2", pick: "away", label: "Away" };
  }

  // Display labels like "Saigon Heat win" / "Connecticut Sun W win"
  if (/\bwin$/.test(tip)) {
    if (homeName && (tip === `${homeName} win` || tip.startsWith(homeName))) {
      return { market: "1x2", pick: "home", label: "Home" };
    }
    if (awayName && (tip === `${awayName} win` || tip.startsWith(awayName))) {
      return { market: "1x2", pick: "away", label: "Away" };
    }
  }

  return null;
}

export function canBookTip(
  tip: string,
  marketHint?: string | null,
  teams?: { home?: string; away?: string } | null
): boolean {
  return normalizeTip(tip, marketHint, teams) != null;
}
