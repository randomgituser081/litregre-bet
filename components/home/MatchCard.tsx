"use client";

import Link from "next/link";
import dayjs from "dayjs";
import clsx from "clsx";
import type { MarketType } from "@prisma/client";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel } from "@/lib/betting/markets";
import { TeamLogo } from "@/components/betting/TeamLogo";
import type { EventRowData } from "@/components/betting/EventRow";

type Props = {
  event: EventRowData;
};

export function MatchCard({ event }: Props) {
  const addLeg = useSlipStore((s) => s.addLeg);
  const hasLeg = useSlipStore((s) => s.hasLeg);
  const o = event.odds1x2 || {};
  const isLive = event.status === "live";
  const isHot = !!event.isHot || !!event.isFeatured;

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

  return (
    <article
      className={clsx(
        "match-card match-card--compact group shrink-0 w-[14.5rem] sm:w-[15.25rem] rounded-2xl flex flex-col overflow-hidden",
        isLive && "match-card--live"
      )}
    >
      {isLive && (
        <div className="h-[2px] w-full bg-gradient-to-r from-accent-red via-[#ff6b6b] to-accent-green" />
      )}
      {!isLive && isHot && (
        <div className="h-[2px] w-full bg-gradient-to-r from-accent-green to-accent-lime" />
      )}

      <div className="p-2.5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center gap-1.5 min-h-[1.1rem]">
          <span className="match-card__league-mark match-card__league-mark--sm">
            {(event.leagueName || "FB").slice(0, 2).toUpperCase()}
          </span>
          <p className="text-[10px] font-semibold truncate flex-1 min-w-0 text-muted">
            {event.leagueName || "Football"}
          </p>
          {isLive ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-accent-red tabular-nums shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
              {event.liveMinute || "LIVE"}
            </span>
          ) : (
            <span className="text-[9px] font-bold tabular-nums text-muted shrink-0">
              {dayjs(event.kickoff).format("HH:mm")}
            </span>
          )}
        </div>

        <Link
          href={`/event/${event.id}`}
          className="flex items-center gap-1.5 min-h-[3.25rem]"
        >
          <div className="flex-1 min-w-0 flex flex-col items-center gap-1 text-center">
            <TeamLogo src={event.homeLogo} name={event.homeTeam} size="sm" />
            <p className="text-[11px] font-bold text-ink leading-tight line-clamp-2 w-full">
              {event.homeTeam}
            </p>
            {isLive && (
              <span className="text-[15px] font-black tabular-nums text-ink leading-none">
                {event.homeScore ?? 0}
              </span>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-center gap-0.5 px-0.5">
            <span className="text-[10px] font-black text-muted/60 tracking-widest">
              {isLive ? "" : "VS"}
            </span>
            {!isLive && isHot && (
              <span className="text-[8px] font-black uppercase tracking-wider text-accent-green bg-accent-green/10 px-1 py-0.5 rounded">
                Hot
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col items-center gap-1 text-center">
            <TeamLogo src={event.awayLogo} name={event.awayTeam} size="sm" />
            <p className="text-[11px] font-bold text-ink leading-tight line-clamp-2 w-full">
              {event.awayTeam}
            </p>
            {isLive && (
              <span className="text-[15px] font-black tabular-nums text-ink leading-none">
                {event.awayScore ?? 0}
              </span>
            )}
          </div>
        </Link>

        <div className="grid grid-cols-3 gap-1 mt-auto">
          {(
            [
              ["1", "home", o.home],
              ["X", "draw", o.draw],
              ["2", "away", o.away],
            ] as const
          ).map(([lbl, key, odds]) => {
            if (odds == null) return null;
            const selected = hasLeg(event.id, "one_x_two", key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => pick(key, odds)}
                className={clsx(
                  "match-card__odds match-card__odds--sm",
                  selected && "match-card__odds--on"
                )}
              >
                <span className="match-card__odds-lbl">{lbl}</span>
                <span className="match-card__odds-val">{odds.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
