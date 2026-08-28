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
    <div className="auth-page min-h-screen w-full flex flex-col px-4 py-5 sm:py-8">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink transition-colors mb-5 w-fit"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="auth-card flex-1 rounded-[1.25rem] overflow-hidden">
          <div className="auth-card__head px-6 pt-6 pb-5 text-center">
            <div className="flex justify-center mb-3">
              <BrandLogo href={null} size="md" product="bet" inverted />
            </div>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-accent-green/15 border border-accent-green/35 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-accent-green">
                {badge}
              </span>
            )}
          </div>

          <div className="px-6 pb-6 sm:px-7 sm:pb-7">
            <div className="mb-5">
              <h1 className="text-[21px] font-black text-ink tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-[13px] text-muted mt-1.5 leading-relaxed">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 pt-5 border-t border-surface-border text-center text-[13px] text-muted">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
