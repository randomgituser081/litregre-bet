"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import type { MarketType } from "@prisma/client";
import { OddsButton } from "@/components/betting/OddsButton";
import { TeamLogo } from "@/components/betting/TeamLogo";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel, MARKET_LABELS } from "@/lib/betting/markets";

type EventDetail = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore: number;
  awayScore: number;
  kickoff: string;
  status: string;
  liveMinute: string;
  league: { name: string };
  markets: {
    id: string;
    type: MarketType;
    outcomes: { key: string; label: string; odds: number; isActive?: boolean }[];
  }[];
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const addLeg = useSlipStore((s) => s.addLeg);
  const hasLeg = useSlipStore((s) => s.hasLeg);

  useEffect(() => {
    void fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then(setEvent);

    // Track recently opened matches for /favorites?tab=recent
    try {
      const key = "lg-bet-recent";
      const prev: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [String(id), ...prev.filter((x) => x !== String(id))].slice(
        0,
        20
      );
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [id]);

  if (!event) {
    return (
      <div className="p-3 space-y-2">
        <div className="skeleton h-16 w-full rounded" />
        <div className="skeleton h-32 w-full rounded" />
      </div>
    );
  }

  const isLive = event.status === "live";

  return (
    <div className="pb-28">
      <div className="bg-surface-card border-b border-surface-border px-3 py-3">
        <p className="text-[11px] text-muted font-semibold">{event.league.name}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <TeamLogo src={event.homeLogo} name={event.homeTeam} />
              <p className="text-[15px] font-bold truncate">{event.homeTeam}</p>
            </div>
            <div className="flex items-center gap-2">
              <TeamLogo src={event.awayLogo} name={event.awayTeam} />
              <p className="text-[15px] font-bold truncate">{event.awayTeam}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            {isLive ? (
              <>
                <p className="text-[10px] font-black uppercase text-accent-red">
                  Live · {event.liveMinute}
                </p>
                <p className="text-xl font-black tabular-nums">
                  {event.homeScore} - {event.awayScore}
                </p>
              </>
            ) : (
              <p className="text-[12px] font-semibold text-muted">
                {dayjs(event.kickoff).format("HH:mm")}
                <span className="block text-[10px]">
                  {dayjs(event.kickoff).format("DD MMM YYYY")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {event.markets.map((market) => (
        <div
          key={market.id}
          className="border-b border-surface-border bg-surface-card"
        >
          <p className="px-3 py-2 text-[12px] font-bold bg-surface-raised border-b border-surface-border">
            {MARKET_LABELS[market.type]}
          </p>
          <div className="grid grid-cols-3 gap-1.5 p-2">
            {market.outcomes
              .filter((o) => o.isActive !== false)
              .map((o) => (
              <OddsButton
                key={o.key}
                label={o.label}
                odds={o.odds}
                sub={o.label.length > 8 ? o.label.slice(0, 8) : o.label}
                className="w-full min-w-0"
                selected={hasLeg(event.id, market.type, o.key)}
                onClick={() =>
                  addLeg({
                    eventId: event.id,
                    homeTeam: event.homeTeam,
                    awayTeam: event.awayTeam,
                    marketType: market.type,
                    outcomeKey: o.key,
                    outcomeLabel: outcomeLabel(
                      market.type,
                      o.key,
                      event.homeTeam,
                      event.awayTeam
                    ),
                    odds: o.odds,
                  })
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
