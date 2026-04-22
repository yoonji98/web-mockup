"use client";

import { useEffect } from "react";

import { CanvasArea } from "@/components/editor/CanvasArea";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { RightPanel } from "@/components/editor/RightPanel";
import { TopBar } from "@/components/editor/TopBar";
import { useEditorStore } from "@/store/editor-store";

export function EditorLayout() {
  const loadFromLocalStorage = useEditorStore((state) => state.loadFromLocalStorage);
  const loadCustomPalettes = useEditorStore((state) => state.loadCustomPalettes);

  useEffect(() => {
    loadFromLocalStorage();
    loadCustomPalettes();
  }, [loadCustomPalettes, loadFromLocalStorage]);

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-950">
      <TopBar />
      <div className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_380px]">
        <LeftSidebar />
        <CanvasArea />
        <RightPanel />
      </div>
    </div>
  );
}
