import type {
  ElementNodeType,
  FreeformElementLayout,
  HeaderSlotType,
  LocationRef,
} from "@/types/elements";

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

export type HeaderElementDragData = {
  dragType: "headerElement";
  dropType: "headerElement";
  elementId: string;
  index: number;
  slot: HeaderSlotType;
};

export type FreeformElementDragData = {
  blockId: string;
  dragType: "freeformElement";
  elementId: string;
  layout: FreeformElementLayout;
};

export type ContainerDropData = {
  dropType: "container";
  location: ContainerLocationRef;
};

export type FreeformCanvasDropData = {
  blockId: string;
  dropType: "freeformCanvas";
  pageId: string;
};

export type HeaderSlotDropData = {
  dropType: "headerSlot";
  index?: number;
  slot: HeaderSlotType;
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

export type EditorDragData =
  | CanvasElementDragData
  | FreeformElementDragData
  | HeaderElementDragData
  | LibraryElementDragData
  | SectionDragData;
export type EditorDropData =
  | CanvasElementDragData
  | ContainerDropData
  | FreeformCanvasDropData
  | HeaderElementDragData
  | HeaderSlotDropData
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

export function getFreeformCanvasDropId(blockId: string) {
  return `freeform-canvas:${blockId}`;
}

export function getFreeformElementDragId(blockId: string, elementId: string) {
  return `freeform-element:${blockId}:${elementId}`;
}

export function getLibraryElementDragId(type: ElementNodeType) {
  return `library:${type}`;
}

export function getHeaderElementDragId(slot: HeaderSlotType, elementId: string) {
  return `header-element:${slot}:${elementId}`;
}

export function getHeaderSlotDropId(slot: HeaderSlotType) {
  return `header-slot:${slot}`;
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
    value.dropType === "element" &&
    typeof value.elementId === "string" &&
    typeof value.index === "number" &&
    isContainerLocation(value.location)
  ) {
    return value as CanvasElementDragData;
  }

  if (
    value.dragType === "headerElement" &&
    value.dropType === "headerElement" &&
    typeof value.elementId === "string" &&
    typeof value.index === "number" &&
    isHeaderSlot(value.slot)
  ) {
    return value as HeaderElementDragData;
  }

  if (
    value.dragType === "freeformElement" &&
    typeof value.blockId === "string" &&
    typeof value.elementId === "string" &&
    isFreeformElementLayout(value.layout)
  ) {
    return value as FreeformElementDragData;
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
    value.dropType === "freeformCanvas" &&
    typeof value.blockId === "string" &&
    typeof value.pageId === "string"
  ) {
    return value as FreeformCanvasDropData;
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

  if (value.dropType === "headerSlot" && isHeaderSlot(value.slot)) {
    return value as HeaderSlotDropData;
  }

  if (
    value.dropType === "headerElement" &&
    value.dragType === "headerElement" &&
    typeof value.elementId === "string" &&
    typeof value.index === "number" &&
    isHeaderSlot(value.slot)
  ) {
    return value as HeaderElementDragData;
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

function isHeaderSlot(value: unknown): value is HeaderSlotType {
  return value === "left" || value === "center" || value === "right" || value === "mobile";
}

function isFreeformElementLayout(value: unknown): value is FreeformElementLayout {
  return (
    isRecord(value) &&
    typeof value.elementId === "string" &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.w === "number" &&
    typeof value.h === "number" &&
    (typeof value.zIndex === "number" || typeof value.zIndex === "undefined") &&
    (value.breakpoint === "desktop" || value.breakpoint === "tablet" || value.breakpoint === "mobile")
  );
}
