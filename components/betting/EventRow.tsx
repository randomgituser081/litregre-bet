"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { OddsButton } from "@/components/betting/OddsButton";
import type { MarketType } from "@prisma/client";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel } from "@/lib/betting/markets";

export type EventRowData = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  status: string;
  liveMinute?: string;
  homeScore?: number;
  awayScore?: number;
  isFeatured?: boolean;
  isHot?: boolean;
  leagueName?: string;
  odds1x2?: { home?: number; draw?: number; away?: number };
};

type Props = {
  event: EventRowData;
  compact?: boolean;
};

export function EventRow({ event, compact }: Props) {
  const addLeg = useSlipStore((s) => s.addLeg);
  const hasLeg = useSlipStore((s) => s.hasLeg);

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

  const o = event.odds1x2 || {};
  const isLive = event.status === "live";

  return (
    <div className="card-surface p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {!compact && event.leagueName && (
            <p className="text-[10px] text-white/45 truncate">{event.leagueName}</p>
          )}
          <Link href={`/event/${event.id}`} className="block hover:text-accent-green">
            <p className="text-sm font-semibold truncate">{event.homeTeam}</p>
            <p className="text-sm font-semibold truncate">{event.awayTeam}</p>
          </Link>
        </div>
        <div className="text-right shrink-0">
          {isLive ? (
            <>
              <span className="text-[10px] font-bold text-accent-green">LIVE</span>
              <p className="text-xs font-bold">
                {event.homeScore}-{event.awayScore}
              </p>
              <p className="text-[10px] text-white/50">{event.liveMinute}</p>
            </>
          ) : (
            <p className="text-[10px] text-white/50">
              {dayjs(event.kickoff).format("HH:mm DD/MM")}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1.5">
        {o.home != null && (
          <OddsButton
            label="1"
            odds={o.home}
            selected={hasLeg(event.id, "one_x_two", "home")}
            onClick={() => pick("home", o.home!)}
            sub="1"
          />
        )}
        {o.draw != null && (
          <OddsButton
            label="X"
            odds={o.draw}
            selected={hasLeg(event.id, "one_x_two", "draw")}
            onClick={() => pick("draw", o.draw!)}
            sub="X"
          />
        )}
        {o.away != null && (
          <OddsButton
            label="2"
            odds={o.away}
            selected={hasLeg(event.id, "one_x_two", "away")}
            onClick={() => pick("away", o.away!)}
            sub="2"
          />
        )}
        <Link
          href={`/event/${event.id}`}
          className="ml-auto text-[10px] text-accent-green font-semibold self-center px-2"
        >
          +markets
        </Link>
      </div>
    </div>
  );
}
