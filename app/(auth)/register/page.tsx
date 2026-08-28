"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Gift, Lock, Phone, User } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { digitsOnly, validatePhone, validatePin } from "@/lib/auth/validate";

const PERKS = [
  "No verification code — sign up in seconds",
  "₦5,000 demo bonus to start betting",
  "Phone + PIN only, that's it",
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: digitsOnly(phone),
          pin: digitsOnly(pin, 6),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          toast.error("This phone is already registered — try logging in");
        } else {
          toast.error(data.error || "Registration failed");
        }
        return;
      }
      toast.success("You're in! ₦5,000 demo bonus added.");
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
      title="Join LitreGre Bet"
      subtitle="Free account — no OTP, no email, no hassle."
      badge="Instant signup"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-accent-green font-bold hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <ul className="mb-5 space-y-2">
        {PERKS.map((text) => (
          <li
            key={text}
            className="flex items-start gap-2 text-[11px] text-muted font-medium"
          >
            <Gift size={14} className="shrink-0 text-accent-green mt-0.5" />
            {text}
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="space-y-4">
        <AuthField
          id="name"
          label="Display name"
          icon={User}
          type="text"
          placeholder="e.g. Tunde"
          value={name}
          onChange={setName}
          autoComplete="name"
          optional
        />
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
          hint="We'll never spam you — used only to log in"
          error={errors.phone}
        />
        <AuthField
          id="pin"
          label="Choose a PIN"
          icon={Lock}
          type="password"
          inputMode="numeric"
          placeholder="4–6 digits"
          value={pin}
          onChange={(v) => setPin(digitsOnly(v, 6))}
          maxLength={6}
          autoComplete="new-password"
          hint="Pick something you'll remember"
          error={errors.pin}
        />
        <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      </form>

      <p className="text-[10px] text-center text-muted mt-4 leading-relaxed">
        By joining you agree to play responsibly. Demo wallet only — no real
        deposits required yet.
      </p>
    </AuthShell>
  );
}
