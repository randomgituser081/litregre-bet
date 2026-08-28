"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Phone } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { digitsOnly, validatePhone, validatePin } from "@/lib/auth/validate";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; pin?: string }>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    const pinErr = validatePin(pin);
    setErrors({ phone: phoneErr || undefined, pin: pinErr || undefined });
    if (phoneErr || pinErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: digitsOnly(phone),
          pin: digitsOnly(pin, 6),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      toast.success(`Welcome back${data.user?.name ? `, ${data.user.name}` : ""}!`);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in with your phone number and PIN — no SMS code needed."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="text-accent-green font-bold hover:underline">
            Create free account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <AuthField
          id="phone"
          label="Phone number"
          icon={Phone}
          type="tel"
          inputMode="tel"
          placeholder="0801 234 5678"
          value={phone}
          onChange={(v) => setPhone(digitsOnly(v, 13))}
          autoComplete="tel"
          hint="Nigerian number — 080… or 234…"
          error={errors.phone}
        />
        <AuthField
          id="pin"
          label="PIN"
          icon={Lock}
          type="password"
          inputMode="numeric"
          placeholder="••••"
          value={pin}
          onChange={(v) => setPin(digitsOnly(v, 6))}
          maxLength={6}
          autoComplete="current-password"
          hint="Your 4–6 digit PIN"
          error={errors.pin}
        />
        <AuthSubmitButton loading={loading}>Log in</AuthSubmitButton>
      </form>
    </AuthShell>
  );
}
