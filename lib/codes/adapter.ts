import type { SlipLeg } from "@/lib/betting/markets";
import {
  createSportyBetBookingCode,
  type SlipLegInput,
} from "@/lib/codes/sportybet-export";

function legToTip(leg: SlipLeg): { tip: string; marketHint: string } {
  switch (leg.marketType) {
    case "one_x_two":
      if (leg.outcomeKey === "home") return { tip: "1", marketHint: "1x2" };
      if (leg.outcomeKey === "draw") return { tip: "X", marketHint: "1x2" };
      return { tip: "2", marketHint: "1x2" };
    case "over_under_15":
      return {
        tip: leg.outcomeKey === "over" ? "Over 1.5" : "Under 1.5",
        marketHint: "over_15",
      };
    case "over_under_25":
      return {
        tip: leg.outcomeKey === "over" ? "Over 2.5" : "Under 2.5",
        marketHint: "over_25",
      };
    case "btts":
      return {
        tip: leg.outcomeKey === "yes" ? "Yes" : "No",
        marketHint: "btts",
      };
    case "double_chance":
      return { tip: leg.outcomeKey.toUpperCase(), marketHint: "dc" };
    default:
      return { tip: leg.outcomeKey, marketHint: "1x2" };
  }
}

export async function exportLegsToSportyBet(legs: SlipLeg[]) {
  const inputs: SlipLegInput[] = legs.map((leg) => {
    const { tip, marketHint } = legToTip(leg);
    return {
      home: leg.homeTeam,
      away: leg.awayTeam,
      tip,
      marketHint,
    };
  });
  return createSportyBetBookingCode(inputs);
}
