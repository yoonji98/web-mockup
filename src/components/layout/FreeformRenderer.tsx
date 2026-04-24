"use client";

import type { CSSProperties, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Scan } from "lucide-react";

import type { EditorSectionDndContext } from "@/components/editor/dnd-data";
import { getFreeformCanvasDropId } from "@/components/editor/dnd-data";
import { ElementRenderer } from "@/components/elements/ElementRenderer";
import { toCssStyle } from "@/components/elements/element-utils";
import {
  clampRectToBounds,
  FREEFORM_GRID_SIZE,
  getResizeCursor,
  resizeRectFromHandle,
  snapValue,
  type FreeformBounds,
  type FreeformRect,
  type ResizeHandle,
} from "@/lib/freeform-layout";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ElementNode, ElementStyle, FreeformElementLayout } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

const RESIZE_HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

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
          backgroundSize: `${FREEFORM_GRID_SIZE * 2}px ${FREEFORM_GRID_SIZE * 2}px`,
        }}
      >
        <div className="pointer-events-none absolute left-3 top-3 z-30 flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm">
          <Scan size={13} />
          고급 · Snap {FREEFORM_GRID_SIZE}px · Responsive 주의
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
  const selectElement = useEditorStore((state) => state.selectElement);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const updateFreeformElementLayout = useEditorStore((state) => state.updateFreeformElementLayout);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const gestureRef = useRef<FreeformGesture | null>(null);
  const [activeRect, setActiveRect] = useState<FreeformRect | null>(null);
  const isSelected = selectedElementId === element.id;
  const currentRect = activeRect ?? layoutToRect(layout);
  const style: CSSProperties = {
    ...rectStyle(currentRect, layout.zIndex),
    touchAction: "none",
  };

  function commitRect(nextRect: FreeformRect) {
    const previousRect = gestureRef.current?.lastRect ?? layoutToRect(layout);

    if (rectsEqual(previousRect, nextRect)) {
      return;
    }

    gestureRef.current = gestureRef.current
      ? {
          ...gestureRef.current,
          lastRect: nextRect,
        }
      : gestureRef.current;

    setActiveRect(nextRect);
    updateFreeformElementLayout(blockId, element.id, {
      breakpoint: layout.breakpoint,
      h: nextRect.h,
      historyGroupKey: gestureRef.current?.historyGroupKey,
      w: nextRect.w,
      x: nextRect.x,
      y: nextRect.y,
    });
  }

  function startMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || isEditorControlTarget(event.target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectElement(element.id);

    const initialRect = layoutToRect(layout);
    gestureRef.current = {
      bounds: getFrameBounds(frameRef.current, initialRect),
      historyGroupKey: createFreeformGestureKey(blockId, element.id),
      initialRect,
      kind: "move",
      lastRect: initialRect,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const gesture = gestureRef.current;

      if (!gesture || gesture.kind !== "move") {
        return;
      }

      const nextRect = clampRectToBounds(
        {
          ...gesture.initialRect,
          x: snapValue(gesture.initialRect.x + moveEvent.clientX - gesture.pointerX),
          y: snapValue(gesture.initialRect.y + moveEvent.clientY - gesture.pointerY),
        },
        gesture.bounds,
      );

      commitRect(nextRect);
    };

    const handlePointerUp = () => {
      gestureRef.current = null;
      setActiveRect(null);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function startResize(handle: ResizeHandle, event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectElement(element.id);

    const initialRect = layoutToRect(layout);
    gestureRef.current = {
      bounds: getFrameBounds(frameRef.current, initialRect),
      handle,
      historyGroupKey: createFreeformGestureKey(blockId, element.id),
      initialRect,
      kind: "resize",
      lastRect: initialRect,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const gesture = gestureRef.current;

      if (!gesture || gesture.kind !== "resize") {
        return;
      }

      const resizedRect = resizeRectFromHandle(
        gesture.initialRect,
        {
          x: moveEvent.clientX - gesture.pointerX,
          y: moveEvent.clientY - gesture.pointerY,
        },
        gesture.handle,
      );

      commitRect(clampRectToBounds(resizedRect, gesture.bounds));
    };

    const handlePointerUp = () => {
      gestureRef.current = null;
      setActiveRect(null);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  return (
    <div
      className={cn("group/freeform absolute", isSelected ? "z-20" : undefined)}
      onClick={(event) => {
        event.stopPropagation();
        onElementClick?.(element.id, event);
      }}
      ref={frameRef}
      style={style}
    >
      <div
        className={cn(
          "h-full min-h-0 overflow-hidden rounded-md bg-white/0 ring-1 ring-transparent transition",
          isSelected ? "ring-2 ring-blue-500" : "group-hover/freeform:ring-blue-300",
        )}
      >
        <ElementRenderer colors={colors} node={element} onElementClick={onElementClick} radius={radius} />
      </div>
      <div
        aria-label="Freeform 요소 이동"
        className={cn(
          "absolute inset-0 z-30 cursor-move rounded-md transition",
          isSelected ? "bg-blue-500/0" : "group-hover/freeform:bg-blue-500/[0.02]",
        )}
        onPointerDown={startMove}
        role="button"
        tabIndex={-1}
      />
      {isSelected ? (
        <>
          <div className="pointer-events-none absolute left-1 top-1 z-50 rounded bg-slate-950/85 px-2 py-1 text-[10px] font-bold leading-none text-white shadow-sm">
            {currentRect.w}x{currentRect.h} · x{currentRect.x} y{currentRect.y}
          </div>
          {RESIZE_HANDLES.map((handle) => (
            <button
              aria-label={`Freeform 요소 ${handle} 크기 조절`}
              className={cn(
                "absolute z-50 h-3 w-3 rounded-full border border-blue-600 bg-white shadow-sm ring-2 ring-white transition hover:scale-110",
                handleClassName(handle),
              )}
              data-freeform-control="true"
              key={handle}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => startResize(handle, event)}
              style={{ cursor: getResizeCursor(handle) }}
              type="button"
            />
          ))}
        </>
      ) : null}
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

type FreeformGesture =
  | {
      bounds: FreeformBounds;
      historyGroupKey: string;
      initialRect: FreeformRect;
      kind: "move";
      lastRect: FreeformRect;
      pointerX: number;
      pointerY: number;
    }
  | {
      bounds: FreeformBounds;
      handle: ResizeHandle;
      historyGroupKey: string;
      initialRect: FreeformRect;
      kind: "resize";
      lastRect: FreeformRect;
      pointerX: number;
      pointerY: number;
    };

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

function layoutToRect(layout: FreeformElementLayout): FreeformRect {
  return {
    h: layout.h,
    w: layout.w,
    x: layout.x,
    y: layout.y,
  };
}

function layoutStyle(layout: FreeformElementLayout): CSSProperties {
  return rectStyle(layoutToRect(layout), layout.zIndex);
}

function rectStyle(rect: FreeformRect, zIndex: number | undefined): CSSProperties {
  return {
    height: `${rect.h}px`,
    left: `${rect.x}px`,
    position: "absolute",
    top: `${rect.y}px`,
    width: `${rect.w}px`,
    zIndex,
  };
}

function rectsEqual(a: FreeformRect, b: FreeformRect) {
  return a.h === b.h && a.w === b.w && a.x === b.x && a.y === b.y;
}

function getFrameBounds(frame: HTMLDivElement | null, fallbackRect: FreeformRect): FreeformBounds {
  const parent = frame?.parentElement;

  return {
    h: parent?.clientHeight || Math.max(fallbackRect.y + fallbackRect.h, fallbackRect.h),
    w: parent?.clientWidth || Math.max(fallbackRect.x + fallbackRect.w, fallbackRect.w),
  };
}

function createFreeformGestureKey(blockId: string, elementId: string) {
  return `freeform-gesture:${blockId}:${elementId}:${Date.now()}`;
}

function isEditorControlTarget(target: EventTarget) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'button, a, input, textarea, select, [contenteditable="true"], [data-freeform-control="true"]',
    ),
  );
}

function handleClassName(handle: ResizeHandle) {
  switch (handle) {
    case "n":
      return "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2";
    case "e":
      return "right-0 top-1/2 -translate-y-1/2 translate-x-1/2";
    case "s":
      return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
    case "w":
      return "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2";
    case "ne":
      return "right-0 top-0 -translate-y-1/2 translate-x-1/2";
    case "nw":
      return "left-0 top-0 -translate-x-1/2 -translate-y-1/2";
    case "se":
      return "bottom-0 right-0 translate-x-1/2 translate-y-1/2";
    case "sw":
      return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2";
  }
}
