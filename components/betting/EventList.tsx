"use client";

import { useMemo } from "react";
import { EventRow, type EventRowData } from "@/components/betting/EventRow";
import { LeagueSection } from "@/components/home/LeagueSection";

type Props = {
  events: EventRowData[];
  emptyLabel?: string;
};

function groupByLeague(events: EventRowData[]) {
  const map = new Map<string, EventRowData[]>();
  for (const ev of events) {
    const key = ev.leagueName || "Football";
    const list = map.get(key) || [];
    list.push(ev);
    map.set(key, list);
  }
  return Array.from(map.entries());
}

export function EventList({
  events,
  emptyLabel = "No fixtures available",
}: Props) {
  const groups = useMemo(() => groupByLeague(events), [events]);

  if (!events.length) {
    return (
      <p className="text-sm text-muted text-center py-10 px-4">{emptyLabel}</p>
    );
  }

  return (
    <div className="space-y-2.5 px-3 lg:px-5 pt-1">
      {groups.map(([league, items]) => (
        <LeagueSection key={league} title={league} events={items} />
      ))}
    </div>
  );
}

/** Flat list without league grouping — kept for callers that need raw rows */
export function EventRows({ events }: { events: EventRowData[] }) {
  return (
    <div>
      {events.map((ev) => (
        <EventRow key={ev.id} event={ev} showLeague />
      ))}
    </div>
  );
}
