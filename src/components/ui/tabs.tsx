"use client";

import { createContext, useContext, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

type TabsProps = {
  children: ReactNode;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

export function Tabs({ children, defaultValue, onValueChange, value }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue: (nextValue: string) => {
        setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
    }),
    [currentValue, onValueChange],
  );

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex rounded-2xl border border-slate-200 bg-slate-100 p-1", className)}
      {...props}
    />
  );
}

type TabsTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const context = useTabsContext();
  const isActive = context.value === value;

  return (
    <button
      className={cn(
        "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition",
        isActive ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-950",
        className,
      )}
      onClick={() => context.setValue(value)}
      type="button"
      {...props}
    />
  );
}

type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({ className, value, ...props }: TabsContentProps) {
  const context = useTabsContext();

  if (context.value !== value) {
    return null;
  }

  return <div className={cn("mt-4", className)} {...props} />;
}

function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be rendered inside <Tabs>.");
  }

  return context;
}
