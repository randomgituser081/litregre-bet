"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Ticket } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function OpenBetsPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"open" | "history">("open");
  const [code, setCode] = useState("");

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d.user))
      .catch(() => setLoggedIn(false));
  }, []);

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

        {loggedIn && (
          <div className="card-surface rounded-2xl p-8 text-center space-y-3">
            <Ticket size={28} className="mx-auto text-accent-green" />
            <p className="text-sm text-muted">
              No {tab === "open" ? "open" : "settled"} bets yet. Build a slip from
              any match and place when betting goes live.
            </p>
            <Link
              href="/?tab=today"
              className="inline-flex h-10 items-center rounded-full bg-accent-green text-[#0A1433] px-5 text-[13px] font-bold"
            >
              Browse today’s picks
            </Link>
          </div>
        )}

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
              onClick={() => {
                if (!code.trim()) {
                  toast.error("Enter a code first");
                  return;
                }
                toast.success(`Code ${code.trim()} loaded (demo)`);
              }}
              className="h-11 px-4 rounded-xl bg-accent-green text-[#0A1433] font-bold text-sm shrink-0"
            >
              Load
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setCode("DEMO01");
              toast.success("DEMO01 ready — 3 folds @ 4.52");
            }}
            className="text-[12px] font-bold text-accent-green"
          >
            Try sample code DEMO01 →
          </button>
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
