/** Bookmaker margin applied when converting model probability → displayed odds. */
const MARGIN = 0.93;

export type Derived1x2 = {
  home: number;
  draw?: number;
  away: number;
};

function clampProb(p: number) {
  return Math.max(0.22, Math.min(0.78, p));
}

function toOdds(prob: number) {
  return +(MARGIN / prob).toFixed(2);
}

/**
 * Turn a 1/X/2 prediction + confidence into plausible market odds.
 * When probability is missing we assume a moderate 45% edge on the pick.
 */
export function derive1x2Odds(
  prediction: string,
  probabilityPct?: number | null,
  opts?: { includeDraw?: boolean }
): Derived1x2 {
  const includeDraw = opts?.includeDraw !== false;
  const pick = prediction === "X" ? "X" : prediction === "2" ? "2" : "1";
  const raw =
    probabilityPct != null && probabilityPct > 0
      ? probabilityPct > 1
        ? probabilityPct / 100
        : probabilityPct
      : 0.45;
  const fav = clampProb(raw);

  let homeP = 0.33;
  let drawP = includeDraw ? 0.28 : 0;
  let awayP = 0.33;

  if (pick === "1") {
    homeP = fav;
    const rest = 1 - fav;
    if (includeDraw) {
      drawP = rest * 0.42;
      awayP = rest * 0.58;
    } else {
      awayP = rest;
    }
  } else if (pick === "2") {
    awayP = fav;
    const rest = 1 - fav;
    if (includeDraw) {
      drawP = rest * 0.42;
      homeP = rest * 0.58;
    } else {
      homeP = rest;
    }
  } else {
    drawP = fav;
    const rest = 1 - fav;
    homeP = rest * 0.52;
    awayP = rest * 0.48;
  }

  const total = homeP + drawP + awayP;
  homeP /= total;
  drawP /= total;
  awayP /= total;

  const out: Derived1x2 = {
    home: toOdds(homeP),
    away: toOdds(awayP),
  };
  if (includeDraw) out.draw = toOdds(drawP);
  return out;
}
