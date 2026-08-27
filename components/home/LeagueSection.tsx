"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EventRow, type EventRowData } from "@/components/betting/EventRow";

type Props = {
  title: string;
  href?: string;
  events: EventRowData[];
  showOddsLabels?: boolean;
};

export function LeagueSection({
  title,
  href = "/sports",
  events,
  showOddsLabels = true,
}: Props) {
  if (!events.length) return null;

  return (
    <section className="league-section">
      <div className="league-section__head">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-green shrink-0" />
        <h3 className="flex-1 text-[12px] font-bold truncate tracking-tight">
          {title}
        </h3>
        <span className="text-[10px] font-bold tabular-nums text-white/55">
          {events.length}
        </span>
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-accent-lime hover:text-white transition-colors"
        >
          All
          <ChevronRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

      {showOddsLabels && (
        <div className="flex items-center justify-end gap-1 px-2.5 pt-1.5 pb-0.5 text-[9px] font-black text-muted uppercase tracking-wider">
          <span className="w-[3.1rem] text-center">1</span>
          <span className="w-[3.1rem] text-center">X</span>
          <span className="w-[3.1rem] text-center">2</span>
          <span className="w-7" />
        </div>
      )}

      <div>
        {events.map((ev) => (
          <EventRow key={ev.id} event={ev} />
        ))}
      </div>

      <Link href={href} className="league-section__foot">
        More from {title}
      </Link>
    </section>
  );
}
