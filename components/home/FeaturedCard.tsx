"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { Flame } from "lucide-react";
import { OddsButton } from "@/components/betting/OddsButton";
import type { MarketType } from "@prisma/client";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel } from "@/lib/betting/markets";
import type { EventRowData } from "@/components/betting/EventRow";

export function FeaturedCard({ event }: { event: EventRowData }) {
  const addLeg = useSlipStore((s) => s.addLeg);
  const hasLeg = useSlipStore((s) => s.hasLeg);
  const o = event.odds1x2 || {};

  function pick(key: string, odds: number) {
    const marketType = "one_x_two" as MarketType;
    addLeg({
      eventId: event.id,
      homeTeam: event.homeTeam,
      awayTeam: event.awayTeam,
      marketType,
      outcomeKey: key,
      outcomeLabel: outcomeLabel(marketType, key, event.homeTeam, event.awayTeam),
      odds,
    });
  }

  return (
    <div className="card-surface mx-3 p-4 border-accent-green/20 bg-gradient-to-br from-surface-card to-surface-raised">
      <div className="flex items-center gap-1.5 text-accent-green text-xs font-bold mb-2">
        <Flame size={14} /> HOT
      </div>
      <Link href={`/event/${event.id}`}>
        <p className="text-lg font-black leading-tight">{event.homeTeam}</p>
        <p className="text-xs text-white/50 my-1">vs</p>
        <p className="text-lg font-black leading-tight">{event.awayTeam}</p>
      </Link>
      <p className="text-[10px] text-white/45 mt-2">
        {event.leagueName} · {dayjs(event.kickoff).format("HH:mm DD MMM")}
      </p>
      <div className="flex gap-2 mt-3">
        {o.home != null && (
          <OddsButton
            label="1"
            odds={o.home}
            sub="1"
            selected={hasLeg(event.id, "one_x_two", "home")}
            onClick={() => pick("home", o.home!)}
          />
        )}
        {o.draw != null && (
          <OddsButton
            label="X"
            odds={o.draw}
            sub="X"
            selected={hasLeg(event.id, "one_x_two", "draw")}
            onClick={() => pick("draw", o.draw!)}
          />
        )}
        {o.away != null && (
          <OddsButton
            label="2"
            odds={o.away}
            sub="2"
            selected={hasLeg(event.id, "one_x_two", "away")}
            onClick={() => pick("away", o.away!)}
          />
        )}
      </div>
    </div>
  );
}
