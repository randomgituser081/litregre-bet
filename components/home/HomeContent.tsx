"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Flame, Radio, CalendarDays } from "lucide-react";
import { PromoHero } from "@/components/home/PromoHero";
import { SportsRail } from "@/components/home/SportsRail";
import { LeagueSection } from "@/components/home/LeagueSection";
import type { EventRowData } from "@/components/betting/EventRow";

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

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

export function HomeContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab"); // live | today | null
  const [events, setEvents] = useState<EventRowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = tab === "live" ? "?filter=live" : "";
    void fetch(`/api/events${q}`)
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const live = useMemo(
    () => events.filter((e) => e.status === "live"),
    [events]
  );

  const today = useMemo(
    () => events.filter((e) => e.status !== "live" && isToday(e.kickoff)),
    [events]
  );

  const featuredRail = useMemo(() => {
    if (live.length) return live;
    return [...events]
      .sort((a, b) => {
        const score = (e: EventRowData) =>
          (e.isHot ? 2 : 0) + (e.isFeatured ? 3 : 0);
        return score(b) - score(a);
      })
      .slice(0, 10);
  }, [events, live]);

  const listPool = useMemo(() => {
    const railIds = new Set(featuredRail.map((e) => e.id));
    const base =
      live.length > 0
        ? events.filter((e) => e.status !== "live")
        : events.filter((e) => !railIds.has(e.id) || e.status !== "live");
    return base.length ? base : events;
  }, [events, featuredRail, live]);

  const todayByLeague = useMemo(
    () => groupByLeague(today).slice(0, 6),
    [today]
  );

  const moreByLeague = useMemo(() => {
    const todayKeys = new Set(todayByLeague.map(([k]) => k));
    return groupByLeague(listPool)
      .filter(([league]) => !todayKeys.has(league) || today.length === 0)
      .slice(0, today.length ? 4 : 6);
  }, [listPool, todayByLeague, today.length]);

  const liveByLeague = useMemo(() => groupByLeague(live), [live]);

  // Focused tab views
  if (tab === "live") {
    return (
      <div className="px-3 lg:px-5 pb-10 pt-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="rail-icon">
            <Radio size={16} strokeWidth={2.4} />
          </span>
          <div>
            <h1 className="text-[18px] font-black text-ink tracking-tight">
              Live matches
            </h1>
            <p className="text-[12px] text-muted font-medium">
              {loading
                ? "Loading…"
                : `${live.length} live fixture${live.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-16 w-full rounded-xl" />
            <div className="skeleton h-16 w-full rounded-xl" />
          </div>
        ) : live.length === 0 ? (
          <div className="card-surface p-8 text-center">
            <p className="text-sm text-muted">No live matches right now.</p>
            <Link
              href="/?tab=today"
              className="inline-block mt-3 text-[13px] font-bold text-accent-green"
            >
              See today’s football →
            </Link>
          </div>
        ) : (
          liveByLeague.map(([league, items]) => (
            <LeagueSection
              key={league}
              title={league}
              href="/sports"
              events={items}
            />
          ))
        )}
      </div>
    );
  }

  if (tab === "today") {
    return (
      <div className="px-3 lg:px-5 pb-10 pt-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="rail-icon">
            <CalendarDays size={16} strokeWidth={2.4} />
          </span>
          <div>
            <h1 className="text-[18px] font-black text-ink tracking-tight">
              Today’s football
            </h1>
            <p className="text-[12px] text-muted font-medium">
              {loading
                ? "Loading…"
                : `${today.length + live.length} fixture${
                    today.length + live.length === 1 ? "" : "s"
                  }`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-16 w-full rounded-xl" />
            <div className="skeleton h-16 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {live.length > 0 && (
              <SportsRail
                title="Live now"
                icon={<Radio size={16} strokeWidth={2.4} />}
                href="/?tab=live"
                events={live}
                emptyLabel="No live"
                accent="live"
              />
            )}
            {todayByLeague.length > 0 ? (
              todayByLeague.map(([league, items]) => (
                <LeagueSection
                  key={league}
                  title={league}
                  href="/sports"
                  events={items}
                />
              ))
            ) : (
              <div className="card-surface p-8 text-center">
                <p className="text-sm text-muted">No more fixtures today.</p>
                <Link
                  href="/sports"
                  className="inline-block mt-3 text-[13px] font-bold text-accent-green"
                >
                  Browse all sports →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const railTitle = live.length ? "Live" : "Sports";
  const railAccent = live.length ? ("live" as const) : ("hot" as const);
  const railHref = live.length ? "/?tab=live" : "/sports";

  return (
    <div>
      <PromoHero />

      <div className="px-3 lg:px-5 pb-10 space-y-5 pt-0">
        {loading ? (
          <div className="space-y-5">
            <div className="skeleton h-9 w-44 rounded-xl" />
            <div className="flex gap-3 overflow-hidden">
              <div className="skeleton h-40 w-56 shrink-0 rounded-2xl" />
              <div className="skeleton h-40 w-56 shrink-0 rounded-2xl" />
              <div className="skeleton h-40 w-56 shrink-0 rounded-2xl" />
            </div>
            <div className="skeleton h-48 w-full rounded-xl" />
          </div>
        ) : (
          <>
            <SportsRail
              title={railTitle}
              icon={
                live.length ? (
                  <Radio size={16} strokeWidth={2.4} />
                ) : (
                  <Flame size={16} strokeWidth={2.4} />
                )
              }
              href={railHref}
              events={featuredRail}
              emptyLabel="No fixtures to feature"
              accent={railAccent}
            />

            {today.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-0.5">
                  <span className="rail-icon">
                    <CalendarDays size={16} strokeWidth={2.4} />
                  </span>
                  <div>
                    <h2 className="text-[16px] font-black text-ink tracking-tight">
                      Today
                    </h2>
                    <p className="text-[11px] text-muted font-medium">
                      {today.length} fixture{today.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                {todayByLeague.slice(0, 3).map(([league, items]) => (
                  <LeagueSection
                    key={`today-${league}`}
                    title={league}
                    href="/?tab=today"
                    events={items}
                  />
                ))}
              </div>
            )}

            {moreByLeague.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-0.5 pt-1">
                  <h2 className="text-[16px] font-black text-ink tracking-tight">
                    All football
                  </h2>
                </div>
                {moreByLeague.map(([league, items]) => (
                  <LeagueSection
                    key={league}
                    title={league}
                    href="/sports"
                    events={items}
                  />
                ))}
              </div>
            )}

            {!events.length && (
              <p className="text-sm text-muted text-center py-10">
                No fixtures yet — set{" "}
                <code className="text-accent-green">PREDICTION_API_PHONE</code>{" "}
                in Coolify and run sync, or{" "}
                <code className="text-accent-green">npm run sync:events</code>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="skeleton h-56 w-full rounded-[1.75rem]" />
      <div className="skeleton h-8 w-40 rounded-xl" />
      <div className="flex gap-3">
        <div className="skeleton h-40 w-56 rounded-2xl" />
        <div className="skeleton h-40 w-56 rounded-2xl" />
      </div>
      <div className="skeleton h-44 w-full rounded-xl" />
    </div>
  );
}
