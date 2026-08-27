import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  backHref,
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-3 sm:px-5 pt-4 pb-3 flex items-start gap-3">
      {backHref && (
        <Link
          href={backHref}
          className="mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 card-surface"
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-[1.35rem] sm:text-2xl font-black text-ink tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-muted font-medium">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
