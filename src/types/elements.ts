export const elementNodeTypes = [
  "logo",
  "text",
  "heading",
  "button",
  "image",
  "icon",
  "menu",
  "link",
  "badge",
  "card",
  "form",
  "input",
  "textarea",
  "divider",
  "spacer",
  "socialLinks",
  "loginButton",
  "signupButton",
] as const;

export const containerNodeTypes = [
  "stack",
  "row",
  "grid",
  "columns",
  "headerBar",
  "cardGroup",
  "freeform",
] as const;

export const elementResponsiveBreakpoints = ["desktop", "tablet", "mobile"] as const;
export const headerSlotTypes = ["left", "center", "right", "mobile"] as const;

export type ElementNodeType = (typeof elementNodeTypes)[number];
export type ContainerNodeType = (typeof containerNodeTypes)[number];
export type ElementResponsiveBreakpoint = (typeof elementResponsiveBreakpoints)[number];
export type HeaderSlotType = (typeof headerSlotTypes)[number];

export type ElementPropValue =
  | string
  | number
  | boolean
  | null
  | ElementPropValue[]
  | { [key: string]: ElementPropValue };

export type ElementProps = Record<string, ElementPropValue>;

export type ElementStyle = {
  alignSelf?: string;
  backgroundColor?: string;
  borderRadius?: string;
  color?: string;
  display?: string;
  height?: string;
  justifySelf?: string;
  margin?: string;
  maxWidth?: string;
  padding?: string;
  textAlign?: "left" | "center" | "right";
  width?: string;
};

export type ElementResponsive = Partial<Record<ElementResponsiveBreakpoint, ElementStyle>>;

export type ElementNode = {
  id: string;
  props?: ElementProps;
  responsive?: ElementResponsive;
  style?: ElementStyle;
  type: ElementNodeType;
};

export type ContainerLayout = {
  align?: string;
  columns?: number | string;
  direction?: "horizontal" | "vertical";
  gap?: string;
  justify?: string;
  wrap?: boolean;
};

export type ContainerNode = {
  children: ElementTreeNode[];
  id: string;
  layout?: ContainerLayout;
  responsive?: ElementResponsive;
  style?: ElementStyle;
  type: ContainerNodeType;
};

export type ElementTreeNode = ElementNode | ContainerNode;

export type BlockElementContent = {
  containers?: ContainerNode[];
  elements?: ElementNode[];
};

export type HeaderSlots = Partial<Record<HeaderSlotType, ElementNode[]>>;

export type LocationRef =
  | {
      pageId: string;
      type: "page";
    }
  | {
      pageId: string;
      sectionId: string;
      type: "section";
    }
  | {
      containerId: string;
      pageId: string;
      sectionId: string;
      type: "container";
    }
  | {
      slot: HeaderSlotType;
      type: "headerSlot";
    };

export type ElementInsertionTarget =
  | {
      kind: "headerSlot";
      slot: HeaderSlotType;
    }
  | {
      blockId: string;
      containerId?: string;
      kind: "block";
    };

export type ElementSelection = ElementInsertionTarget & {
  elementId?: string;
};

export type FreeformElementLayout = {
  breakpoint: ElementResponsiveBreakpoint;
  elementId: string;
  h: number;
  w: number;
  x: number;
  y: number;
  zIndex?: number;
};
