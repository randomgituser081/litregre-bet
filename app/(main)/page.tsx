"use client";

import { useEffect, useState } from "react";
import { QuickFilters } from "@/components/home/QuickFilters";
import { FeaturedCard } from "@/components/home/FeaturedCard";
import { LiveStrip } from "@/components/home/LiveStrip";
import { EventRow, type EventRowData } from "@/components/betting/EventRow";

const FILTERS = [
  { id: "all", label: "Today's Football" },
  { id: "live", label: "Live" },
  { id: "featured", label: "Featured" },
  { id: "ucl", label: "Champions League" },
  { id: "epl", label: "Premier League" },
];

export default function HomePage() {
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter === "live") params.set("filter", "live");
    if (filter === "featured") params.set("filter", "featured");
    if (filter === "ucl") params.set("league", "ucl");
    if (filter === "epl") params.set("league", "epl");

    void fetch(`/api/events?${params}`)
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const featured = events.find((e) => e.isFeatured) || events[0];
  const live = events.filter((e) => e.status === "live");
  const upcoming = events.filter((e) => e.status !== "live");

  return (
    <div className="space-y-4 pt-3 pb-24">
      <QuickFilters items={FILTERS} active={filter} onChange={setFilter} />

      {loading && (
        <div className="px-3 space-y-2">
          <div className="skeleton h-36 w-full" />
          <div className="skeleton h-24 w-full" />
        </div>
      )}

      {!loading && featured && filter !== "live" && (
        <FeaturedCard event={featured} />
      )}

      {!loading && live.length > 0 && filter !== "featured" && (
        <LiveStrip events={live} />
      )}

      {!loading && (
        <section className="px-3 space-y-2">
          <h2 className="text-sm font-bold text-white/80">Highlights</h2>
          {upcoming.length === 0 && live.length === 0 && (
            <p className="text-sm text-white/40 py-8 text-center">
              No events — run <code className="text-accent-green">npm run db:seed</code>
            </p>
          )}
          {upcoming.map((ev) => (
            <EventRow key={ev.id} event={ev} />
          ))}
        </section>
      )}
    </div>
  );
}
