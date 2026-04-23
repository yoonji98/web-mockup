"use client";

import { useMemo, useState } from "react";
import {
  Box,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderTree,
  Layers,
  PanelTop,
  Square,
} from "lucide-react";

import { elementLabels } from "@/data/element-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ContainerNode, ElementNode, HeaderSlotType } from "@/types/elements";
import type { Block } from "@/types/page";

const slotOrder: HeaderSlotType[] = ["left", "center", "right", "mobile"];

export function LayerTreePanel() {
  const {
    currentPageId,
    selectBlock,
    selectContainer,
    selectElement,
    selectedBlockId,
    selectedContainerId,
    selectedElementId,
    selectedHeaderSlot,
    setSelectedHeaderSlot,
    site,
  } = useEditorStore();
  const currentPage = site.pages.find((page) => page.id === currentPageId) ?? site.pages[0];
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(["page", "header", ...slotOrder.map((slot) => `slot:${slot}`)]),
  );
  const activeId = useMemo(() => {
    if (selectedElementId) {
      return `element:${selectedElementId}`;
    }

    if (selectedContainerId) {
      return `container:${selectedContainerId}`;
    }

    if (selectedBlockId) {
      return `block:${selectedBlockId}`;
    }

    if (selectedHeaderSlot) {
      return `slot:${selectedHeaderSlot}`;
    }

    return "page";
  }, [selectedBlockId, selectedContainerId, selectedElementId, selectedHeaderSlot]);

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <div className="grid gap-3">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Layers size={16} />
          Layers
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">클릭하기 어려운 요소를 트리에서 선택합니다.</p>
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-2">
        <TreeRow
          active={activeId === "header"}
          depth={0}
          icon={PanelTop}
          id="header"
          label="Header"
          onSelect={() => toggle("header")}
          onToggle={() => toggle("header")}
          open={openIds.has("header")}
          toggleable
        />
        {openIds.has("header")
          ? slotOrder.map((slot) => (
              <SlotNode
                activeId={activeId}
                elements={site.globalSections?.header?.slots?.[slot] ?? []}
                key={slot}
                onSelectElement={(id) => selectElement(id)}
                onSelectSlot={() => setSelectedHeaderSlot(slot)}
                onToggle={toggle}
                openIds={openIds}
                slot={slot}
              />
            ))
          : null}

        <TreeRow
          active={activeId === "page"}
          depth={0}
          icon={FileText}
          id="page"
          label={currentPage?.title ?? "Page"}
          onSelect={() => toggle("page")}
          onToggle={() => toggle("page")}
          open={openIds.has("page")}
          toggleable
        />
        {openIds.has("page")
          ? (currentPage?.blocks ?? []).map((block) => (
              <BlockNode
                activeId={activeId}
                block={block}
                key={block.id}
                onSelectBlock={() => selectBlock(block.id)}
                onSelectContainer={selectContainer}
                onSelectElement={(id) => selectElement(id)}
                onToggle={toggle}
                openIds={openIds}
              />
            ))
          : null}
      </div>
    </div>
  );
}

function SlotNode({
  activeId,
  elements,
  onSelectElement,
  onSelectSlot,
  onToggle,
  openIds,
  slot,
}: {
  activeId: string;
  elements: ElementNode[];
  onSelectElement: (id: string) => void;
  onSelectSlot: () => void;
  onToggle: (id: string) => void;
  openIds: Set<string>;
  slot: HeaderSlotType;
}) {
  const id = `slot:${slot}`;

  return (
    <>
      <TreeRow
        active={activeId === id}
        depth={1}
        icon={FolderTree}
        id={id}
        label={`${slot} slot`}
        onSelect={onSelectSlot}
        onToggle={() => onToggle(id)}
        open={openIds.has(id)}
        toggleable
      />
      {openIds.has(id)
        ? elements.map((element) => (
            <ElementRow
              active={activeId === `element:${element.id}`}
              depth={2}
              element={element}
              key={element.id}
              onSelect={() => onSelectElement(element.id)}
            />
          ))
        : null}
    </>
  );
}

