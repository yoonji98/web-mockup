"use client";

import { ChevronRight, Home } from "lucide-react";

import { elementLabels } from "@/data/element-defaults";
import { useEditorStore } from "@/store/editor-store";
import type { ContainerNode, ElementNode, ElementTreeNode, HeaderSlotType } from "@/types/elements";
import type { Block } from "@/types/page";

export function SelectionBreadcrumb() {
  const {
    currentPageId,
    selectedBlockId,
    selectedContainerId,
    selectedElementId,
    selectedHeaderSlot,
    site,
  } = useEditorStore();
  const currentPage = site.pages.find((page) => page.id === currentPageId) ?? site.pages[0];
  const trail = buildTrail({
    blocks: currentPage?.blocks ?? [],
    selectedBlockId,
    selectedContainerId,
    selectedElementId,
    selectedHeaderSlot,
    slots: site.globalSections?.header?.slots,
    title: currentPage?.title ?? "Page",
  });

  return (
    <div className="mb-3 flex min-h-9 items-center gap-1 overflow-x-auto rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
      <Home size={13} />
      {trail.map((item, index) => (
        <span className="inline-flex shrink-0 items-center gap-1" key={`${item}-${index}`}>
          {index > 0 ? <ChevronRight size={12} /> : null}
          <span className={index === trail.length - 1 ? "text-slate-950" : ""}>{item}</span>
        </span>
      ))}
    </div>
  );
}

function buildTrail({
  blocks,
  selectedBlockId,
  selectedContainerId,
  selectedElementId,
  selectedHeaderSlot,
  slots,
  title,
}: {
  blocks: Block[];
  selectedBlockId: string | null;
  selectedContainerId: string | null;
  selectedElementId: string | null;
  selectedHeaderSlot: HeaderSlotType | null;
  slots?: Partial<Record<HeaderSlotType, ElementNode[]>>;
  title: string;
}) {
  if (selectedElementId) {
    const headerMatch = findHeaderElement(slots, selectedElementId);

    if (headerMatch) {
      return [title, "Header", headerMatch.slot, elementLabels[headerMatch.element.type]];
    }

    const blockMatch = findElementInBlocks(blocks, selectedElementId);

    if (blockMatch) {
      return [
        title,
        blockLabel(blockMatch.block),
        ...(blockMatch.container ? [containerLabel(blockMatch.container)] : []),
        elementLabels[blockMatch.element.type],
      ];
    }
  }

  if (selectedContainerId) {
    const match = findContainerInBlocks(blocks, selectedContainerId);

    if (match) {
      return [title, blockLabel(match.block), containerLabel(match.container)];
    }
  }

  if (selectedBlockId) {
    const block = blocks.find((item) => item.id === selectedBlockId);

    return [title, block ? blockLabel(block) : "Section"];
  }

  if (selectedHeaderSlot) {
    return [title, "Header", selectedHeaderSlot];
  }

  return [title];
}

function findHeaderElement(slots: Partial<Record<HeaderSlotType, ElementNode[]>> | undefined, elementId: string) {
  if (!slots) {
    return null;
  }

  for (const slot of ["left", "center", "right", "mobile"] as HeaderSlotType[]) {
    const element = (slots[slot] ?? []).find((item) => item.id === elementId);

    if (element) {
      return { element, slot };
    }
  }

  return null;
}

function findElementInBlocks(blocks: Block[], elementId: string) {
  for (const block of blocks) {
    const rootElement = (block.elements ?? []).find((element) => element.id === elementId);

    if (rootElement) {
      return { block, container: undefined, element: rootElement };
    }

    for (const container of block.containers ?? []) {
      const match = findElementInTree(container, elementId);

      if (match) {
        return { block, ...match };
      }
    }
  }

  return null;
}

function findElementInTree(node: ElementTreeNode, elementId: string): { container: ContainerNode; element: ElementNode } | null {
  if (!("children" in node)) {
    return null;
  }

  for (const child of node.children) {
    if ("children" in child) {
      const match = findElementInTree(child, elementId);

      if (match) {
        return match;
      }
    } else if (child.id === elementId) {
      return { container: node, element: child };
    }
  }

  return null;
}

function findContainerInBlocks(blocks: Block[], containerId: string) {
  for (const block of blocks) {
    for (const container of block.containers ?? []) {
      const match = findContainerInTree(container, containerId);

      if (match) {
        return { block, container: match };
      }
    }
  }

  return null;
}

function findContainerInTree(container: ContainerNode, containerId: string): ContainerNode | null {
  if (container.id === containerId) {
    return container;
  }

  for (const child of container.children) {
    if ("children" in child) {
      const match = findContainerInTree(child, containerId);

      if (match) {
        return match;
      }
    }
  }

  return null;
}

function blockLabel(block: Block) {
  return block.props && "title" in block.props && typeof block.props.title === "string"
    ? block.props.title
    : block.type;
}

function containerLabel(container: ContainerNode) {
  return `${container.type} container`;
}
