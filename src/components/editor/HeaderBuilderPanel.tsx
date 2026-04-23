"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS as DndCSS } from "@dnd-kit/utilities";
import { GripVertical, ListTree, RotateCcw, Trash2 } from "lucide-react";
import type { CSSProperties } from "react";

import { getHeaderElementDragId, getHeaderSlotDropId } from "@/components/editor/dnd-data";
import { elementLabels } from "@/data/element-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ElementNode, ElementNodeType, HeaderSlotType } from "@/types/elements";
import { headerHeightTypes, headerVariants, type HeaderConfig } from "@/types/page";

const slotOrder: HeaderSlotType[] = ["left", "center", "right"];
const slotLabels: Record<HeaderSlotType, string> = {
  center: "Center",
  left: "Left",
  mobile: "Mobile",
  right: "Right",
};
const editableHeaderElements: Array<{ label: string; type: ElementNodeType }> = [
  { label: "Logo", type: "logo" },
  { label: "Menu", type: "menu" },
  { label: "Login Button", type: "loginButton" },
  { label: "Signup Button", type: "signupButton" },
  { label: "CTA Button", type: "button" },
  { label: "Link", type: "link" },
];

export function HeaderBuilderPanel() {
  const {
    addElementToHeaderSlot,
    removeElement,
    resetHeaderSlots,
    selectElement,
    selectedElementId,
    selectedHeaderSlot,
    setSelectedHeaderSlot,
    site,
    updateElement,
    updateHeaderConfig,
  } = useEditorStore();
  const header = site.globalSections?.header;
  const slots = header?.slots ?? {};
  const mobileAuto = (slots.mobile ?? []).length === 0;
  const hasHeaderElements = slotOrder.some((slot) => (slots[slot] ?? []).length > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Header Builder</CardTitle>
            <CardDescription>left / center / right 슬롯에 Header 요소를 배치합니다.</CardDescription>
          </div>
          <Button onClick={resetHeaderSlots} size="sm" variant="outline">
            <RotateCcw size={14} />
            기본
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <HeaderOptions
          header={header}
          mobileAuto={mobileAuto}
          onResetMobile={() => updateHeaderConfig({ slots: { ...slots, mobile: [] } })}
          updateHeaderConfig={updateHeaderConfig}
        />

        {!hasHeaderElements ? (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-xs font-semibold text-slate-500">
            Header가 비어 있습니다. 기본 Header를 생성하거나 아래 슬롯에 요소를 추가하세요.
          </div>
        ) : null}

        <div className="grid gap-3">
          {slotOrder.map((slot) => (
            <HeaderSlotCard
              addElement={(type) => addElementToHeaderSlot(slot, type)}
              elements={slots[slot] ?? []}
              isActive={selectedHeaderSlot === slot}
              key={slot}
              onRemove={removeElement}
              onSelectElement={(element) => selectElement({ elementId: element.id, kind: "headerSlot", slot })}
              onSelectSlot={() => setSelectedHeaderSlot(slot)}
              onUpdateLabel={(element, label) =>
                updateElement(element.id, {
                  props: element.type === "logo" ? { label, text: label } : { label },
                })
              }
              selectedElementId={selectedElementId}
              slot={slot}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HeaderOptions({
  header,
  mobileAuto,
  onResetMobile,
  updateHeaderConfig,
}: {
  header: HeaderConfig | undefined;
  mobileAuto: boolean;
  onResetMobile: () => void;
  updateHeaderConfig: (update: Partial<HeaderConfig>) => void;
}) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
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
      <div className="grid gap-2 text-xs font-semibold text-slate-600">
        <label className="flex items-center gap-2">
          <input
            checked={header?.sticky ?? true}
            onChange={(event) => updateHeaderConfig({ sticky: event.target.checked })}
            type="checkbox"
          />
          Sticky header
        </label>
        <label className="flex items-center gap-2">
          <input
            checked={header?.transparent ?? header?.variant === "transparent"}
            onChange={(event) => updateHeaderConfig({ transparent: event.target.checked })}
            type="checkbox"
          />
          Transparent header
        </label>
        <label className="flex items-center gap-2">
          <input checked={mobileAuto} onChange={onResetMobile} type="checkbox" />
          Mobile menu 자동 구성
        </label>
      </div>
    </div>
  );
}

function HeaderSlotCard({
  addElement,
  elements,
  isActive,
  onRemove,
  onSelectElement,
  onSelectSlot,
  onUpdateLabel,
  selectedElementId,
  slot,
}: {
  addElement: (type: ElementNodeType) => void;
  elements: ElementNode[];
  isActive: boolean;
  onRemove: (elementId: string) => void;
  onSelectElement: (element: ElementNode) => void;
  onSelectSlot: () => void;
  onUpdateLabel: (element: ElementNode, label: string) => void;
  selectedElementId: string | null;
  slot: HeaderSlotType;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: getHeaderSlotDropId(slot),
    data: {
      dropType: "headerSlot",
      index: elements.length,
      slot,
    },
  });

  return (
    <div
      className={cn(
        "rounded-md border bg-white p-3 transition",
        isActive ? "border-blue-400 ring-4 ring-blue-500/10" : "border-slate-200",
        isOver ? "border-blue-400 bg-blue-50/70" : "",
      )}
      onClick={onSelectSlot}
      ref={setNodeRef}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-950">{slotLabels[slot]}</p>
          <p className="text-[11px] font-medium text-slate-400">{slotHint(slot)}</p>
        </div>
        <Select
          className="h-8 w-36 text-xs"
          onChange={(event) => {
            if (event.target.value) {
              addElement(event.target.value as ElementNodeType);
            }
          }}
          value=""
        >
          <option value="">요소 추가</option>
          {editableHeaderElements.map((item) => (
            <option key={item.label} value={item.type}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      <SortableContext
        items={elements.map((element) => getHeaderElementDragId(slot, element.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-2">
          {elements.length === 0 ? (
            <button
              className="rounded-md border border-dashed border-slate-200 p-3 text-left text-xs font-semibold text-slate-400 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              onClick={(event) => {
                event.stopPropagation();
                onSelectSlot();
              }}
              type="button"
            >
              여기에 요소 추가 또는 드롭
            </button>
          ) : null}

          {elements.map((element, index) => (
            <HeaderElementCard
              element={element}
              index={index}
              isSelected={selectedElementId === element.id}
              key={element.id}
              onRemove={() => onRemove(element.id)}
              onSelect={() => onSelectElement(element)}
              onUpdate={(label) => onUpdateLabel(element, label)}
              slot={slot}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function HeaderElementCard({
  element,
  index,
  isSelected,
  onRemove,
  onSelect,
  onUpdate,
  slot,
}: {
  element: ElementNode;
  index: number;
  isSelected: boolean;
  onRemove: () => void;
  onSelect: () => void;
  onUpdate: (label: string) => void;
  slot: HeaderSlotType;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: getHeaderElementDragId(slot, element.id),
    data: {
      dragType: "headerElement",
      dropType: "headerElement",
      elementId: element.id,
      index,
      slot,
    },
  });
  const label =
    typeof element.props?.label === "string"
      ? element.props.label
      : typeof element.props?.text === "string"
        ? element.props.text
        : elementLabels[element.type];
  const style: CSSProperties = {
    opacity: isDragging ? 0.55 : undefined,
    transform: DndCSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        "rounded-md border p-2 transition",
        isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50",
      )}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center gap-2">
        <button
          aria-label="Header 요소 이동"
          className="grid h-8 w-8 cursor-grab place-items-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-700 active:cursor-grabbing"
          onClick={(event) => event.stopPropagation()}
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={15} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-xs font-semibold text-slate-500">
            <ListTree size={12} />
            {elementLabels[element.type]}
          </p>
          <Input className="mt-1 h-8 text-xs" onChange={(event) => onUpdate(event.target.value)} value={label} />
        </div>
        <Button onClick={onRemove} size="icon" variant="ghost">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

function slotHint(slot: HeaderSlotType) {
  if (slot === "left") {
    return "Logo / brand";
  }

  if (slot === "center") {
    return "Navigation";
  }

  return "Login / CTA";
}
