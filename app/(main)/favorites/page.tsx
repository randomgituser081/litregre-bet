"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, Clock, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EventList } from "@/components/betting/EventList";
import type { EventRowData } from "@/components/betting/EventRow";

const FAV_KEY = "lg-bet-favorites";
const RECENT_KEY = "lg-bet-recent";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function FavoritesInner() {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "recent" ? "recent" : "favorites";
  const [tab, setTab] = useState<"favorites" | "recent">(initialTab);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setFavIds(readIds(FAV_KEY));
    setRecentIds(readIds(RECENT_KEY));
    void fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const ids = tab === "favorites" ? favIds : recentIds;

  const filtered = useMemo(() => {
    if (!ids.length) return [];
    const map = new Map(events.map((e) => [e.id, e]));
    return ids.map((id) => map.get(id)).filter(Boolean) as EventRowData[];
  }, [events, ids]);

  useEffect(() => {
    if (loading || favIds.length > 0 || !events.length) return;
    const seed = events
      .filter((e) => e.isHot || e.isFeatured || e.status === "live")
      .slice(0, 4)
      .map((e) => e.id);
    if (!seed.length) return;
    localStorage.setItem(FAV_KEY, JSON.stringify(seed));
    setFavIds(seed);
  }, [loading, favIds.length, events]);

  function clearFavorites() {
    localStorage.removeItem(FAV_KEY);
    setFavIds([]);
  }

  return (
    <div className="pb-24">
      <PageHeader
        title="Your picks"
        subtitle="Favorites & recently opened matches"
        backHref="/"
        action={
          tab === "favorites" && favIds.length > 0 ? (
            <button
              type="button"
              onClick={clearFavorites}
              className="w-10 h-10 rounded-2xl flex items-center justify-center card-surface text-muted hover:text-ink"
              aria-label="Clear favorites"
            >
              <Trash2 size={16} />
            </button>
          ) : null
        }
      />

      <div className="px-3 sm:px-5 mb-4">
        <div
          className="grid grid-cols-2 gap-1 p-1 rounded-[1.15rem]"
          style={{ background: "var(--surface-raised)" }}
        >
          {(
            [
              { id: "favorites" as const, label: "Favorites", icon: Heart },
              { id: "recent" as const, label: "Recently played", icon: Clock },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center justify-center gap-2 h-11 rounded-[0.95rem] text-[13px] font-bold transition ${
                tab === id
                  ? "bg-accent-green text-[#0A1433]"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 sm:px-5">
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-14 w-full rounded-xl" />
            <div className="skeleton h-14 w-full rounded-xl" />
          </div>
        ) : filtered.length > 0 ? (
          <EventList events={filtered} />
        ) : (
          <div className="card-surface rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-muted">
              {tab === "favorites"
                ? "No favorites yet. Open a match and it’ll show up here."
                : "No recently opened matches yet."}
            </p>
            <Link
              href="/sports"
              className="inline-flex h-10 items-center rounded-full bg-accent-green text-[#0A1433] px-5 text-[13px] font-bold"
            >
              Browse sports
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5 space-y-3">
          <div className="skeleton h-10 w-48 rounded-xl" />
          <div className="skeleton h-12 w-full rounded-2xl" />
        </div>
      }
    >
      <FavoritesInner />
    </Suspense>
  );
}
