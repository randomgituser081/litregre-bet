"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import clsx from "clsx";
import { Flame, ChevronRight, Clock } from "lucide-react";
import type { MarketType } from "@prisma/client";
import { useSlipStore } from "@/lib/slip-store";
import { outcomeLabel } from "@/lib/betting/markets";
import type { FeaturedSlideVisual } from "@/lib/home/featured-slides";

export type FeaturedSlide = FeaturedSlideVisual & {
  eventId?: string;
  kickoff?: string;
  odds1x2?: { home?: number; draw?: number; away?: number };
};

type Props = {
  slides: FeaturedSlide[];
};

/**
 * Layout A — full-bleed sports hero with match + 1X2 overlay.
 * Real football only (no virtuals / casino).
 */
export function FeaturedSlider({ slides }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const addLeg = useSlipStore((s) => s.addLeg);
  const hasLeg = useSlipStore((s) => s.hasLeg);
  const gap = 12;

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const el = scrollRef.current;
    if (!el?.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth;
    el.scrollTo({
      left: i * (w + gap),
      behavior: smooth ? "smooth" : "auto",
    });
    setActive(i);
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el?.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth;
    const idx = Math.round(el.scrollLeft / (w + gap));
    setActive(Math.min(Math.max(idx, 0), slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => {
        const next = (prev + 1) % slides.length;
        const el = scrollRef.current;
        if (el?.firstElementChild) {
          const w = (el.firstElementChild as HTMLElement).offsetWidth;
          el.scrollTo({ left: next * (w + gap), behavior: "smooth" });
        }
        return next;
      });
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  function scrollTo(i: number) {
    pausedRef.current = true;
    scrollToIndex(i);
    window.setTimeout(() => {
      pausedRef.current = false;
    }, 8000);
  }

  function pick(slide: FeaturedSlide, key: string, odds: number) {
    if (!slide.eventId) return;
    const marketType = "one_x_two" as MarketType;
    addLeg({
      eventId: slide.eventId,
      homeTeam: slide.homeTeam,
      awayTeam: slide.awayTeam,
      marketType,
      outcomeKey: key,
      outcomeLabel: outcomeLabel(
        marketType,
        key,
        slide.homeTeam,
        slide.awayTeam
      ),
      odds,
    });
  }

  if (!slides.length) return null;

  return (
    <section
      className="bg-[#06101f] px-0 sm:px-4 sm:py-3"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        window.setTimeout(() => {
          pausedRef.current = false;
        }, 6000);
      }}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar sm:gap-3"
        >
          {slides.map((slide, i) => {
            const o = slide.odds1x2 ?? { home: 1.87, draw: 3.8, away: 4.45 };
            const kick = slide.kickoff ? dayjs(slide.kickoff) : null;
            const timeLabel = kick?.isValid()
              ? kick.format("ddd · HH:mm")
              : "Today · 20:00";

            return (
              <article
                key={slide.id}
                className="snap-center shrink-0 w-full overflow-hidden sm:rounded-2xl sm:border sm:border-accent-green/35 sm:shadow-[0_12px_40px_rgba(34,211,102,0.18)]"
              >
                <div className="relative h-[18.5rem] sm:h-[20rem] lg:h-[22rem] bg-[#0A1433]">
                  <Image
                    src={slide.artwork}
                    alt=""
                    fill
                    priority={i === 0}
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                  {/* Readability gradients — keep art visible up top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06101f] via-[#06101f]/50 to-[#06101f]/15" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#06101f]/55 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-accent-green px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#0A1433]">
                        <Flame size={11} strokeWidth={2.5} />
                        Featured
                      </span>
                      <span className="rounded-md border border-white/20 bg-black/45 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        {slide.leagueLabel}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                      <Clock size={11} />
                      {timeLabel}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-lime">
                      {slide.homePlayer} · {slide.awayPlayer}
                    </p>
                    <h2 className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">
                      {slide.homeTeam}
                      <span className="mx-2 text-sm font-bold text-white/40">
                        vs
                      </span>
                      {slide.awayTeam}
                    </h2>

                    <div className="mt-3.5 grid grid-cols-3 gap-2">
                      {(
                        [
                          ["1", "home", o.home, slide.homeTeam],
                          ["X", "draw", o.draw, "Draw"],
                          ["2", "away", o.away, slide.awayTeam],
                        ] as const
                      ).map(([lbl, key, odds, tip]) => {
                        if (odds == null) return null;
                        const selected =
                          !!slide.eventId &&
                          hasLeg(slide.eventId, "one_x_two", key);
                        return (
                          <button
                            key={key}
                            type="button"
                            title={tip}
                            disabled={!slide.eventId}
                            onClick={() => pick(slide, key, odds)}
                            className={clsx(
                              "flex flex-col items-center justify-center rounded-xl border py-2.5 transition-all active:scale-[0.97] disabled:opacity-60",
                              selected
                                ? "border-accent-lime bg-accent-green text-[#0A1433] shadow-neon-green-sm"
                                : "border-white/20 bg-black/50 text-white backdrop-blur-md hover:border-accent-green/70 hover:bg-accent-green/20"
                            )}
                          >
                            <span className="text-[10px] font-semibold opacity-75">
                              {lbl}
                            </span>
                            <span
                              className={clsx(
                                "text-lg font-black tabular-nums",
                                selected
                                  ? "text-[#0A1433]"
                                  : "text-accent-lime"
                              )}
                            >
                              {odds.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {[
                        { label: "GG", odds: "1.72" },
                        { label: "Over 2.5", odds: "1.85" },
                        { label: "1X", odds: "1.28" },
                      ].map((m) => (
                        <span
                          key={m.label}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-accent-green/30 bg-accent-green/10 px-2.5 py-1.5 text-[11px] font-bold text-white/90"
                        >
                          <span className="text-white/50">{m.label}</span>
                          <span className="tabular-nums text-accent-lime">
                            {m.odds}
                          </span>
                        </span>
                      ))}
                      {slide.eventId && (
                        <Link
                          href={`/event/${slide.eventId}`}
                          className="ml-auto inline-flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-black text-accent-green"
                        >
                          All markets
                          <ChevronRight size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {slides.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 pb-1 sm:pb-0">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={clsx(
                  "rounded-full transition-all",
                  i === active
                    ? "h-1.5 w-6 bg-accent-green"
                    : "h-1.5 w-1.5 bg-white/35 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
