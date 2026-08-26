"use client";

import { EventRow, type EventRowData } from "@/components/betting/EventRow";

export function LiveStrip({ events }: { events: EventRowData[] }) {
  if (!events.length) return null;
  return (
    <section className="px-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        <h2 className="text-sm font-bold">Live ({events.length})</h2>
      </div>
      <div className="space-y-2">
        {events.map((ev) => (
          <EventRow key={ev.id} event={ev} compact />
        ))}
      </div>
    </section>
  );
}
