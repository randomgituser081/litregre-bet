"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      toast.success("Welcome back");
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-black mb-1">Log in</h1>
      <p className="text-sm text-muted mb-8">Phone + PIN</p>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="tel"
          placeholder="08012345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-3"
          required
        />
        <input
          type="password"
          inputMode="numeric"
          placeholder="PIN"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-accent-green text-[#0A1433] rounded-xl font-bold"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm text-muted mt-6">
        New here?{" "}
        <Link href="/register" className="text-accent-green font-semibold">
          Join now
        </Link>
      </p>
    </div>
  );
}
