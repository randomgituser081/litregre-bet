"use client";

import { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

type Props = {
  id: string;
  label: string;
  icon: LucideIcon;
  type?: "text" | "tel" | "password";
  inputMode?: "numeric" | "text" | "tel";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  autoComplete?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
};

export function AuthField({
  id,
  label,
  icon: Icon,
  type = "text",
  inputMode,
  placeholder,
  value,
  onChange,
  maxLength,
  autoComplete,
  hint,
  error,
  optional,
}: Props) {
  const [show, setShow] = useState(false);
  const isPin = type === "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
        {label}
        {optional && (
          <span className="font-medium text-muted normal-case">(optional)</span>
        )}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          <Icon size={18} strokeWidth={2.2} />
        </span>
        <input
          id={id}
          type={isPin && show ? "text" : type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={clsx(
            "auth-input w-full rounded-xl pl-11 pr-11 py-3.5 text-[15px] font-semibold text-ink",
            "placeholder:font-medium placeholder:text-muted/50",
            error && "border-accent-red/60 ring-1 ring-accent-red/30"
          )}
        />
        {isPin && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink"
            aria-label={show ? "Hide PIN" : "Show PIN"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="text-[11px] font-semibold text-accent-red">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
