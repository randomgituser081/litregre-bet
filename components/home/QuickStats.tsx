"use client";

import { Activity, Trophy, TrendingUp, Headphones } from "lucide-react";
import clsx from "clsx";

type Props = {
  liveCount?: number;
};

const STATS = [
  {
    icon: Activity,
    label: "Live Events",
    key: "live" as const,
    glow: "green" as const,
  },
  {
    icon: Trophy,
    label: "Top Leagues",
    value: "8",
    glow: "lime" as const,
  },
  {
    icon: TrendingUp,
    label: "Payout Rate",
    value: "97.6%",
    glow: "green" as const,
  },
  {
    icon: Headphones,
    label: "Support",
    value: "24/7",
    glow: "lime" as const,
  },
];

export function QuickStats({ liveCount = 0 }: Props) {
  return (
    <section className="grid grid-cols-2 gap-2.5 sm:gap-3 py-2">
      {STATS.map(({ icon: Icon, label, key, value, glow }) => (
        <div
          key={label}
          className={clsx(
            "neon-stat-card rounded-2xl p-3.5 flex items-center gap-3",
            glow === "green" ? "neon-stat-cyan" : "neon-stat-green"
          )}
        >
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
              glow === "green"
                ? "bg-accent-green/10 border-accent-green/25"
                : "bg-accent-lime/10 border-accent-lime/25"
            )}
          >
            <Icon
              size={18}
              className={
                glow === "green" ? "text-accent-green" : "text-accent-lime"
              }
            />
          </div>
          <div>
            <p className="text-xl font-black leading-none tabular-nums text-ink">
              {key === "live" ? liveCount || "—" : value}
            </p>
            <p className="text-[10px] text-muted font-medium mt-1">{label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
