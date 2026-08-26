"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Wallet, Headphones, LogOut } from "lucide-react";
import { formatNaira, formatPhoneDisplay } from "@/lib/utils";

type WalletData = {
  total_balance: number;
  playing_balance: number;
  winning_balance: number;
  bonus_balance: number;
};

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ phone: string; name: string } | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);

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
      <div className="px-3 py-8 text-center space-y-4 pb-24">
        <p className="text-white/50 text-sm">Login to view your account</p>
        <Link href="/login" className="btn inline-block bg-accent-green text-black px-8 py-2.5 rounded-xl font-bold">
          Login
        </Link>
      </div>
    );
  }

  const totalKobo = Math.round((wallet?.total_balance ?? 0) * 100);

  return (
    <div className="px-3 py-4 space-y-4 pb-24">
      <div className="card-surface p-4">
        <p className="text-sm font-bold">{user.name}</p>
        <p className="text-xs text-white/45">{formatPhoneDisplay(user.phone)}</p>
        <p className="text-[10px] text-white/40 mt-3">Total Balance</p>
        <p className="text-2xl font-black">{formatNaira(totalKobo)}</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => toast("Deposits — Phase 2")}
            className="py-3 rounded-xl bg-accent-green text-black font-bold text-sm flex items-center justify-center gap-1"
          >
            <Wallet size={16} /> Deposit
          </button>
          <button
            type="button"
            onClick={() => toast("Withdrawals — Phase 2")}
            className="py-3 rounded-xl border border-accent-green text-accent-green font-bold text-sm"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 card-surface divide-x divide-surface-border text-center py-4">
        <div>
          <p className="text-[10px] text-white/40">Sports Bets</p>
          <p className="text-xs font-bold mt-1">0</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40">Transactions</p>
          <p className="text-xs font-bold mt-1">0</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40">Bonus</p>
          <p className="text-xs font-bold mt-1">
            {formatNaira(Math.round((wallet?.bonus_balance ?? 0) * 100))}
          </p>
        </div>
      </div>

      <Link
        href="/open-bets"
        className="card-surface flex items-center justify-between p-4 text-sm font-semibold"
      >
        Open Bets & History
      </Link>

      <button
        type="button"
        className="card-surface flex items-center gap-3 p-4 w-full text-left text-sm"
        onClick={() => toast("Support — Phase 2")}
      >
        <Headphones size={18} className="text-accent-green" />
        Customer Service · 24/7
      </button>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 text-sm text-white/50 mx-auto py-4"
      >
        <LogOut size={16} /> Log out
      </button>

      <p className="text-[10px] text-center text-white/30 pb-4">
        18+ · Play responsibly · Phase 1 demo wallet
      </p>
    </div>
  );
}
