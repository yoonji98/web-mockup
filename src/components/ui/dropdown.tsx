"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DropdownProps = {
  children: ReactNode;
  label: ReactNode;
  align?: "left" | "right";
  buttonVariant?: ButtonProps["variant"];
  className?: string;
};

export function Dropdown({
  align = "left",
  buttonVariant = "secondary",
  children,
  className,
  label,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <Button onClick={() => setOpen((value) => !value)} variant={buttonVariant}>
        {label}
        <ChevronDown size={15} />
      </Button>
      {open ? (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] z-50 min-w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl",
            align === "right" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

type DropdownItemProps = {
  children: ReactNode;
  onSelect?: () => void;
  tone?: "default" | "danger";
};

export function DropdownItem({ children, onSelect, tone = "default" }: DropdownItemProps) {
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center rounded-xl px-3 text-left text-sm font-medium transition",
        tone === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
      )}
      onClick={onSelect}
      type="button"
    >
      {children}
    </button>
  );
}
