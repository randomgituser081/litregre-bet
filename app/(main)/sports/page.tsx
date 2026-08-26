"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type Sport = {
  id: string;
  name: string;
  slug: string;
  leagues: { id: string; name: string; slug: string; country: string; isPopular: boolean }[];
};

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [activeSport, setActiveSport] = useState<string>("football");

  useEffect(() => {
    void fetch("/api/sports")
      .then((r) => r.json())
      .then((d) => {
        setSports(d.sports || []);
        if (d.sports?.[0]) setActiveSport(d.sports[0].slug);
      });
  }, []);

  const sport = sports.find((s) => s.slug === activeSport) || sports[0];
  const popular = sport?.leagues.filter((l) => l.isPopular) || [];
  const rest = sport?.leagues.filter((l) => !l.isPopular) || [];

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="w-28 shrink-0 border-r border-surface-border bg-surface-card">
        <p className="text-[10px] font-bold text-accent-green px-2 py-3">Popular</p>
        {sports.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSport(s.slug)}
            className={clsx(
              "w-full text-left px-2 py-2.5 text-xs font-medium border-l-2",
              activeSport === s.slug
                ? "border-accent-green text-accent-green bg-white/5"
                : "border-transparent text-white/60"
            )}
          >
            {s.name}
          </button>
        ))}
      </aside>
      <div className="flex-1 p-3 overflow-y-auto pb-24">
        <p className="text-xs text-white/40 mb-2">Quick links</p>
        <Link
          href="/"
          className="block py-2 text-sm font-semibold border-b border-surface-border"
        >
          Today&apos;s Football
        </Link>
        <Link
          href="/?filter=live"
          className="block py-2 text-sm font-semibold border-b border-surface-border"
        >
          Live Now
        </Link>
        {popular.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-white/40 mt-4 mb-2 uppercase">
              Popular leagues
            </p>
            {popular.map((l) => (
              <Link
                key={l.id}
                href={`/sports/${sport?.slug}/${l.slug}`}
                className="block py-2.5 text-sm font-semibold border-b border-surface-border hover:text-accent-green"
              >
                {l.name}
              </Link>
            ))}
          </>
        )}
        {rest.map((l) => (
          <Link
            key={l.id}
            href={`/sports/${sport?.slug}/${l.slug}`}
            className="block py-2.5 text-sm text-white/70 border-b border-surface-border"
          >
            {l.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
