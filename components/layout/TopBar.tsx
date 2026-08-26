"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/utils";

type Me = { phone: string; name: string; balance: number } | null;

export function TopBar() {
  const [me, setMe] = useState<Me>(null);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setMe({ ...d.user, balance: d.balance ?? 0 });
      })
      .catch(() => undefined);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-accent-brand px-3 py-2.5 flex items-center gap-2 shadow-lg">
      <Link href="/" className="font-black text-lg tracking-tight text-white shrink-0">
        LitreGre<span className="text-accent-green">Bet</span>
      </Link>
      <button
        type="button"
        className="ml-auto p-2 rounded-full hover:bg-white/10"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
      {me ? (
        <Link
          href="/me"
          className="text-xs font-bold bg-black/25 rounded-full px-3 py-1.5 whitespace-nowrap"
        >
          {formatNaira(Math.round(me.balance * 100))}
        </Link>
      ) : (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Link
            href="/register"
            className="bg-accent-green text-black px-3 py-1.5 rounded-full"
          >
            Join
          </Link>
          <Link href="/login" className="px-2 py-1.5 text-white/90">
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
