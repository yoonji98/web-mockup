"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";

import {
  elementLabels,
  elementLibraryCategories,
} from "@/data/element-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditorStore } from "@/store/editor-store";
import type { ElementNodeType } from "@/types/elements";

import { getLibraryElementDragId } from "./dnd-data";

export function ElementLibraryPanel() {
  const addElementToSelectedTarget = useEditorStore((state) => state.addElementToSelectedTarget);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectedContainerId = useEditorStore((state) => state.selectedContainerId);
  const selectedHeaderSlot = useEditorStore((state) => state.selectedHeaderSlot);
  const selectedInsertionTarget = useEditorStore((state) => state.selectedInsertionTarget);
  const hasTarget = Boolean(selectedHeaderSlot || selectedContainerId || selectedInsertionTarget || selectedBlockId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Element Library</CardTitle>
        <CardDescription>선택한 슬롯, 컨테이너, 블록에 요소를 추가합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!hasTarget ? (
          <p className="rounded-md bg-slate-50 p-3 text-xs font-semibold text-slate-500">
            선택된 위치가 없으면 새 컨테이너 섹션에 요소가 추가됩니다.
          </p>
        ) : null}

        {elementLibraryCategories.map((category) => (
          <div className="grid gap-2" key={category.name}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              {category.name}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {category.items.map((type) => (
                <ElementButton
                  key={type}
                  onClick={() => addElementToSelectedTarget(type)}
                  type={type}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ElementButton({
  onClick,
  type,
}: {
  onClick: () => void;
  type: ElementNodeType;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: getLibraryElementDragId(type),
    data: {
      dragType: "libraryElement",
      elementType: type,
    },
  });
  const style = {
    opacity: isDragging ? 0.55 : 1,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Button
        className="h-auto w-full cursor-grab justify-start px-3 py-2 text-left active:cursor-grabbing"
        onClick={onClick}
        variant="outline"
        {...attributes}
        {...listeners}
      >
        <Plus size={14} />
        <span className="min-w-0 truncate text-xs">{elementLabels[type]}</span>
      </Button>
    </div>
  );
}
