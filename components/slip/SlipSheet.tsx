"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Trash2, Loader2, Copy, Download } from "lucide-react";
import { MAX_SLIP_LEGS } from "@/lib/constants";
import { combinedOdds, formatNaira, parseStakeToKobo } from "@/lib/utils";
import { slipLegKey, useSlipStore } from "@/lib/slip-store";

export function SlipSheet() {
  const open = useSlipStore((s) => s.open);
  const setOpen = useSlipStore((s) => s.setOpen);
  const legs = useSlipStore((s) => s.legs);
  const stake = useSlipStore((s) => s.stake);
  const setStake = useSlipStore((s) => s.setStake);
  const removeLeg = useSlipStore((s) => s.removeLeg);
  const clear = useSlipStore((s) => s.clear);
  const loadLegs = useSlipStore((s) => s.loadLegs);

  const [loadCode, setLoadCode] = useState("");
  const [loading, setLoading] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  if (!open) return null;

  const totalOdds = combinedOdds(legs.map((l) => l.odds));
  const stakeKobo = parseStakeToKobo(stake);
  const potential =
    stakeKobo > BigInt(0)
      ? Number(stakeKobo) * totalOdds
      : 0;

  async function handleGenerate() {
    if (!legs.length) return;
    setLoading("generate");
    setGeneratedCode(null);
    try {
      const res = await fetch("/api/codes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legs, exportSportyBet: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not generate code");
        return;
      }
      setGeneratedCode(data.code);
      if (data.sportyBet?.code) {
        toast.success(`SportyBet: ${data.sportyBet.code}`);
      } else {
        toast.success(`Code: ${data.code}`);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading("");
    }
  }

  async function handleLoad() {
    if (!loadCode.trim()) return;
    setLoading("load");
    try {
      const res = await fetch("/api/codes/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: loadCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid code");
        return;
      }
      loadLegs(data.legs);
      setLoadCode("");
      toast.success("Code loaded");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading("");
    }
  }

  return (
    <>
      <button
        type="button"
        className="sheet-backdrop"
        aria-label="Close slip"
        onClick={() => setOpen(false)}
      />
      <div className="sheet-panel max-w-lg mx-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <div>
            <p className="font-bold">Betslip</p>
            <p className="text-[10px] text-muted">
              {legs.length}/{MAX_SLIP_LEGS} selections
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="p-2">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {legs.length === 0 && (
            <p className="text-sm text-muted text-center py-8">
              Tap odds on any match to add selections.
            </p>
          )}
          {legs.map((leg) => (
            <div
              key={slipLegKey(leg)}
              className="flex gap-2 items-start border border-surface-border rounded-lg p-2.5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">
                  {leg.homeTeam} vs {leg.awayTeam}
                </p>
                <p className="text-[10px] text-accent-green font-semibold">
                  {leg.outcomeLabel} @ {leg.odds.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeLeg(slipLegKey(leg))}
                className="p-1 text-muted hover:text-ink"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <div className="border border-surface-border rounded-lg p-3 space-y-2">
            <p className="text-xs font-bold text-ink/70">Load booking code</p>
            <div className="flex gap-2">
              <input
                value={loadCode}
                onChange={(e) => setLoadCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-sm uppercase"
              />
              <button
                type="button"
                onClick={handleLoad}
                disabled={loading === "load"}
                className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-sm font-bold"
              >
                {loading === "load" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
              </button>
            </div>
          </div>

          {generatedCode && (
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-3 text-center">
              <p className="text-[10px] text-accent-green font-bold uppercase">
                Your booking code
              </p>
              <p className="text-2xl font-black tracking-widest mt-1">{generatedCode}</p>
              <button
                type="button"
                className="mt-2 text-xs flex items-center gap-1 mx-auto text-accent-green"
                onClick={() => {
                  void navigator.clipboard.writeText(generatedCode);
                  toast.success("Copied");
                }}
              >
                <Copy size={12} /> Copy
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-surface-border space-y-3 pb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] text-muted">Stake (NGN)</label>
              <input
                type="number"
                min={1}
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full mt-1 bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-sm font-bold"
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted">Total odds</p>
              <p className="text-lg font-black text-accent-green">
                {totalOdds.toFixed(2)}
              </p>
              <p className="text-[10px] text-muted">
                Win {formatNaira(Math.round(potential))}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl bg-surface-raised text-muted font-bold text-sm"
            title="Phase 2"
          >
            Place Bet — coming in Phase 2
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!legs.length || loading === "generate"}
            className="w-full py-3 rounded-xl bg-accent-green text-[#0A1433] font-bold text-sm flex items-center justify-center gap-2"
          >
            {loading === "generate" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            Generate Code
          </button>
          {legs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clear();
                setGeneratedCode(null);
              }}
              className="w-full text-xs text-muted py-1"
            >
              Clear slip
            </button>
          )}
        </div>
      </div>
    </>
  );
}
