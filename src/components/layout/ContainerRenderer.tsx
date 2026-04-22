"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS as DndCSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import type { ContainerLocationRef, EditorSectionDndContext } from "@/components/editor/dnd-data";
import {
  getContainerDropId,
  getElementDragId,
} from "@/components/editor/dnd-data";
import { ElementRenderer } from "@/components/elements/ElementRenderer";
import { toCssStyle } from "@/components/elements/element-utils";
import { FreeformRenderer } from "@/components/layout/FreeformRenderer";
import { cn } from "@/lib/utils";
import type { ContainerNode, ElementNode, ElementTreeNode } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

type ContainerRendererProps = {
  colors: ThemeColors;
  editorDnd?: EditorSectionDndContext;
  node: ContainerNode;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
};

export function ContainerRenderer(props: ContainerRendererProps) {
  if (props.editorDnd) {
    return <DroppableContainerRenderer {...props} editorDnd={props.editorDnd} />;
  }

  return <ContainerContent {...props} />;
}

function DroppableContainerRenderer({
  colors,
  editorDnd,
  node,
  onElementClick,
  radius,
}: ContainerRendererProps & { editorDnd: EditorSectionDndContext }) {
  const location: ContainerLocationRef = {
    containerId: node.id,
    pageId: editorDnd.pageId,
    sectionId: editorDnd.sectionId,
    type: "container",
  };
  const { isOver, setNodeRef } = useDroppable({
    id: getContainerDropId(node.id),
    data: {
      dropType: "container",
      location,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-md transition",
        isOver ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-white" : "",
      )}
    >
      <ContainerContent
        colors={colors}
        editorDnd={editorDnd}
        node={node}
        onElementClick={onElementClick}
        radius={radius}
      />
    </div>
  );
}

function ContainerContent({ colors, editorDnd, node, onElementClick, radius }: ContainerRendererProps) {
  if (node.type === "freeform") {
    return (
      <FreeformRenderer
        colors={colors}
        elements={node.children.filter(isElementNode)}
        layouts={[]}
        onElementClick={onElementClick}
        radius={radius}
        style={node.style}
      />
    );
  }

  const location: ContainerLocationRef | null = editorDnd
    ? {
        containerId: node.id,
        pageId: editorDnd.pageId,
        sectionId: editorDnd.sectionId,
        type: "container",
      }
    : null;
  const style = toCssStyle(node.style);
  const columns = node.layout?.columns ?? defaultColumns(node.type);
  const isGrid = node.type === "grid" || node.type === "columns" || node.type === "cardGroup";
  const isHorizontal = node.layout?.direction === "horizontal" || node.type === "row" || node.type === "headerBar";

  if (isGrid && typeof columns === "string") {
    style.gridTemplateColumns = columns;
  }

  if (!isGrid) {
    style.alignItems = node.layout?.align;
    style.justifyContent = node.layout?.justify;
  }

  return (
    <div
      className={cn(
        "min-w-0",
        isGrid
          ? cn("grid gap-4", gridColumnClassName(columns))
          : "flex flex-col gap-4",
        !isGrid && isHorizontal ? "md:flex-row" : "",
        node.layout?.wrap ? "flex-wrap" : "",
      )}
      style={{
        ...style,
        gap: node.layout?.gap ?? style.gap,
      } as CSSProperties}
    >
      {location ? (
        <SortableContext
          items={node.children.filter(isElementNode).map((child) => getElementDragId(child.id))}
          strategy={verticalListSortingStrategy}
        >
          {node.children.map((child, index) =>
            isElementNode(child) ? (
              <SortableElementItem
                colors={colors}
                index={index}
                key={child.id}
                location={location}
                node={child}
                onElementClick={onElementClick}
                radius={radius}
              />
            ) : (
              <ElementRenderer
                colors={colors}
                editorDnd={editorDnd}
                key={child.id}
                node={child}
                onElementClick={onElementClick}
                radius={radius}
              />
            ),
          )}
        </SortableContext>
      ) : (
        node.children.map((child) => (
          <ElementRenderer
            colors={colors}
            key={child.id}
            node={child}
            onElementClick={onElementClick}
            radius={radius}
          />
        ))
      )}
    </div>
  );
}

function SortableElementItem({
  colors,
  index,
  location,
  node,
  onElementClick,
  radius,
}: {
  colors: ThemeColors;
  index: number;
  location: ContainerLocationRef;
  node: ElementNode;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
}) {
  const { attributes, isDragging, isOver, listeners, setNodeRef, transform, transition } = useSortable({
    id: getElementDragId(node.id),
    data: {
      dragType: "canvasElement",
      dropType: "element",
      elementId: node.id,
      index,
      location,
    },
  });
  const style: CSSProperties = {
    opacity: isDragging ? 0.45 : undefined,
    transform: DndCSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group/element relative min-w-0 rounded-md transition",
        isOver ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-white" : "",
      )}
      style={style}
    >
      <button
        aria-label="요소 이동"
        className="absolute -left-3 top-2 z-20 grid h-7 w-7 cursor-grab place-items-center rounded-md border border-slate-200 bg-white text-slate-400 opacity-0 shadow-sm transition hover:text-slate-700 focus:opacity-100 group-hover/element:opacity-100 active:cursor-grabbing"
        onClick={(event) => event.stopPropagation()}
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <ElementRenderer
        colors={colors}
        node={node}
        onElementClick={onElementClick}
        radius={radius}
      />
    </div>
  );
}

function isElementNode(node: ElementTreeNode): node is ElementNode {
  return !("children" in node);
}

function defaultColumns(type: ContainerNode["type"]) {
  if (type === "columns") {
    return 2;
  }

  if (type === "cardGroup") {
    return 3;
  }

  return 3;
}

function gridColumnClassName(columns: number | string) {
  if (typeof columns !== "number") {
    return "";
  }

  if (columns <= 2) {
    return "grid-cols-1 md:grid-cols-2";
  }

  if (columns === 3) {
    return "grid-cols-1 md:grid-cols-3";
  }

  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
}
