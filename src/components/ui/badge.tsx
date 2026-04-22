import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "blue" | "green" | "slate" | "red";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClassName: Record<BadgeVariant, string> = {
  default: "border-slate-200 bg-slate-50 text-slate-600",
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  green: "border-green-100 bg-green-50 text-green-700",
  slate: "border-slate-200 bg-white text-slate-700",
  red: "border-red-100 bg-red-50 text-red-700",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold",
        variantClassName[variant],
        className,
      )}
      {...props}
    />
  );
}
