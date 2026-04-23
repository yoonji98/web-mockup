"use client";

import type { CSSProperties, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS as DndCSS } from "@dnd-kit/utilities";
import { Grip, Move, Scan } from "lucide-react";

import type { EditorSectionDndContext } from "@/components/editor/dnd-data";
import { getFreeformCanvasDropId, getFreeformElementDragId } from "@/components/editor/dnd-data";
import { ElementRenderer } from "@/components/elements/ElementRenderer";
import { toCssStyle } from "@/components/elements/element-utils";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ElementNode, ElementStyle, FreeformElementLayout } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

const SNAP = 8;

type FreeformRendererProps = {
  colors: ThemeColors;
  editorDnd?: EditorSectionDndContext;
  elements?: ElementNode[];
  layouts?: FreeformElementLayout[];
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
  style?: ElementStyle;
};

export function FreeformRenderer(props: FreeformRendererProps) {
  if (props.editorDnd) {
    return <EditorFreeformRenderer {...props} editorDnd={props.editorDnd} />;
  }

  return <StaticFreeformRenderer {...props} />;
}

function StaticFreeformRenderer({
  colors,
  elements = [],
  layouts = [],
  onElementClick,
  radius,
  style,
}: FreeformRendererProps) {
  const baseStyle = toCssStyle(style);

  if (layouts.length === 0) {
    return (
      <div className="grid gap-4 md:relative md:min-h-96" style={baseStyle}>
        {elements.map((element) => (
          <ElementRenderer
            colors={colors}
            key={element.id}
            node={element}
            onElementClick={onElementClick}
            radius={radius}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={baseStyle}>
      <MobileFallback colors={colors} elements={elements} onElementClick={onElementClick} radius={radius} />
      <div className="hidden md:block">
        {elements.map((element) => {
          const layout = findLayout(layouts, element.id, "desktop");

          return (
            <div key={element.id} style={layout ? layoutStyle(layout) : undefined}>
              <ElementRenderer
                colors={colors}
                node={element}
                onElementClick={onElementClick}
                radius={radius}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditorFreeformRenderer({
  colors,
  editorDnd,
  elements = [],
  layouts = [],
  onElementClick,
  radius,
  style,
}: FreeformRendererProps & { editorDnd: EditorSectionDndContext }) {
  const baseStyle = toCssStyle(style);
  const { isOver, setNodeRef } = useDroppable({
    id: getFreeformCanvasDropId(editorDnd.sectionId),
    data: {
      blockId: editorDnd.sectionId,
      dropType: "freeformCanvas",
      pageId: editorDnd.pageId,
    },
  });

  return (
    <div className="relative overflow-hidden" style={baseStyle}>
      <MobileFallback colors={colors} elements={elements} onElementClick={onElementClick} radius={radius} />
      <div
        className={cn(
          "relative hidden min-h-96 overflow-hidden rounded-md border border-dashed md:block",
          isOver ? "border-blue-400 bg-blue-50/40" : "border-slate-200 bg-white/40",
        )}
        ref={setNodeRef}
        style={{
          ...baseStyle,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.18) 1px, transparent 1px)",
          backgroundSize: `${SNAP * 2}px ${SNAP * 2}px`,
        }}
      >
        <div className="pointer-events-none absolute left-3 top-3 z-30 flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm">
          <Scan size={13} />
          고급 · Snap {SNAP}px · Responsive 주의
        </div>
        {elements.length === 0 ? (
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-400">
            Elements를 여기에 드롭해 자유 배치하세요.
          </div>
        ) : null}
        {elements.map((element) => {
          const layout = findLayout(layouts, element.id, "desktop") ?? createFallbackLayout(element.id);

          return (
            <FreeformElementFrame
              blockId={editorDnd.sectionId}
              colors={colors}
              element={element}
              key={element.id}
              layout={layout}
              onElementClick={onElementClick}
              radius={radius}
            />
          );
        })}
      </div>
    </div>
  );
}

function FreeformElementFrame({
  blockId,
  colors,
  element,
  layout,
  onElementClick,
  radius,
}: {
  blockId: string;
  colors: ThemeColors;
  element: ElementNode;
  layout: FreeformElementLayout;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
}) {
  const updateFreeformElementLayout = useEditorStore((state) => state.updateFreeformElementLayout);
  const resizeStartRef = useRef<{ h: number; pointerX: number; pointerY: number; w: number } | null>(null);
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: getFreeformElementDragId(blockId, element.id),
    data: {
      blockId,
      dragType: "freeformElement",
      elementId: element.id,
      layout,
    },
  });
  const style: CSSProperties = {
    ...layoutStyle(layout),
    opacity: isDragging ? 0.55 : undefined,
    transform: DndCSS.Translate.toString(transform),
  };

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    resizeStartRef.current = {
      h: layout.h,
      pointerX: event.clientX,
      pointerY: event.clientY,
      w: layout.w,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const start = resizeStartRef.current;

      if (!start) {
        return;
      }

      updateFreeformElementLayout(blockId, element.id, {
        breakpoint: layout.breakpoint,
        h: Math.max(48, snap(start.h + moveEvent.clientY - start.pointerY)),
        w: Math.max(72, snap(start.w + moveEvent.clientX - start.pointerX)),
      });
    };

    const handlePointerUp = () => {
      resizeStartRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  return (
    <div className="group/freeform absolute" ref={setNodeRef} style={style}>
      <div className="absolute -left-2 -top-2 z-30 flex items-center gap-1 opacity-0 transition group-hover/freeform:opacity-100 group-focus-within/freeform:opacity-100">
        <button
          aria-label="Freeform 요소 이동"
          className="grid h-7 w-7 cursor-grab place-items-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm active:cursor-grabbing"
          onClick={(event) => event.stopPropagation()}
          type="button"
          {...attributes}
          {...listeners}
        >
          <Move size={14} />
        </button>
        <span className="rounded-md bg-slate-950 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
          x{layout.x} y{layout.y}
        </span>
      </div>
      <div className="h-full min-h-0 overflow-hidden rounded-md ring-1 ring-transparent transition group-hover/freeform:ring-blue-300">
        <ElementRenderer colors={colors} node={element} onElementClick={onElementClick} radius={radius} />
      </div>
      <button
        aria-label="Freeform 요소 크기 조절"
        className="absolute -bottom-2 -right-2 z-30 grid h-7 w-7 cursor-nwse-resize place-items-center rounded-md border border-slate-200 bg-white text-slate-500 opacity-0 shadow-sm transition group-hover/freeform:opacity-100 group-focus-within/freeform:opacity-100"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={startResize}
        type="button"
      >
        <Grip size={14} />
      </button>
    </div>
  );
}

function MobileFallback({
  colors,
  elements,
  onElementClick,
  radius,
}: {
  colors: ThemeColors;
  elements: ElementNode[];
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
}) {
  return (
    <div className="grid gap-4 md:hidden">
      {elements.map((element) => (
        <ElementRenderer
          colors={colors}
          key={element.id}
          node={element}
          onElementClick={onElementClick}
          radius={radius}
        />
      ))}
    </div>
  );
}

function findLayout(
  layouts: FreeformElementLayout[],
  elementId: string,
  breakpoint: FreeformElementLayout["breakpoint"],
) {
  return layouts.find((item) => item.elementId === elementId && item.breakpoint === breakpoint);
}

function createFallbackLayout(elementId: string): FreeformElementLayout {
  return {
    breakpoint: "desktop",
    elementId,
    h: 120,
    w: 280,
    x: 80,
    y: 80,
    zIndex: 1,
  };
}

function layoutStyle(layout: FreeformElementLayout): CSSProperties {
  return {
    height: `${layout.h}px`,
    left: `${layout.x}px`,
    position: "absolute",
    top: `${layout.y}px`,
    width: `${layout.w}px`,
    zIndex: layout.zIndex,
  };
}

function snap(value: number) {
  return Math.max(0, Math.round(value / SNAP) * SNAP);
}
