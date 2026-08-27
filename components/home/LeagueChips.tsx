"use client";

import Link from "next/link";
import clsx from "clsx";

const LEAGUES = [
  { id: "all", label: "All", href: "/sports" },
  { id: "epl", label: "EPL", href: "/sports/football/epl" },
  { id: "ucl", label: "UCL", href: "/sports/football/ucl" },
  { id: "laliga", label: "La Liga", href: "/sports/football/laliga" },
  { id: "seriea", label: "Serie A", href: "/sports/football/serie-a" },
  { id: "bundesliga", label: "Bundesliga", href: "/sports/football/bundesliga" },
];

type Props = {
  active?: string;
};

export function LeagueChips({ active = "all" }: Props) {
  return (
    <div className="overflow-x-auto no-scrollbar px-3 lg:px-5 py-3">
      <div className="flex min-w-max gap-2">
        {LEAGUES.map((lg) => {
          const isActive = active === lg.id;
          return (
            <Link
              key={lg.id}
              href={lg.href}
              className={clsx(
                "px-3.5 py-2 text-[12px] font-bold whitespace-nowrap rounded-full border transition-all",
                isActive
                  ? "bg-accent-green border-accent-green text-[#0A1433]"
                  : "bg-[#121A2F] border-white/10 text-white/65 hover:border-accent-green/40 hover:text-white"
              )}
            >
              {lg.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
