"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { elementLabels } from "@/data/element-defaults";
import { useEditorStore } from "@/store/editor-store";

import { getDragData, getDropData, type EditorDragData } from "./dnd-data";

type EditorDndContextProps = {
  children: ReactNode;
};

export function EditorDndContext({ children }: EditorDndContextProps) {
  const addElementToLocation = useEditorStore((state) => state.addElementToLocation);
  const createContainerSectionWithElement = useEditorStore(
    (state) => state.createContainerSectionWithElement,
  );
  const moveElement = useEditorStore((state) => state.moveElement);
  const reorderElements = useEditorStore((state) => state.reorderElements);
  const reorderSections = useEditorStore((state) => state.reorderSections);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [activeData, setActiveData] = useState<EditorDragData | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const overlayLabel = useMemo(() => {
    if (!activeData) {
      return "";
    }

    if (activeData.dragType === "libraryElement") {
      return elementLabels[activeData.elementType];
    }

    if (activeData.dragType === "section") {
      return "섹션 이동";
    }

    return "요소 이동";
  }, [activeData]);

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 1800);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveData(getDragData(event.active.data.current));
  }

  function handleDragEnd(event: DragEndEvent) {
    const dragData = getDragData(event.active.data.current);
    const dropData = getDropData(event.over?.data.current);
    setActiveData(null);

    if (!dragData || !dropData) {
      return;
    }

    if (dragData.dragType === "libraryElement") {
      if (dropData.dropType === "container") {
        addElementToLocation(dragData.elementType, dropData.location);
        showMessage(`${elementLabels[dragData.elementType]} 요소를 추가했습니다.`);
        return;
      }

      if (dropData.dropType === "element") {
        addElementToLocation(dragData.elementType, dropData.location, dropData.index);
        showMessage(`${elementLabels[dragData.elementType]} 요소를 추가했습니다.`);
        return;
      }

      if (dropData.dropType === "sectionInsert") {
        createContainerSectionWithElement(dragData.elementType, dropData.index);
        showMessage(`${elementLabels[dragData.elementType]} 섹션을 만들었습니다.`);
        return;
      }

      if (dropData.dropType === "page") {
        createContainerSectionWithElement(dragData.elementType);
        showMessage(`${elementLabels[dragData.elementType]} 섹션을 만들었습니다.`);
      }

      return;
    }

    if (dragData.dragType === "section" && dropData.dropType === "section") {
      reorderSections(dragData.blockId, dropData.blockId);
      return;
    }

    if (dragData.dragType !== "canvasElement") {
      return;
    }

    if (dropData.dropType === "element") {
      if (dragData.location.containerId === dropData.location.containerId) {
        reorderElements(dragData.location.containerId, dragData.elementId, dropData.elementId);
        return;
      }

      moveElement({
        elementId: dragData.elementId,
        from: dragData.location,
        index: dropData.index,
        to: dropData.location,
      });
      return;
    }

    if (dropData.dropType === "container") {
      moveElement({
        elementId: dragData.elementId,
        from: dragData.location,
        to: dropData.location,
      });
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {children}
      <DragOverlay>
        {activeData ? (
          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg">
            {overlayLabel}
          </div>
        ) : null}
      </DragOverlay>
      {message ? (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {message}
        </div>
      ) : null}
    </DndContext>
  );
}