function BlockNode({
  activeId,
  block,
  onSelectBlock,
  onSelectContainer,
  onSelectElement,
  onToggle,
  openIds,
}: {
  activeId: string;
  block: Block;
  onSelectBlock: () => void;
  onSelectContainer: (id: string | null) => void;
  onSelectElement: (id: string) => void;
  onToggle: (id: string) => void;
  openIds: Set<string>;
}) {
  const id = `block:${block.id}`;
  const hasChildren = (block.containers?.length ?? 0) > 0 || (block.elements?.length ?? 0) > 0;

  return (
    <>
      <TreeRow
        active={activeId === id}
        depth={1}
        icon={Square}
        id={id}
        label={blockLabel(block)}
        onSelect={onSelectBlock}
        onToggle={() => onToggle(id)}
        open={openIds.has(id)}
        toggleable={hasChildren}
      />
      {openIds.has(id)
        ? [
            ...(block.containers ?? []).map((container) => (
              <ContainerNodeRow
                activeId={activeId}
                container={container}
                depth={2}
                key={container.id}
                onSelectContainer={onSelectContainer}
                onSelectElement={onSelectElement}
                onToggle={onToggle}
                openIds={openIds}
              />
            )),
            ...(block.elements ?? []).map((element) => (
              <ElementRow
                active={activeId === `element:${element.id}`}
                depth={2}
                element={element}
                key={element.id}
                onSelect={() => onSelectElement(element.id)}
              />
            )),
          ]
        : null}
    </>
  );
}

function ContainerNodeRow({
  activeId,
  container,
  depth,
  onSelectContainer,
  onSelectElement,
  onToggle,
  openIds,
}: {
  activeId: string;
  container: ContainerNode;
  depth: number;
  onSelectContainer: (id: string | null) => void;
  onSelectElement: (id: string) => void;
  onToggle: (id: string) => void;
  openIds: Set<string>;
}) {
  const id = `container:${container.id}`;

  return (
    <>
      <TreeRow
        active={activeId === id}
        depth={depth}
        icon={Box}
        id={id}
        label={`${container.type} container`}
        onSelect={() => onSelectContainer(container.id)}
        onToggle={() => onToggle(id)}
        open={openIds.has(id)}
        toggleable={container.children.length > 0}
      />
      {openIds.has(id)
        ? container.children.map((child) =>
            "children" in child ? (
              <ContainerNodeRow
                activeId={activeId}
                container={child}
                depth={depth + 1}
                key={child.id}
                onSelectContainer={onSelectContainer}
                onSelectElement={onSelectElement}
                onToggle={onToggle}
                openIds={openIds}
              />
            ) : (
              <ElementRow
                active={activeId === `element:${child.id}`}
                depth={depth + 1}
                element={child}
                key={child.id}
                onSelect={() => onSelectElement(child.id)}
              />
            ),
          )
        : null}
    </>
  );
}

function ElementRow({
  active,
  depth,
  element,
  onSelect,
}: {
  active: boolean;
  depth: number;
  element: ElementNode;
  onSelect: () => void;
}) {
  return (
    <TreeRow
      active={active}
      depth={depth}
      icon={elementIcon()}
      id={`element:${element.id}`}
      label={elementLabel(element)}
      onSelect={onSelect}
    />
  );
}

function TreeRow({
  active,
  depth,
  icon: Icon,
  id,
  label,
  onSelect,
  onToggle,
  open,
  toggleable = false,
}: {
  active: boolean;
  depth: number;
  icon: typeof Layers;
  id: string;
  label: string;
  onSelect: () => void;
  onToggle?: () => void;
  open?: boolean;
  toggleable?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold transition",
        active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
      )}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
    >
      <button
        aria-label={`${id} 펼치기`}
        className="grid h-5 w-5 place-items-center text-slate-400"
        disabled={!toggleable}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
        type="button"
      >
        {toggleable ? open ? <ChevronDown size={13} /> : <ChevronRight size={13} /> : null}
      </button>
      <button className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={onSelect} type="button">
        <Icon className="shrink-0" size={13} />
        <span className="truncate">{label}</span>
      </button>
    </div>
  );
}

function blockLabel(block: Block) {
  return block.props && "title" in block.props && typeof block.props.title === "string"
    ? block.props.title
    : block.type;
}

function elementLabel(element: ElementNode) {
  const text = typeof element.props?.text === "string" ? element.props.text : null;
  const label = typeof element.props?.label === "string" ? element.props.label : null;

  return label || text || elementLabels[element.type];
}

function elementIcon() {
  return Square;
}
