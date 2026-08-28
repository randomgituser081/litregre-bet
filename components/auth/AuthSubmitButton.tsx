"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function AuthSubmitButton({
  children,
  loading,
  disabled,
  className,
}: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={clsx(
        "w-full py-3.5 rounded-xl font-black text-[15px]",
        "bg-accent-green text-[#0A1433]",
        "shadow-[0_8px_24px_rgba(34,211,102,0.35)]",
        "hover:bg-accent-lime active:scale-[0.99] transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        className
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          Please wait…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
