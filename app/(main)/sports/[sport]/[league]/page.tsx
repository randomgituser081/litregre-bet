"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventRow, type EventRowData } from "@/components/betting/EventRow";

export default function LeaguePage() {
  const params = useParams<{ sport: string; league: string }>();
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    void fetch(`/api/events?league=${params.league}`)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.items || []);
        setTitle(d.items?.[0]?.leagueName || params.league.toUpperCase());
      });
  }, [params.league]);

  return (
    <div className="px-3 py-4 space-y-3 pb-24">
      <h1 className="text-lg font-black">{title}</h1>
      {events.map((ev) => (
        <EventRow key={ev.id} event={ev} />
      ))}
      {!events.length && (
        <p className="text-center text-white/40 py-12 text-sm">No fixtures</p>
      )}
    </div>
  );
}
