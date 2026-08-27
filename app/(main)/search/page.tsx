"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EventList } from "@/components/betting/EventList";
import type { EventRowData } from "@/components/betting/EventRow";

function SearchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [sports, setSports] = useState<
    { name: string; slug: string; leagues: { name: string; slug: string }[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  useEffect(() => {
    void Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/sports").then((r) => r.json()),
    ])
      .then(([ev, sp]) => {
        setEvents(ev.items || []);
        setSports(sp.sports || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const needle = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return [];
    return events.filter((e) => {
      const hay = [e.homeTeam, e.awayTeam, e.leagueName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [events, needle]);

  const leagueHits = useMemo(() => {
    if (!needle) return [];
    const out: { sport: string; name: string; href: string }[] = [];
    for (const s of sports) {
      for (const l of s.leagues || []) {
        if (
          l.name.toLowerCase().includes(needle) ||
          l.slug.includes(needle) ||
          s.name.toLowerCase().includes(needle)
        ) {
          out.push({
            sport: s.name,
            name: l.name,
            href: `/sports/${s.slug}/${l.slug}`,
          });
        }
      }
    }
    return out.slice(0, 8);
  }, [sports, needle]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = q.trim();
    router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  }

  return (
    <div className="pb-24">
      <PageHeader title="Search" subtitle="Matches & leagues" backHref="/" />

      <form onSubmit={submit} className="px-3 sm:px-5 mb-4">
        <label className="flex items-center gap-2 h-12 rounded-2xl px-4 card-surface">
          <Search size={17} className="text-muted shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Arsenal, EPL, UCL…"
            className="w-full bg-transparent text-[14px] font-medium outline-none text-ink placeholder:text-muted"
            autoFocus
          />
        </label>
      </form>

      <div className="px-3 sm:px-5 space-y-5">
        {!needle && (
          <div className="card-surface rounded-2xl p-6 text-center">
            <p className="text-sm text-muted">
              Type a team or league to find fixtures.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Arsenal", "EPL", "UCL", "Chelsea"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setQ(chip);
                    router.replace(`/search?q=${encodeURIComponent(chip)}`);
                  }}
                  className="rounded-full px-3 py-1.5 text-[12px] font-bold bg-[var(--surface-raised)] text-ink hover:text-accent-green"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {needle && leagueHits.length > 0 && (
          <div>
            <h2 className="text-[13px] font-bold text-muted uppercase tracking-wide mb-2">
              Leagues
            </h2>
            <div className="card-surface rounded-2xl divide-y divide-surface-border overflow-hidden">
              {leagueHits.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-raised)]"
                >
                  <span className="text-[14px] font-semibold text-ink">
                    {l.name}
                  </span>
                  <span className="text-[11px] text-muted">{l.sport}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {needle && (
          <div>
            <h2 className="text-[13px] font-bold text-muted uppercase tracking-wide mb-2">
              Matches · {loading ? "…" : matches.length}
            </h2>
            {loading ? (
              <div className="skeleton h-16 w-full rounded-xl" />
            ) : matches.length ? (
              <EventList events={matches} />
            ) : (
              <div className="card-surface rounded-2xl p-6 text-center text-sm text-muted">
                No matches for “{q}”.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5">
          <div className="skeleton h-10 w-48 rounded-xl mb-4" />
          <div className="skeleton h-12 w-full rounded-2xl" />
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
