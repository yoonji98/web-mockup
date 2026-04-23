"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Plus, Sparkles } from "lucide-react";

import { elementLabels } from "@/data/element-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ElementNodeType } from "@/types/elements";
import type { BlockType } from "@/types/page";

type SmartInsertTarget =
  | { kind: "container"; containerId: string }
  | { index: number; kind: "section" }
  | { index?: number; kind: "page" };

type SmartInsertMenuProps = {
  className?: string;
  compact?: boolean;
  target: SmartInsertTarget;
};

const sectionOptions: Array<{ label: string; type: BlockType }> = [
  { label: "Hero Section", type: "hero" },
  { label: "Text + Image Section", type: "columnsSection" },
  { label: "Feature Cards", type: "features" },
  { label: "Pricing", type: "pricing" },
  { label: "FAQ", type: "faq" },
  { label: "Contact", type: "contact" },
  { label: "Blank Section", type: "containerSection" },
];

const elementOptions: ElementNodeType[] = [
  "heading",
  "text",
  "button",
  "image",
  "card",
  "form",
  "divider",
  "spacer",
];

export function SmartInsertMenu({ className, compact = false, target }: SmartInsertMenuProps) {
  const addElementToContainer = useEditorStore((state) => state.addElementToContainer);
  const createContainerSectionWithElement = useEditorStore(
    (state) => state.createContainerSectionWithElement,
  );
  const findContainerLocation = useEditorStore((state) => state.findContainerLocation);
  const insertBlockAt = useEditorStore((state) => state.insertBlockAt);
  const page = useEditorStore((state) => state.page);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 1800);
  }

  function sectionIndex() {
    if (target.kind === "section" || target.kind === "page") {
      return target.index;
    }

    const location = findContainerLocation(target.containerId);
    const blockIndex = location?.type === "container"
      ? page.blocks.findIndex((block) => block.id === location.sectionId)
      : -1;

    return blockIndex >= 0 ? blockIndex + 1 : undefined;
  }

  function addSection(type: BlockType) {
    insertBlockAt(type, sectionIndex());
    setOpen(false);
    showMessage("섹션을 추가했습니다.");
  }

  function addElement(type: ElementNodeType) {
    if (target.kind === "container") {
      addElementToContainer(target.containerId, type);
    } else {
      createContainerSectionWithElement(type, target.index);
    }

    setOpen(false);
    showMessage(`${elementLabels[type]} 요소를 추가했습니다.`);
  }

  return (
    <div className={cn("relative inline-block", className)} ref={rootRef}>
      <button
        className={
          compact
            ? "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
        }
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Plus size={compact ? 15 : 14} />
        {compact ? null : "Insert"}
      </button>
      {open ? (
        <div className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-64 -translate-x-1/2 rounded-md border border-slate-200 bg-white p-2 text-left shadow-xl">
          <MenuGroup title="자주 쓰는 항목">
            <MenuItem onSelect={() => addElement("heading")}>Heading</MenuItem>
            <MenuItem onSelect={() => addElement("text")}>Text</MenuItem>
            <MenuItem onSelect={() => addElement("button")}>Button</MenuItem>
          </MenuGroup>
          <MenuGroup title="Section">
            {sectionOptions.map((option) => (
              <MenuItem key={option.label} onSelect={() => addSection(option.type)}>
                {option.label}
              </MenuItem>
            ))}
          </MenuGroup>
          <MenuGroup title="Element">
            {elementOptions.map((type) => (
              <MenuItem key={type} onSelect={() => addElement(type)}>
                {elementLabels[type]}
              </MenuItem>
            ))}
          </MenuGroup>
          <MenuGroup title="AI">
            <MenuItem onSelect={() => showMessage("AI 추천 섹션은 다음 단계에서 연결됩니다.")}>
              <Sparkles size={13} />
              AI 추천 섹션 추가
            </MenuItem>
          </MenuGroup>
        </div>
      ) : null}
      {message ? (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {message}
        </div>
      ) : null}
    </div>
  );
}

function MenuGroup({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="py-1">
      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>
      <div className="grid gap-0.5">{children}</div>
    </div>
  );
}

function MenuItem({ children, onSelect }: { children: ReactNode; onSelect: () => void }) {
  return (
    <button
      className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
      onClick={onSelect}
      type="button"
    >
      {children}
    </button>
  );
}
