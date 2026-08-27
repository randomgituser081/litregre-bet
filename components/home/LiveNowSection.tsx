"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { SlidersHorizontal, Trophy } from "lucide-react";
import type { MarketType } from "@prisma/client";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel } from "@/lib/betting/markets";
import type { EventRowData } from "@/components/betting/EventRow";

const SPORT_FILTERS = ["All", "Football", "Basketball", "Tennis", "Esports"];

function teamDot(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Props = {
  events: EventRowData[];
};

export function LiveNowSection({ events }: Props) {
  const [filter, setFilter] = useState("All");
  const addLeg = useSlipStore((s) => s.addLeg);
  const hasLeg = useSlipStore((s) => s.hasLeg);

  const live = events.filter((e) => e.status === "live");

  function pick(ev: EventRowData, key: string, odds: number) {
    const marketType = "one_x_two" as MarketType;
    addLeg({
      eventId: ev.id,
      homeTeam: ev.homeTeam,
      awayTeam: ev.awayTeam,
      marketType,
      outcomeKey: key,
      outcomeLabel: outcomeLabel(marketType, key, ev.homeTeam, ev.awayTeam),
      odds,
    });
  }

  return (
    <section className="pb-6 space-y-3">
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-base font-black tracking-tight">Live Now</h2>
        <Link
          href="/?tab=live"
          className="text-xs font-bold text-accent-green hover:text-accent-green/80"
        >
          See all
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {SPORT_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={clsx(
              "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all",
              filter === f
                ? "bg-accent-green/10 border-accent-green/50 text-accent-green shadow-[0_0_12px_rgba(57,255,20,0.15)]"
                : "border-surface-border text-muted hover:border-accent-green/30"
            )}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          className="shrink-0 w-9 h-9 rounded-full border border-surface-border flex items-center justify-center text-muted hover:border-accent-green/40 hover:text-accent-green"
          aria-label="Filters"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {live.length === 0 ? (
        <div className="neon-stat-card neon-stat-cyan rounded-2xl p-6 text-center">
          <p className="text-sm text-muted">No live matches right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {live.map((ev) => {
            const o = ev.odds1x2 || {};
            return (
              <article
                key={ev.id}
                className="neon-stat-card neon-stat-cyan rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-wide">
                    <Trophy size={12} className="text-accent-green" />
                    {ev.leagueName || "Football"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-black text-accent-red uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                      Live
                    </span>
                    <span className="text-[10px] font-bold text-muted tabular-nums">
                      {ev.liveMinute || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center text-[9px] font-black shrink-0 text-ink">
                      {teamDot(ev.homeTeam)}
                    </span>
                    <span className="font-bold text-sm truncate text-ink">{ev.homeTeam}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 px-2">
                    <span className="text-xl font-black tabular-nums text-ink">
                      {ev.homeScore ?? 0}
                    </span>
                    <span className="text-muted text-xs font-bold">–</span>
                    <span className="text-xl font-black tabular-nums text-ink">
                      {ev.awayScore ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="font-bold text-sm truncate text-right text-ink">
                      {ev.awayTeam}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center text-[9px] font-black shrink-0 text-ink">
                      {teamDot(ev.awayTeam)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["1", "home", o.home],
                      ["X", "draw", o.draw],
                      ["2", "away", o.away],
                    ] as const
                  ).map(([lbl, key, odds]) => {
                    if (odds == null) return null;
                    const selected = hasLeg(ev.id, "one_x_two", key);
                    const isHome = key === "home";
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => pick(ev, key, odds)}
                        className={clsx(
                          "showdown-odds py-2.5",
                          selected && "showdown-odds-active",
                          isHome && !selected && "border-accent-green/30 bg-accent-green/[0.06]"
                        )}
                      >
                        <span className="text-[10px] text-muted font-semibold">
                          {lbl}
                        </span>
                        <span
                          className={clsx(
                            "text-sm font-black tabular-nums",
                            selected || isHome
                              ? "text-accent-green"
                              : "text-ink"
                          )}
                        >
                          {odds.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
