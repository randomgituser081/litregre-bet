"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EventList } from "@/components/betting/EventList";
import type { EventRowData } from "@/components/betting/EventRow";
import { PageHeader } from "@/components/layout/PageHeader";

export default function LeaguePage() {
  const params = useParams<{ sport: string; league: string }>();
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void fetch(`/api/events?league=${params.league}`)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.items || []);
        setTitle(d.items?.[0]?.leagueName || params.league.toUpperCase());
      })
      .finally(() => setLoading(false));
  }, [params.league]);

  return (
    <div className="pb-24">
      <PageHeader
        title={title || "League"}
        subtitle={`${params.sport} · ${events.length} fixture${
          events.length === 1 ? "" : "s"
        }`}
        backHref="/sports"
      />
      <div className="px-3 sm:px-5">
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-14 w-full rounded-xl" />
            <div className="skeleton h-14 w-full rounded-xl" />
          </div>
        ) : events.length ? (
          <EventList events={events} emptyLabel="No fixtures" />
        ) : (
          <div className="card-surface rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-muted">No fixtures in this league yet.</p>
            <Link
              href="/sports"
              className="inline-flex text-[13px] font-bold text-accent-green"
            >
              Back to sports →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
