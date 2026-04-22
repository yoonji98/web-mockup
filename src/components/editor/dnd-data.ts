import type { ElementNodeType, LocationRef } from "@/types/elements";

export type ContainerLocationRef = Extract<LocationRef, { type: "container" }>;

export type LibraryElementDragData = {
  dragType: "libraryElement";
  elementType: ElementNodeType;
};

export type SectionDragData = {
  blockId: string;
  dragType: "section";
  dropType: "section";
  pageId: string;
};

export type CanvasElementDragData = {
  dragType: "canvasElement";
  dropType: "element";
  elementId: string;
  index: number;
  location: ContainerLocationRef;
};

export type ContainerDropData = {
  dropType: "container";
  location: ContainerLocationRef;
};

export type SectionInsertDropData = {
  dropType: "sectionInsert";
  index: number;
  pageId: string;
};

export type PageDropData = {
  dropType: "page";
  pageId: string;
};

export type EditorDragData = LibraryElementDragData | SectionDragData | CanvasElementDragData;
export type EditorDropData =
  | CanvasElementDragData
  | ContainerDropData
  | PageDropData
  | SectionDragData
  | SectionInsertDropData;

export type EditorSectionDndContext = {
  pageId: string;
  sectionId: string;
};

export function getContainerDropId(containerId: string) {
  return `container:${containerId}`;
}

export function getElementDragId(elementId: string) {
  return `element:${elementId}`;
}

export function getLibraryElementDragId(type: ElementNodeType) {
  return `library:${type}`;
}

export function getPageDropId(pageId: string) {
  return `page:${pageId}`;
}

export function getSectionDragId(blockId: string) {
  return `section:${blockId}`;
}

export function getSectionInsertDropId(pageId: string, index: number) {
  return `section-insert:${pageId}:${index}`;
}

export function getDragData(value: unknown): EditorDragData | null {
  if (!isRecord(value) || typeof value.dragType !== "string") {
    return null;
  }

  if (value.dragType === "libraryElement" && typeof value.elementType === "string") {
    return value as LibraryElementDragData;
  }

  if (
    value.dragType === "section" &&
    value.dropType === "section" &&
    typeof value.blockId === "string" &&
    typeof value.pageId === "string"
  ) {
    return value as SectionDragData;
  }

  if (
    value.dragType === "canvasElement" &&
    typeof value.elementId === "string" &&
    typeof value.index === "number" &&
    isContainerLocation(value.location)
  ) {
    return value as CanvasElementDragData;
  }

  return null;
}

export function getDropData(value: unknown): EditorDropData | null {
  if (!isRecord(value) || typeof value.dropType !== "string") {
    return null;
  }

  if (value.dropType === "section" && getDragData(value)?.dragType === "section") {
    return value as SectionDragData;
  }

  if (value.dropType === "container" && isContainerLocation(value.location)) {
    return value as ContainerDropData;
  }

  if (
    value.dropType === "sectionInsert" &&
    typeof value.pageId === "string" &&
    typeof value.index === "number"
  ) {
    return value as SectionInsertDropData;
  }

  if (value.dropType === "page" && typeof value.pageId === "string") {
    return value as PageDropData;
  }

  if (
    value.dropType === "element" &&
    value.dragType === "canvasElement" &&
    typeof value.elementId === "string" &&
    typeof value.index === "number" &&
    isContainerLocation(value.location)
  ) {
    return value as CanvasElementDragData;
  }

  return null;
}

function isContainerLocation(value: unknown): value is ContainerLocationRef {
  return (
    isRecord(value) &&
    value.type === "container" &&
    typeof value.pageId === "string" &&
    typeof value.sectionId === "string" &&
    typeof value.containerId === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
