"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MatchCard } from "@/components/home/MatchCard";
import type { EventRowData } from "@/components/betting/EventRow";

type Props = {
  title: string;
  icon?: ReactNode;
  href?: string;
  events: EventRowData[];
  emptyLabel?: string;
  accent?: "live" | "hot" | "default";
};

export function SportsRail({
  title,
  icon,
  href = "/sports",
  events,
  emptyLabel: _emptyLabel = "No fixtures right now",
  accent = "default",
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  if (!events.length) return null;

  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && (
            <span
              className={
                accent === "live"
                  ? "rail-icon rail-icon--live"
                  : accent === "hot"
                    ? "rail-icon rail-icon--hot"
                    : "rail-icon"
              }
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-[16px] sm:text-[17px] font-black text-ink truncate tracking-tight">
              {title}
            </h2>
            <p className="text-[10px] text-muted font-medium">
              {events.length} fixture{events.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link href={href} className="rail-ctrl rail-ctrl--all">
            All
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="rail-ctrl"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="rail-ctrl"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5 -mx-0.5 px-0.5"
      >
        {events.map((ev) => (
          <MatchCard key={ev.id} event={ev} />
        ))}
      </div>
    </section>
  );
}
