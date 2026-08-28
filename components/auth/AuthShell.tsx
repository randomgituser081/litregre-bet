"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  badge?: string;
};

export function AuthShell({ title, subtitle, children, footer, badge }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="auth-hero relative px-5 pt-6 pb-16 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="flex flex-col items-center text-center gap-3">
          <BrandLogo href={null} size="md" product="bet" inverted showWordmark />
          {badge && (
            <span className="inline-flex items-center rounded-full bg-accent-green/20 border border-accent-green/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-accent-green">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 -mt-10 px-4 pb-10">
        <div className="auth-card max-w-md mx-auto rounded-[1.35rem] p-6 sm:p-7 shadow-xl">
          <div className="mb-6">
            <h1 className="text-[22px] font-black text-ink tracking-tight">{title}</h1>
            <p className="text-[13px] text-muted mt-1">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 pt-5 border-t border-surface-border text-center text-[13px] text-muted">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
