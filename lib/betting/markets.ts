import type { MarketType } from "@prisma/client";

export type SlipLeg = {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  marketType: MarketType;
  outcomeKey: string;
  outcomeLabel: string;
  odds: number;
};

export const MARKET_LABELS: Record<MarketType, string> = {
  one_x_two: "1X2",
  over_under_15: "Over/Under 1.5",
  over_under_25: "Over/Under 2.5",
  btts: "BTTS",
  double_chance: "Double Chance",
};

export const OUTCOME_KEYS_1X2 = ["home", "draw", "away"] as const;

export function outcomeLabel(
  marketType: MarketType,
  key: string,
  home?: string,
  away?: string
): string {
  if (marketType === "one_x_two") {
    if (key === "home") return home ? `${home}` : "Home";
    if (key === "draw") return "Draw";
    if (key === "away") return away ? `${away}` : "Away";
  }
  if (marketType === "over_under_15" || marketType === "over_under_25") {
    const line = marketType === "over_under_15" ? "1.5" : "2.5";
    return key === "over" ? `Over ${line}` : `Under ${line}`;
  }
  if (marketType === "btts") {
    return key === "yes" ? "BTTS Yes" : "BTTS No";
  }
  if (marketType === "double_chance") {
    if (key === "1x") return "1X";
    if (key === "12") return "12";
    if (key === "x2") return "X2";
  }
  return key;
}

export function legKey(eventId: string, marketType: MarketType, outcomeKey: string) {
  return `${eventId}|${marketType}|${outcomeKey}`;
}
