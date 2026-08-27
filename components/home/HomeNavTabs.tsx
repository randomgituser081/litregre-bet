"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { id: "home", label: "Popular" },
  { id: "live", label: "Live" },
  { id: "today", label: "Today" },
  { id: "early", label: "Early" },
] as const;

type Props = {
  active: string;
  onChange: (id: string) => void;
  liveCount?: number;
};

export function HomeNavTabs({ active, onChange, liveCount = 0 }: Props) {
  const router = useRouter();

  return (
    <nav className="flex gap-1.5 p-1.5 rounded-2xl bg-[#121A2F] border border-white/8">
      {TABS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              onChange(id);
              if (id === "live") router.push("/?tab=live");
              else if (id === "home") router.push("/");
              else router.push(`/?tab=${id}`);
            }}
            className={clsx(
              "flex-1 py-2.5 text-[12px] sm:text-[13px] font-bold rounded-xl transition-all",
              isActive
                ? "bg-accent-green text-[#0A1433]"
                : "text-white/55 hover:text-white hover:bg-white/5"
            )}
          >
            <span className="inline-flex items-center justify-center gap-1">
              {label}
              {id === "live" && liveCount > 0 && (
                <span
                  className={clsx(
                    "text-[10px] font-black px-1 rounded-sm leading-4",
                    isActive
                      ? "bg-[#0A1433] text-accent-lime"
                      : "bg-accent-red text-white"
                  )}
                >
                  {liveCount}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
