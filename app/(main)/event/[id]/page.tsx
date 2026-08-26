"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import type { MarketType } from "@prisma/client";
import { OddsButton } from "@/components/betting/OddsButton";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel, MARKET_LABELS } from "@/lib/betting/markets";

type EventDetail = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  kickoff: string;
  status: string;
  liveMinute: string;
  league: { name: string };
  markets: {
    id: string;
    type: MarketType;
    outcomes: { key: string; label: string; odds: number }[];
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
  }, [id]);

  if (!event) {
    return (
      <div className="p-4 space-y-3">
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  const isLive = event.status === "live";

  return (
    <div className="px-3 py-4 space-y-4 pb-28">
      <div className="card-surface p-4 text-center">
        <p className="text-[10px] text-white/45">{event.league.name}</p>
        <p className="text-xl font-black mt-1">{event.homeTeam}</p>
        {isLive ? (
          <p className="text-2xl font-black text-accent-green my-2">
            {event.homeScore} - {event.awayScore}
            <span className="block text-xs text-white/50 font-normal">
              {event.liveMinute}
            </span>
          </p>
        ) : (
          <p className="text-sm text-white/50 my-2">
            {dayjs(event.kickoff).format("HH:mm · DD MMM YYYY")}
          </p>
        )}
        <p className="text-xl font-black">{event.awayTeam}</p>
      </div>

      {event.markets.map((market) => (
        <div key={market.id} className="card-surface p-3">
          <p className="text-xs font-bold text-white/60 mb-2">
            {MARKET_LABELS[market.type]}
          </p>
          <div className="flex flex-wrap gap-2">
            {market.outcomes.map((o) => (
              <OddsButton
                key={o.key}
                label={o.label}
                odds={o.odds}
                sub={o.label.slice(0, 6)}
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
