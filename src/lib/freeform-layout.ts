export type FreeformRect = {
  h: number;
  w: number;
  x: number;
  y: number;
};

export type FreeformBounds = {
  h: number;
  w: number;
};

export type ResizeHandle = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

export const FREEFORM_GRID_SIZE = 8;
export const FREEFORM_MIN_HEIGHT = 40;
export const FREEFORM_MIN_WIDTH = 60;

const resizeCursors: Record<ResizeHandle, string> = {
  e: "ew-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  nw: "nwse-resize",
  s: "ns-resize",
  se: "nwse-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

export function snapValue(value: number, gridSize = FREEFORM_GRID_SIZE) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value / gridSize) * gridSize;
}

export function getResizeCursor(handle: ResizeHandle) {
  return resizeCursors[handle];
}

export function resizeRectFromHandle(
  initialRect: FreeformRect,
  delta: { x: number; y: number },
  handle: ResizeHandle,
  gridSize = FREEFORM_GRID_SIZE,
): FreeformRect {
  const right = initialRect.x + initialRect.w;
  const bottom = initialRect.y + initialRect.h;
  let nextX = initialRect.x;
  let nextY = initialRect.y;
  let nextW = initialRect.w;
  let nextH = initialRect.h;

  if (handle.includes("e")) {
    nextW = snapValue(initialRect.w + delta.x, gridSize);
  }

  if (handle.includes("s")) {
    nextH = snapValue(initialRect.h + delta.y, gridSize);
  }

  if (handle.includes("w")) {
    nextX = snapValue(initialRect.x + delta.x, gridSize);
    nextW = snapValue(right - nextX, gridSize);
  }

  if (handle.includes("n")) {
    nextY = snapValue(initialRect.y + delta.y, gridSize);
    nextH = snapValue(bottom - nextY, gridSize);
  }

  return {
    h: nextH,
    w: nextW,
    x: nextX,
    y: nextY,
  };
}

export function clampRectToBounds(
  rect: FreeformRect,
  bounds: FreeformBounds,
  minWidth = FREEFORM_MIN_WIDTH,
  minHeight = FREEFORM_MIN_HEIGHT,
): FreeformRect {
  const boundedWidth = Math.max(1, bounds.w);
  const boundedHeight = Math.max(1, bounds.h);
  const effectiveMinWidth = Math.min(minWidth, boundedWidth);
  const effectiveMinHeight = Math.min(minHeight, boundedHeight);

  let nextW = Math.min(Math.max(rect.w, effectiveMinWidth), boundedWidth);
  let nextH = Math.min(Math.max(rect.h, effectiveMinHeight), boundedHeight);
  let nextX = Math.max(0, rect.x);
  let nextY = Math.max(0, rect.y);

  if (nextX > boundedWidth - effectiveMinWidth) {
    nextX = boundedWidth - effectiveMinWidth;
  }

  if (nextY > boundedHeight - effectiveMinHeight) {
    nextY = boundedHeight - effectiveMinHeight;
  }

  if (nextX + nextW > boundedWidth) {
    nextW = Math.max(effectiveMinWidth, boundedWidth - nextX);
  }

  if (nextY + nextH > boundedHeight) {
    nextH = Math.max(effectiveMinHeight, boundedHeight - nextY);
  }

  return {
    h: Math.round(nextH),
    w: Math.round(nextW),
    x: Math.round(nextX),
    y: Math.round(nextY),
  };
}
