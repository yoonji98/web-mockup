import type { CSSProperties, MouseEvent } from "react";

import { ElementRenderer } from "@/components/elements/ElementRenderer";
import { toCssStyle } from "@/components/elements/element-utils";
import { FreeformRenderer } from "@/components/layout/FreeformRenderer";
import { cn } from "@/lib/utils";
import type { ContainerNode, ElementNode, ElementTreeNode } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

type ContainerRendererProps = {
  colors: ThemeColors;
  node: ContainerNode;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
};

export function ContainerRenderer({ colors, node, onElementClick, radius }: ContainerRendererProps) {
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
      {node.children.map((child) => (
        <ElementRenderer
          colors={colors}
          key={child.id}
          node={child}
          onElementClick={onElementClick}
          radius={radius}
        />
      ))}
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
