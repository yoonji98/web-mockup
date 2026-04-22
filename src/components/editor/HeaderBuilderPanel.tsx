"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  GripVertical,
  Trash2,
} from "lucide-react";

import { elementLabels } from "@/data/element-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import { headerHeightTypes, headerVariants } from "@/types/page";
import type { ElementNode, HeaderSlotType } from "@/types/elements";
import type { HeaderConfig } from "@/types/page";

const editableHeaderElements = [
  "logo",
  "menu",
  "loginButton",
  "signupButton",
  "button",
  "link",
  "icon",
] as const;

const slotOrder: HeaderSlotType[] = ["left", "center", "right", "mobile"];
const slotLabels: Record<HeaderSlotType, string> = {
  center: "Center",
  left: "Left",
  mobile: "Mobile",
  right: "Right",
};

export function HeaderBuilderPanel() {
  const {
    addElementToHeaderSlot,
    moveHeaderElement,
    removeElement,
    selectElement,
    selectInsertionTarget,
    selectedElementId,
    site,
    updateElement,
    updateHeaderConfig,
  } = useEditorStore();
  const header = site.globalSections?.header;
  const slots = header?.slots ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Header Builder</CardTitle>
        <CardDescription>로고, 메뉴, 버튼을 슬롯에 배치합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <HeaderOptions header={header} updateHeaderConfig={updateHeaderConfig} />

        <div className="grid gap-3">
          {slotOrder.map((slot) => {
            const elements = slots[slot] ?? [];

            return (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-3"
                key={slot}
                onClick={() => selectInsertionTarget({ kind: "headerSlot", slot })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const dragged = readDraggedHeaderElement(event.dataTransfer.getData("text/plain"));

                  if (dragged) {
                    moveHeaderElement(dragged.elementId, slot);
                  }
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-950">{slotLabels[slot]}</p>
                  <Select
                    className="h-8 w-36 text-xs"
                    onChange={(event) => {
                      if (event.target.value) {
                        addElementToHeaderSlot(slot, event.target.value as ElementNode["type"]);
                      }
                    }}
                    value=""
                  >
                    <option value="">요소 추가</option>
                    {editableHeaderElements.map((type) => (
                      <option key={type} value={type}>
                        {elementLabels[type]}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-2">
                  {elements.length === 0 ? (
                    <button
                      className="rounded-xl border border-dashed border-slate-200 p-3 text-left text-xs font-semibold text-slate-400"
                      onClick={() => selectInsertionTarget({ kind: "headerSlot", slot })}
                      type="button"
                    >
                      이 슬롯에 추가
                    </button>
                  ) : null}

                  {elements.map((element, index) => (
                    <HeaderElementCard
                      element={element}
                      index={index}
                      isSelected={selectedElementId === element.id}
                      key={element.id}
                      onMove={(targetSlot, targetIndex) =>
                        moveHeaderElement(element.id, targetSlot, targetIndex)
                      }
                      onDropElement={(elementId, targetSlot, targetIndex) =>
                        moveHeaderElement(elementId, targetSlot, targetIndex)
                      }
                      onRemove={() => removeElement(element.id)}
                      onSelect={() =>
                        selectElement({ elementId: element.id, kind: "headerSlot", slot })
                      }
                      onUpdate={(label) => updateElement(element.id, { props: { label } })}
                      slot={slot}
                      total={elements.length}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function HeaderOptions({
  header,
  updateHeaderConfig,
}: {
  header: HeaderConfig | undefined;
  updateHeaderConfig: (update: Partial<HeaderConfig>) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="grid grid-cols-2 gap-2">
        <Select
          onChange={(event) => updateHeaderConfig({ variant: event.target.value as HeaderConfig["variant"] })}
          value={header?.variant ?? "cta-right"}
        >
          {headerVariants.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </Select>
        <Select
          onChange={(event) => updateHeaderConfig({ height: event.target.value as HeaderConfig["height"] })}
          value={header?.height ?? "md"}
        >
          {headerHeightTypes.map((height) => (
            <option key={height} value={height}>
              {height}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
        <label className="flex items-center gap-2">
          <input
            checked={header?.sticky ?? true}
            onChange={(event) => updateHeaderConfig({ sticky: event.target.checked })}
            type="checkbox"
          />
          Sticky
        </label>
        <label className="flex items-center gap-2">
          <input
            checked={header?.transparent ?? header?.variant === "transparent"}
            onChange={(event) => updateHeaderConfig({ transparent: event.target.checked })}
            type="checkbox"
          />
          Transparent
        </label>
      </div>
    </div>
  );
}

function HeaderElementCard({
  element,
  index,
  isSelected,
  onMove,
  onDropElement,
  onRemove,
  onSelect,
  onUpdate,
  slot,
  total,
}: {
  element: ElementNode;
  index: number;
  isSelected: boolean;
  onMove: (slot: HeaderSlotType, targetIndex?: number) => void;
  onDropElement: (elementId: string, slot: HeaderSlotType, targetIndex?: number) => void;
  onRemove: () => void;
  onSelect: () => void;
  onUpdate: (label: string) => void;
  slot: HeaderSlotType;
  total: number;
}) {
  const slotIndex = slotOrder.indexOf(slot);
  const label = typeof element.props?.label === "string" ? element.props.label : elementLabels[element.type];

  return (
    <div
      className={`rounded-xl border p-2 transition ${
        isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"
      }`}
      draggable
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", `${slot}:${element.id}`);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const dragged = readDraggedHeaderElement(event.dataTransfer.getData("text/plain"));

        if (dragged) {
          onDropElement(dragged.elementId, slot, index);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="text-slate-400" size={15} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-500">{elementLabels[element.type]}</p>
          <Input
            className="mt-1 h-8 text-xs"
            onChange={(event) => onUpdate(event.target.value)}
            value={label}
          />
        </div>
        <Button disabled={index <= 0} onClick={() => onMove(slot, index - 1)} size="icon" variant="ghost">
          <ArrowUp size={14} />
        </Button>
        <Button disabled={index >= total - 1} onClick={() => onMove(slot, index + 1)} size="icon" variant="ghost">
          <ArrowDown size={14} />
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1">
        <Button
          disabled={slotIndex <= 0}
          onClick={() => onMove(slotOrder[slotIndex - 1] ?? slot)}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft size={14} />
        </Button>
        <Button
          disabled={slotIndex >= slotOrder.length - 1}
          onClick={() => onMove(slotOrder[slotIndex + 1] ?? slot)}
          size="icon"
          variant="ghost"
        >
          <ArrowRight size={14} />
        </Button>
        <Button onClick={onRemove} size="icon" variant="ghost">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

function readDraggedHeaderElement(value: string) {
  const [slot, elementId] = value.split(":");

  if (!slot || !elementId || !slotOrder.includes(slot as HeaderSlotType)) {
    return null;
  }

  return {
    elementId,
    slot: slot as HeaderSlotType,
  };
}
