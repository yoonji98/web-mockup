"use client";

import Link from "next/link";
import { CheckCircle2, Monitor, Save, Smartphone, Tablet, WandSparkles } from "lucide-react";

import { ExportReactProjectButton } from "@/components/editor/ExportReactProjectButton";
import { PublishProjectButton } from "@/components/editor/PublishProjectButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { previewModes, useEditorStore, type PreviewMode } from "@/store/editor-store";

const previewModeConfig: Record<PreviewMode, { label: string; icon: typeof Monitor }> = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
  },
  tablet: {
    label: "Tablet",
    icon: Tablet,
  },
  mobile: {
    label: "Mobile",
    icon: Smartphone,
  },
};

export function TopBar() {
  const { currentPageId, isDirty, previewMode, saveToLocalStorage, setPreviewMode, site } =
    useEditorStore();
  const currentPage = site.pages.find((page) => page.id === currentPageId) ?? site.pages[0];

  return (
    <header className="border-b border-slate-200/80 bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm"
            href="/"
          >
            <WandSparkles size={19} />
          </Link>
          <div>
            <Link className="text-base font-semibold tracking-tight text-slate-950" href="/">
              Landing Studio
            </Link>
            <p className="text-xs font-medium text-slate-500">
              {site.name} / {currentPage?.title ?? "Page"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            {previewModes.map((mode) => {
              const Icon = previewModeConfig[mode].icon;

              return (
                <Tooltip content={previewModeConfig[mode].label} key={mode}>
                  <button
                    className={`inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition ${
                      previewMode === mode
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:text-slate-950"
                    }`}
                    onClick={() => setPreviewMode(mode)}
                    type="button"
                  >
                    <Icon size={15} />
                    <span className="hidden xl:inline">{previewModeConfig[mode].label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
          <Badge className="gap-1.5" variant={isDirty ? "default" : "green"}>
            {isDirty ? null : <CheckCircle2 size={13} />}
            {isDirty ? "Unsaved" : "Saved"}
          </Badge>
          <Separator className="mx-1 hidden h-8 sm:block" orientation="vertical" />
          <Button onClick={saveToLocalStorage} variant="secondary">
            <Save size={15} />
            저장
          </Button>
          <ExportReactProjectButton />
          <PublishProjectButton />
        </div>
      </div>
    </header>
  );
}
