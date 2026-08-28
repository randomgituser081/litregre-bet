"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Ticket } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatNaira } from "@/lib/utils";

type BetItem = {
  id: string;
  stake: number;
  totalOdds: number;
  potential: number;
  status: string;
  createdAt: string;
  selections: {
    homeTeam: string;
    awayTeam: string;
    outcomeLabel: string;
    odds: number;
    leagueName: string;
  }[];
};

export default function OpenBetsPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"open" | "history">("open");
  const [bets, setBets] = useState<BetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const loadBets = useCallback(async (t: "open" | "history", authed: boolean) => {
    if (!authed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bets?tab=${t}`);
      const data = await res.json();
      setBets(data.items || []);
    } catch {
      setBets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const ok = !!d.user;
        setLoggedIn(ok);
        if (ok) void loadBets(tab, true);
      })
      .catch(() => setLoggedIn(false));
  }, [tab, loadBets]);

  return (
    <div className="pb-24">
      <PageHeader
        title="My bets"
        subtitle="Open slips, history & booking codes"
        backHref="/"
      />

      <div className="px-3 sm:px-5 mb-4">
        <div
          className="grid grid-cols-2 gap-1 p-1 rounded-[1.15rem]"
          style={{ background: "var(--surface-raised)" }}
        >
          {(
            [
              { id: "open" as const, label: "Open bets" },
              { id: "history" as const, label: "History" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`h-11 rounded-[0.95rem] text-[13px] font-bold transition ${
                tab === id
                  ? "bg-accent-green text-[#0A1433]"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 sm:px-5 space-y-4">
        {loggedIn === false && (
          <div className="card-surface rounded-2xl p-8 text-center space-y-4">
            <p className="text-sm text-muted">
              Log in to see open bets and bet history.
            </p>
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-full border border-accent-green text-accent-green px-8 font-bold text-sm"
            >
              Login
            </Link>
          </div>
        )}

        {loggedIn && loading && (
          <div className="space-y-2">
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-24 w-full rounded-xl" />
          </div>
        )}

        {loggedIn && !loading && bets.length === 0 && (
          <div className="card-surface rounded-2xl p-8 text-center space-y-3">
            <Ticket size={28} className="mx-auto text-accent-green" />
            <p className="text-sm text-muted">
              No {tab === "open" ? "open" : "settled"} bets yet. Pick odds on any
              match and hit Place Bet.
            </p>
            <Link
              href="/?tab=today"
              className="inline-flex h-10 items-center rounded-full bg-accent-green text-[#0A1433] px-5 text-[13px] font-bold"
            >
              Browse today’s picks
            </Link>
          </div>
        )}

        {loggedIn &&
          !loading &&
          bets.map((bet) => (
            <article
              key={bet.id}
              className="card-surface rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] text-muted">
                    {dayjs(bet.createdAt).format("DD MMM YYYY · HH:mm")}
                  </p>
                  <p className="text-sm font-black text-ink mt-0.5">
                    {bet.selections.length}-fold @ {bet.totalOdds.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                    bet.status === "pending"
                      ? "bg-accent-green/15 text-accent-green"
                      : bet.status === "won"
                        ? "bg-accent-green/20 text-accent-green"
                        : "bg-surface-raised text-muted"
                  }`}
                >
                  {bet.status}
                </span>
              </div>

              <ul className="space-y-2 border-t border-surface-border pt-2">
                {bet.selections.map((s, i) => (
                  <li key={i} className="text-[12px]">
                    <p className="font-semibold text-ink truncate">
                      {s.homeTeam} vs {s.awayTeam}
                    </p>
                    <p className="text-[10px] text-muted truncate">
                      {s.leagueName} · {s.outcomeLabel} @ {s.odds.toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-[12px] pt-1 border-t border-surface-border">
                <span className="text-muted">
                  Stake{" "}
                  <strong className="text-ink">
                    {formatNaira(bet.stake)}
                  </strong>
                </span>
                <span className="text-muted">
                  To win{" "}
                  <strong className="text-accent-green">
                    {formatNaira(bet.potential)}
                  </strong>
                </span>
              </div>
            </article>
          ))}

        <section className="card-surface rounded-2xl p-5 space-y-3">
          <h2 className="text-[15px] font-black text-ink">Load a booking code</h2>
          <p className="text-[12px] text-muted">
            Paste a shared code to preview selections in your slip.
          </p>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. DEMO01"
              className="flex-1 h-11 rounded-xl px-3 bg-[var(--surface-raised)] text-ink font-mono font-bold outline-none border border-surface-border focus:border-accent-green"
            />
            <button
              type="button"
              onClick={async () => {
                if (!code.trim()) {
                  toast.error("Enter a code first");
                  return;
                }
                try {
                  const res = await fetch("/api/codes/load", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: code.trim() }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    toast.error(data.error || "Invalid code");
                    return;
                  }
                  toast.success("Code loaded — open your betslip");
                } catch {
                  toast.error("Network error");
                }
              }}
              className="h-11 px-4 rounded-xl bg-accent-green text-[#0A1433] font-bold text-sm shrink-0"
            >
              Load
            </button>
          </div>
        </section>

        <Link
          href="/promotions"
          className="block text-center text-[13px] font-bold text-accent-green py-2"
        >
          Claim gifts & promotions →
        </Link>
      </div>
    </div>
  );
}
