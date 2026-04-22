import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TooltipProps = {
  children: ReactNode;
  content: string;
  className?: string;
};

export function Tooltip({ children, className, content }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100",
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
