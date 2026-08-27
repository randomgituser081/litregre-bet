"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Radio, Flame } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";

type Sport = {
  id: string;
  name: string;
  slug: string;
  leagues: {
    id: string;
    name: string;
    slug: string;
    country: string;
    isPopular: boolean;
  }[];
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
    <div className="pb-24">
      <PageHeader
        title="Sports"
        subtitle="Browse leagues and markets"
        backHref="/"
      />

      <div className="px-3 sm:px-5 mb-4 grid grid-cols-2 gap-2">
        <Link
          href="/?tab=live"
          className="card-surface rounded-2xl p-4 flex items-center gap-3 hover:border-accent-green/40"
        >
          <span className="w-10 h-10 rounded-xl bg-accent-red/15 text-accent-red flex items-center justify-center">
            <Radio size={18} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink">Live now</p>
            <p className="text-[11px] text-muted">In-play football</p>
          </div>
        </Link>
        <Link
          href="/?tab=today"
          className="card-surface rounded-2xl p-4 flex items-center gap-3 hover:border-accent-green/40"
        >
          <span className="w-10 h-10 rounded-xl bg-accent-green/15 text-accent-green flex items-center justify-center">
            <Flame size={18} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink">Today</p>
            <p className="text-[11px] text-muted">Today’s football</p>
          </div>
        </Link>
      </div>

      <div className="px-3 sm:px-5 flex gap-2 overflow-x-auto pb-3 scrollbar-none">
        {sports.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSport(s.slug)}
            className={clsx(
              "shrink-0 h-10 px-4 rounded-full text-[13px] font-bold transition",
              activeSport === s.slug
                ? "bg-accent-green text-[#0A1433]"
                : "card-surface text-muted hover:text-ink"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="px-3 sm:px-5 space-y-4">
        {popular.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 px-0.5">
              <Trophy size={15} className="text-accent-green" />
              <h2 className="text-[14px] font-black text-ink">Popular leagues</h2>
            </div>
            <div className="card-surface rounded-2xl overflow-hidden divide-y divide-surface-border">
              {popular.map((l) => (
                <Link
                  key={l.id}
                  href={`/sports/${sport?.slug}/${l.slug}`}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-[var(--surface-raised)]"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{l.name}</p>
                    <p className="text-[11px] text-muted">{l.country}</p>
                  </div>
                  <span className="text-[11px] font-bold text-accent-green">
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section>
            <h2 className="text-[14px] font-black text-ink mb-2 px-0.5">
              All {sport?.name || "leagues"}
            </h2>
            <div className="card-surface rounded-2xl overflow-hidden divide-y divide-surface-border">
              {rest.map((l) => (
                <Link
                  key={l.id}
                  href={`/sports/${sport?.slug}/${l.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-raised)]"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{l.name}</p>
                    <p className="text-[11px] text-muted">{l.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!sports.length && (
          <p className="text-sm text-muted text-center py-10">
            No sports loaded — run{" "}
            <code className="text-accent-green">npm run db:seed</code>
          </p>
        )}
      </div>
    </div>
  );
}
