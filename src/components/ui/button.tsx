import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "border border-slate-950 bg-slate-950 text-white shadow-sm hover:bg-slate-800",
  secondary:
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50",
  ghost: "border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  outline:
    "border border-slate-200 bg-transparent text-slate-800 hover:border-slate-300 hover:bg-white",
  danger: "border border-red-200 bg-white text-red-600 shadow-sm hover:bg-red-50",
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "h-8 rounded-xl px-3 text-xs",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-11 rounded-2xl px-5 text-sm",
  icon: "h-9 w-9 rounded-xl p-0",
};

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
