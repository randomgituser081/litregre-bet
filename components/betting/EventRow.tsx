"use client";

import Link from "next/link";
import dayjs from "dayjs";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import type { MarketType } from "@prisma/client";
import { OddsButton } from "@/components/betting/OddsButton";
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
  showLeague?: boolean;
};

export function EventRow({ event, showLeague }: Props) {
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
      outcomeLabel: outcomeLabel(
        marketType,
        key,
        event.homeTeam,
        event.awayTeam
      ),
      odds,
    });
  }

  const o = event.odds1x2 || {};
  const isLive = event.status === "live";

  return (
    <div className="flex items-stretch gap-2 border-b border-surface-border last:border-b-0 bg-surface-card px-2.5 py-2 hover:bg-surface-raised/70 transition-colors">
      <Link
        href={`/event/${event.id}`}
        className="flex min-w-0 flex-1 gap-2 items-center"
      >
        <div className="w-[2.6rem] shrink-0 text-center leading-tight">
          {isLive ? (
            <>
              <p className="text-[8px] font-black uppercase text-accent-red tracking-wide flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-accent-red animate-pulse" />
                Live
              </p>
              <p className="text-[11px] font-black tabular-nums text-ink">
                {event.homeScore ?? 0}-{event.awayScore ?? 0}
              </p>
              <p className="text-[8px] text-muted tabular-nums">
                {event.liveMinute || "—"}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold tabular-nums text-accent-green">
                {dayjs(event.kickoff).format("HH:mm")}
              </p>
              <p className="text-[8px] text-muted">
                {dayjs(event.kickoff).format("DD/MM")}
              </p>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          {showLeague && event.leagueName && (
            <p className="text-[8px] text-muted truncate mb-0.5 font-semibold">
              {event.leagueName}
            </p>
          )}
          <p className="text-[12.5px] font-semibold truncate leading-snug text-ink">
            {event.homeTeam}
          </p>
          <p className="text-[12.5px] font-semibold truncate leading-snug text-ink">
            {event.awayTeam}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-1 shrink-0 self-center">
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
          className={clsx(
            "w-7 h-9 rounded-md flex items-center justify-center",
            "text-muted hover:text-accent-green hover:bg-accent-green/10"
          )}
          aria-label="More markets"
        >
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}
