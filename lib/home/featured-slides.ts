import type { EventRowData } from "@/components/betting/EventRow";

export type FeaturedSlideVisual = {
  id: string;
  leagueLabel: string;
  homeTeam: string;
  awayTeam: string;
  homePlayer: string;
  awayPlayer: string;
  homeColor: string;
  awayColor: string;
  artwork: string;
};

/** Layout A — full-bleed sports overlay. Real football only. */
export const FEATURED_SLIDE_TEMPLATES: FeaturedSlideVisual[] = [
  {
    id: "ucl-mci-rma",
    leagueLabel: "Champions League",
    homeTeam: "Man City",
    awayTeam: "Real Madrid",
    homePlayer: "Haaland",
    awayPlayer: "Vinícius",
    homeColor: "#6CABDD",
    awayColor: "#FEBE10",
    artwork: "/images/slides/hero-options/sports-1-stadium.png",
  },
  {
    id: "epl-ars-liv",
    leagueLabel: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homePlayer: "Saka",
    awayPlayer: "Salah",
    homeColor: "#EF0107",
    awayColor: "#C8102E",
    artwork: "/images/slides/hero-options/sports-2-showdown.png",
  },
  {
    id: "epl-mci-liv",
    leagueLabel: "Premier League",
    homeTeam: "Man City",
    awayTeam: "Liverpool",
    homePlayer: "Haaland",
    awayPlayer: "Salah",
    homeColor: "#6CABDD",
    awayColor: "#C8102E",
    artwork: "/images/slides/hero-options/sports-3-action.png",
  },
  {
    id: "laliga-rma-bar",
    leagueLabel: "La Liga",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homePlayer: "Bellingham",
    awayPlayer: "Lewandowski",
    homeColor: "#FEBE10",
    awayColor: "#A50044",
    artwork: "/images/slides/hero-options/sports-1-stadium.png",
  },
];

export function mergeSlidesWithEvents(
  templates: FeaturedSlideVisual[],
  events: EventRowData[]
): Array<
  FeaturedSlideVisual & {
    eventId?: string;
    kickoff?: string;
    odds1x2?: { home?: number; draw?: number; away?: number };
  }
> {
  function matchesEvent(tpl: FeaturedSlideVisual, e: EventRowData) {
    const h = e.homeTeam.toLowerCase();
    const a = e.awayTeam.toLowerCase();
    const thToken = tpl.homeTeam.toLowerCase().split(" ").pop()!;
    const taToken = tpl.awayTeam.toLowerCase().split(" ").pop()!;
    return h.includes(thToken) && a.includes(taToken);
  }

  return templates.map((tpl) => {
    const match = events.find((e) => matchesEvent(tpl, e));
    return {
      ...tpl,
      eventId: match?.id,
      kickoff: match?.kickoff,
      odds1x2: match?.odds1x2,
    };
  });
}
