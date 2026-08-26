"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OpenBetsPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"open" | "history">("open");

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d.user))
      .catch(() => setLoggedIn(false));
  }, []);

  return (
    <div className="px-3 py-4 pb-24">
      <div className="flex border-b border-surface-border mb-4">
        {(["open", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-bold capitalize ${
              tab === t
                ? "text-white border-b-2 border-accent-green"
                : "text-white/40"
            }`}
          >
            {t === "open" ? "Open Bets" : "Bet History"}
          </button>
        ))}
      </div>

      {loggedIn === false && (
        <div className="text-center py-12 space-y-4">
          <p className="text-sm text-white/50">
            Please log in to see your open bets and bet history.
          </p>
          <Link
            href="/login"
            className="inline-block border border-accent-green text-accent-green px-8 py-2.5 rounded-lg font-bold text-sm"
          >
            Login
          </Link>
        </div>
      )}

      {loggedIn && (
        <div className="space-y-4">
          <p className="text-sm text-white/40 text-center py-8">
            No {tab === "open" ? "open" : "settled"} bets yet. Place a bet in
            Phase 2.
          </p>
          <section>
            <h2 className="text-sm font-bold mb-2">Recommended Football Codes</h2>
            <div className="card-surface p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-mono font-bold text-accent-green">DEMO01</span>
                <span className="text-white/50">3 folds · @ 4.52</span>
              </div>
              <p className="text-[10px] text-white/40">
                Sample code — generate your own from the betslip.
              </p>
              <button
                type="button"
                className="w-full py-2.5 bg-accent-green text-black rounded-lg font-bold text-sm"
                onClick={() => {
                  /* open slip via store */
                }}
              >
                Add to Betslip
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
