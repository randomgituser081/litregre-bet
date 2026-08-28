"use client";

import { X } from "lucide-react";
import { useSlipStore } from "@/lib/slip-store";
import { combinedOdds, formatNaira, parseStakeToKobo } from "@/lib/utils";

export function SlipPreviewBar() {
  const legs = useSlipStore((s) => s.legs);
  const stake = useSlipStore((s) => s.stake);
  const open = useSlipStore((s) => s.open);
  const setOpen = useSlipStore((s) => s.setOpen);
  const clear = useSlipStore((s) => s.clear);

  if (!legs.length || open) return null;

  const totalOdds = combinedOdds(legs.map((l) => l.odds));
  const stakeKobo = parseStakeToKobo(stake);
  const potential =
    stakeKobo > BigInt(0) ? Number(stakeKobo) * totalOdds : 0;

  return (
    <div className="fixed left-0 right-0 z-[88] bottom-[5.15rem] px-2 max-w-lg lg:max-w-[42rem] mx-auto animate-slide-up">
      <div className="rounded-md border-2 border-accent-green/50 bg-surface-card shadow-[0_8px_28px_rgba(34,211,102,0.2)] overflow-hidden">
        <div className="p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs font-black flex items-center gap-2 text-ink"
            >
              Betslip
              <span className="bg-accent-green text-[#0A1433] text-[10px] px-1.5 py-0.5 rounded font-bold">
                {legs.length}
              </span>
            </button>
            <button
              type="button"
              onClick={clear}
              className="text-[10px] text-muted font-semibold flex items-center gap-1 hover:text-ink"
            >
              Clear all <X size={12} />
            </button>
          </div>

          <div className="space-y-1 max-h-16 overflow-y-auto">
            {legs.slice(0, 3).map((leg) => (
              <div
                key={`${leg.eventId}-${leg.outcomeKey}`}
                className="flex justify-between text-[11px] gap-2"
              >
                <span className="truncate text-muted">
                  {leg.homeTeam} vs {leg.awayTeam}
                  <span className="opacity-50 ml-1.5">{leg.outcomeLabel}</span>
                </span>
                <span className="shrink-0 font-bold text-accent-green tabular-nums">
                  {leg.odds.toFixed(2)}
                </span>
              </div>
            ))}
            {legs.length > 3 && (
              <p className="text-[10px] text-muted">+{legs.length - 3} more</p>
            )}
          </div>

          <div className="flex items-end justify-between gap-3 pt-1.5 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-left"
            >
              <p className="text-[10px] text-muted">Potential payout</p>
              <p className="text-base font-black text-accent-green tabular-nums leading-tight">
                {formatNaira(Math.round(potential))}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
            className="shrink-0 bg-accent-green text-[#0A1433] font-black text-[12px] px-4 py-2 rounded shadow-[0_0_16px_rgba(34,211,102,0.35)]"
            >
              Place Bet · {formatNaira(Number(stakeKobo))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
