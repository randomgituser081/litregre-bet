"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }
      toast.success("Account created");
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-black mb-1">Join LitreGre Bet</h1>
      <p className="text-sm text-white/45 mb-8">Create your account</p>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-3"
        />
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
          placeholder="Choose PIN (4–6 digits)"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-accent-green text-black rounded-xl font-bold"
        >
          {loading ? "..." : "Register"}
        </button>
      </form>
      <p className="text-center text-sm text-white/45 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-green font-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
}
