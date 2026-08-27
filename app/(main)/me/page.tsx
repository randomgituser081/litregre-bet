"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Wallet,
  Headphones,
  LogOut,
  Crown,
  Gift,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { formatNaira, formatPhoneDisplay } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";

type WalletData = {
  total_balance: number;
  playing_balance: number;
  winning_balance: number;
  bonus_balance: number;
};

function MeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showDeposit = searchParams.get("tab") === "deposit";
  const [user, setUser] = useState<{ phone: string; name: string } | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [amount, setAmount] = useState("5000");

  useEffect(() => {
    void Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/wallet")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([me, w]) => {
      if (me.user) {
        setUser(me.user);
        setWallet(w);
      }
    });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!user) {
    return (
      <div className="px-3 sm:px-5 py-10 text-center space-y-4 pb-24">
        <PageHeader title="Account" subtitle="Login to manage your wallet" />
        <Link
          href="/login"
          className="inline-flex h-11 items-center rounded-full bg-accent-green text-[#0A1433] px-8 font-bold text-sm"
        >
          Login
        </Link>
        <p className="text-[12px] text-muted">
          New here?{" "}
          <Link href="/register" className="text-accent-green font-bold">
            Join LitreGre
          </Link>
        </p>
      </div>
    );
  }

  const totalKobo = Math.round((wallet?.total_balance ?? 0) * 100);

  return (
    <div className="pb-24">
      <PageHeader title="Account" subtitle={formatPhoneDisplay(user.phone)} />

      <div className="px-3 sm:px-5 space-y-4">
        <div className="card-surface rounded-2xl p-5">
          <p className="text-[13px] font-bold text-ink">{user.name}</p>
          <p className="text-[11px] text-muted mt-0.5">Total balance</p>
          <p className="text-3xl font-black text-ink mt-1 tabular-nums">
            {formatNaira(totalKobo)}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link
              href="/me?tab=deposit"
              className="py-3 rounded-xl bg-accent-green text-[#0A1433] font-bold text-sm flex items-center justify-center gap-1.5"
            >
              <Wallet size={16} /> Deposit
            </Link>
            <button
              type="button"
              onClick={() =>
                toast("Withdrawals unlock with live banking — Phase 2")
              }
              className="py-3 rounded-xl border border-accent-green text-accent-green font-bold text-sm"
            >
              Withdraw
            </button>
          </div>
        </div>

        {showDeposit && (
          <div className="card-surface rounded-2xl p-5 space-y-3 ring-2 ring-accent-green/40">
            <h2 className="text-[15px] font-black text-ink">Deposit</h2>
            <p className="text-[12px] text-muted">
              Demo wallet — banking rails land in Phase 2. For now you can
              preview the flow.
            </p>
            <label className="block">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wide">
                Amount (₦)
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                className="mt-1 w-full h-11 rounded-xl px-3 bg-[var(--surface-raised)] text-ink font-bold outline-none border border-surface-border focus:border-accent-green"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {["2000", "5000", "10000", "20000"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className="h-9 px-3 rounded-full text-[12px] font-bold card-surface hover:border-accent-green/50"
                >
                  ₦{Number(v).toLocaleString()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                toast.success(
                  `Deposit of ₦${Number(amount || 0).toLocaleString()} queued (demo)`
                )
              }
              className="w-full h-11 rounded-xl bg-accent-green text-[#0A1433] font-bold text-sm"
            >
              Continue
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 card-surface rounded-2xl divide-x divide-surface-border text-center py-4">
          <div>
            <p className="text-[10px] text-muted">Sports</p>
            <p className="text-xs font-bold mt-1">0</p>
          </div>
          <div>
            <p className="text-[10px] text-muted">Txns</p>
            <p className="text-xs font-bold mt-1">0</p>
          </div>
          <div>
            <p className="text-[10px] text-muted">Bonus</p>
            <p className="text-xs font-bold mt-1">
              {formatNaira(Math.round((wallet?.bonus_balance ?? 0) * 100))}
            </p>
          </div>
        </div>

        <div className="card-surface rounded-2xl overflow-hidden divide-y divide-surface-border">
          {[
            { href: "/open-bets", label: "Open bets & history", icon: Ticket },
            { href: "/promotions", label: "Promotions & bonuses", icon: Gift },
            { href: "/vip", label: "VIP Club", icon: Crown },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-raised)]"
            >
              <Icon size={18} className="text-accent-green" />
              <span className="flex-1 text-[14px] font-semibold text-ink">
                {label}
              </span>
              <ChevronRight size={16} className="text-muted" />
            </Link>
          ))}
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-[var(--surface-raised)]"
            onClick={() => toast("Support chat — Phase 2. Email hello@litregre.com")}
          >
            <Headphones size={18} className="text-accent-green" />
            <span className="flex-1 text-[14px] font-semibold text-ink">
              Customer service · 24/7
            </span>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-2 text-sm text-muted w-full py-3"
        >
          <LogOut size={16} /> Log out
        </button>

        <p className="text-[10px] text-center text-muted pb-2">
          18+ · Play responsibly · Phase 1 demo wallet
        </p>
      </div>
    </div>
  );
}

export default function MePage() {
  return (
    <Suspense
      fallback={
        <div className="p-5">
          <div className="skeleton h-10 w-40 rounded-xl mb-4" />
          <div className="skeleton h-40 w-full rounded-2xl" />
        </div>
      }
    >
      <MeInner />
    </Suspense>
  );
}
