"use client";

import { Plus } from "lucide-react";

import {
  elementLabels,
  elementLibraryCategories,
} from "@/data/element-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditorStore } from "@/store/editor-store";
import type { ElementNodeType } from "@/types/elements";

export function ElementLibraryPanel() {
  const addElementToSelectedTarget = useEditorStore((state) => state.addElementToSelectedTarget);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectedInsertionTarget = useEditorStore((state) => state.selectedInsertionTarget);
  const hasTarget = Boolean(selectedInsertionTarget || selectedBlockId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Element Library</CardTitle>
        <CardDescription>선택한 슬롯, 컨테이너, 블록에 요소를 추가합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!hasTarget ? (
          <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700">
            캔버스에서 블록을 선택하거나 Header 슬롯을 선택하세요.
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
                  disabled={!hasTarget}
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
  disabled,
  onClick,
  type,
}: {
  disabled: boolean;
  onClick: () => void;
  type: ElementNodeType;
}) {
  return (
    <Button
      className="h-auto justify-start px-3 py-2 text-left"
      disabled={disabled}
      onClick={onClick}
      variant="outline"
    >
      <Plus size={14} />
      <span className="min-w-0 truncate text-xs">{elementLabels[type]}</span>
    </Button>
  );
}
