"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogProps = {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
  className?: string;
};

export function Dialog({
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  title,
}: DialogProps) {
  if (!open) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <section
          aria-modal="true"
          className={cn(
            "flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl",
            className,
          )}
          role="dialog"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
              {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
            </div>
            <Button aria-label="닫기" onClick={() => onOpenChange(false)} size="icon" variant="ghost">
              <X size={16} />
            </Button>
          </div>
          <div className="min-h-0 overflow-y-auto p-5">{children}</div>
          {footer ? <div className="shrink-0 border-t border-slate-100 p-5">{footer}</div> : null}
        </section>
      </div>
    </div>,
    document.body,
  );
}
