"use client";

import { v4 as createId } from "uuid";
import { z } from "zod";
import { create } from "zustand";

import { createDefaultBlock } from "@/data/block-defaults";
import { createDefaultContainer, createDefaultElement } from "@/data/element-defaults";
import { projectPaymentStatusSchema, type ProjectPaymentStatus } from "@/lib/project-repository";
import {
  createDefaultSiteData,
  createNavigationFromPages,
  createSitePage,
  ensureUniquePageSlug,
  getCurrentSitePage,
  normalizeSiteData,
  pageDataToSiteData,
  sitePageToPageData,
  updateSitePage,
  type CreateSitePageInput,
} from "@/lib/site-data";
import { applyStylePackToTheme } from "@/lib/style-pack";
import { pageDataSchema, paletteSchema } from "@/schemas/page-schema";
import { siteDataSchema } from "@/schemas/site-schema";
import type {
  AboutBlockProps,
  Block,
  BlockType,
  CtaBlockProps,
  FaqBlockProps,
  FeaturesBlockProps,
  FooterBlockProps,
  HeroBlockProps,
  PageData,
  Palette,
  PortfolioBlockProps,
  PricingBlockProps,
  ServicesBlockProps,
  StylePack,
  SiteData,
  SitePage,
  ContactBlockProps,
  TestimonialsBlockProps,
  Theme,
  ContainerSectionBlockProps,
  FreeformSectionBlockProps,
  HeaderConfig,
} from "@/types/page";
import type {
  ContainerLayout,
  ContainerNode,
  ElementInsertionTarget,
  ElementNode,
  ElementNodeType,
  ElementProps,
  ElementSelection,
  ElementStyle,
  ElementTreeNode,
  HeaderSlotType,
  HeaderSlots,
  LocationRef,
} from "@/types/elements";

export const EDITOR_DRAFT_STORAGE_KEY = "ai-landing-builder-draft";
export const CUSTOM_PALETTES_STORAGE_KEY = "ai-landing-builder-custom-palettes";
export const MOCK_PAYMENT_STATUS_STORAGE_KEY = "ai-landing-builder-payment-status";

export const previewModes = ["desktop", "tablet", "mobile"] as const;

export type PreviewMode = (typeof previewModes)[number];

type PageMetaUpdate = Partial<Omit<PageData, "theme" | "blocks" | "seo">> & {
  seo?: Partial<PageData["seo"]>;
};

type PersistedEditorDraft = {
  currentPageId?: string;
  page?: PageData;
  site?: SiteData;
  selectedBlockId: string | null;
  previewMode: PreviewMode;
  paymentStatus?: ProjectPaymentStatus;
};

type CustomPaletteInput = {
  name: string;
  colors: Palette["colors"];
};

export type BlockPropsUpdate =
  | Partial<HeroBlockProps>
  | Partial<FeaturesBlockProps>
  | Partial<AboutBlockProps>
  | Partial<ServicesBlockProps>
  | Partial<PortfolioBlockProps>
  | Partial<TestimonialsBlockProps>
  | Partial<PricingBlockProps>
  | Partial<FaqBlockProps>
  | Partial<CtaBlockProps>
  | Partial<ContactBlockProps>
  | Partial<FooterBlockProps>
  | Partial<ContainerSectionBlockProps>
  | Partial<FreeformSectionBlockProps>;

type ElementUpdate = {
  props?: ElementProps;
  style?: ElementStyle;
};

type ContainerUpdate = {
  layout?: Partial<ContainerLayout>;
  style?: ElementStyle;
};

type MoveElementInput = {
  elementId: string;
  from: LocationRef;
  index?: number;
  to: LocationRef;
};

type EditorHistorySnapshot = {
  currentPageId: string;
  paymentStatus: ProjectPaymentStatus;
  previewMode: PreviewMode;
  selectedBlockId: string | null;
  selectedContainerId: string | null;
  selectedElementId: string | null;
  selectedHeaderSlot: HeaderSlotType | null;
  selectedInsertionTarget: ElementInsertionTarget | null;
  site: SiteData;
};

type EditorState = {
  page: PageData;
  site: SiteData;
  currentPageId: string;
  customPalettes: Palette[];
  historyFuture: EditorHistorySnapshot[];
  historyGroupAt: number;
  historyGroupKey: string | null;
  historyPast: EditorHistorySnapshot[];
  selectedBlockId: string | null;
  selectedContainerId: string | null;
  selectedElementId: string | null;
  selectedHeaderSlot: HeaderSlotType | null;
  selectedInsertionTarget: ElementInsertionTarget | null;
  previewMode: PreviewMode;
  paymentStatus: ProjectPaymentStatus;
  isDirty: boolean;
  setPage: (page: PageData) => void;
  setSite: (site: SiteData) => void;
  updateSiteMeta: (partial: Partial<Omit<SiteData, "pages" | "theme">>) => void;
  updatePageMeta: (partial: PageMetaUpdate) => void;
  addPage: (input: CreateSitePageInput) => void;
  removePage: (id: string) => void;
  duplicatePage: (id: string) => void;
  updatePage: (id: string, partial: Partial<Omit<SitePage, "id" | "blocks">>) => void;
  setCurrentPage: (id: string) => void;
  selectBlock: (id: string | null) => void;
  selectContainer: (id: string | null) => void;
  selectElement: (selection: ElementSelection | string | null) => void;
  setSelectedHeaderSlot: (slot: HeaderSlotType | null) => void;
  selectInsertionTarget: (target: ElementInsertionTarget | null) => void;
  clearSelection: () => void;
  findContainerLocation: (containerId: string) => LocationRef | null;
  findElementLocation: (elementId: string) => LocationRef | null;
  getSelectedLocation: () => LocationRef | null;
  addBlock: (type: BlockType) => void;
  addBlockToCurrentPage: (type: BlockType) => void;
  insertBlockAt: (type: BlockType, index?: number) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateBlock: (id: string, props: BlockPropsUpdate) => void;
  addElementToContainer: (containerId: string, type: ElementNodeType, index?: number) => void;
  addElementToLocation: (type: ElementNodeType, location: LocationRef, index?: number) => void;
  addElementToSelectedTarget: (type: ElementNodeType) => void;
  addElementToHeaderSlot: (slot: HeaderSlotType, type: ElementNodeType, index?: number) => void;
  createContainerSectionWithElement: (type: ElementNodeType, insertPosition?: number) => void;
  moveElement: (input: MoveElementInput) => void;
  moveElementToHeaderSlot: (elementId: string, targetSlot: HeaderSlotType, index?: number) => void;
  moveHeaderElement: (elementId: string, toSlot: HeaderSlotType, targetIndex?: number) => void;
  removeElement: (elementId: string) => void;
  reorderElements: (containerId: string, activeId: string, overId: string) => void;
  reorderHeaderSlotElements: (slot: HeaderSlotType, activeId: string, overId: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  resetHeaderSlots: () => void;
  updateContainer: (blockId: string, containerId: string, update: ContainerUpdate) => void;
  updateElement: (elementId: string, update: ElementUpdate) => void;
  updateHeaderConfig: (update: Partial<HeaderConfig>) => void;
  setBlockVariant: (id: string, variant: string) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  setTheme: (theme: Theme) => void;
  setPalette: (palette: Palette) => void;
  setStylePack: (stylePack: StylePack) => void;
  applyStylePack: (stylePack: StylePack) => void;
  setNavigation: (navigation: SiteData["navigation"]) => void;
  saveCustomPalette: (palette: Palette) => void;
  createCustomPalette: (input: CustomPaletteInput) => void;
  removeCustomPalette: (id: string) => void;
  loadCustomPalettes: () => void;
  setPaymentStatus: (status: ProjectPaymentStatus) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  undo: () => void;
  redo: () => void;
  resetEditor: () => void;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
};

const editorDraftSchema = z
  .object({
    currentPageId: z.string().min(1).optional(),
    page: pageDataSchema.optional(),
    site: siteDataSchema.optional(),
    selectedBlockId: z.string().min(1).nullable(),
    previewMode: z.enum(previewModes),
    paymentStatus: projectPaymentStatusSchema.optional(),
  })
  .refine((draft) => draft.page || draft.site, {
    message: "page 또는 site draft가 필요합니다.",
  })
  .strict();

const customPalettesSchema = z.array(paletteSchema);

function clonePage(page: PageData): PageData {
  return structuredClone(page);
}

function cloneBlock(block: Block, id = block.id): Block {
  const nextBlock = structuredClone(block);
  nextBlock.id = id;
  return refreshBlockElementIds(nextBlock);
}

function getInitialSelectedBlockId(page: PageData): string | null {
  return page.blocks[0]?.id ?? null;
}

function normalizeSelectedBlockId(page: PageData, selectedBlockId: string | null): string | null {
  if (selectedBlockId && page.blocks.some((block) => block.id === selectedBlockId)) {
    return selectedBlockId;
  }

  return getInitialSelectedBlockId(page);
}

function updateBlockProps(block: Block, props: BlockPropsUpdate): Block {
  switch (block.type) {
    case "hero":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<HeroBlockProps>) },
      };
    case "features":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<FeaturesBlockProps>) },
      };
    case "about":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<AboutBlockProps>) },
      };
    case "services":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<ServicesBlockProps>) },
      };
    case "portfolio":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<PortfolioBlockProps>) },
      };
    case "testimonials":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<TestimonialsBlockProps>) },
      };
    case "pricing":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<PricingBlockProps>) },
      };
    case "faq":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<FaqBlockProps>) },
      };
    case "cta":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<CtaBlockProps>) },
      };
    case "contact":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<ContactBlockProps>) },
      };
    case "footer":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<FooterBlockProps>) },
      };
    case "customSection":
    case "containerSection":
    case "gridSection":
    case "columnsSection":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<ContainerSectionBlockProps>) },
      };
    case "freeformSection":
      return {
        ...block,
        props: { ...block.props, ...(props as Partial<FreeformSectionBlockProps>) },
      };
  }
}

function moveItem(blocks: Block[], fromIndex: number, toIndex: number): Block[] {
  const nextBlocks = [...blocks];
  const [item] = nextBlocks.splice(fromIndex, 1);

  if (!item) {
    return blocks;
  }

  nextBlocks.splice(toIndex, 0, item);
  return nextBlocks;
}

function moveArrayItem<TItem>(items: TItem[], fromIndex: number, toIndex: number): TItem[] {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);

  if (!item) {
    return items;
  }

  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

function clampInsertIndex(length: number, index?: number): number {
  if (typeof index !== "number" || Number.isNaN(index)) {
    return length;
  }

  return Math.max(0, Math.min(length, index));
}

function insertArrayItem<TItem>(items: TItem[], item: TItem, index?: number): TItem[] {
  const nextItems = [...items];
  nextItems.splice(clampInsertIndex(nextItems.length, index), 0, item);

  return nextItems;
}

function refreshBlockElementIds(block: Block): Block {
  const idMap = new Map<string, string>();
  const containers = block.containers?.map((container) => refreshContainerIds(container, idMap));
  const elements = block.elements?.map((element) => refreshElementId(element, idMap));

  if (block.type === "freeformSection") {
    return {
      ...block,
      containers,
      elements,
      props: {
        ...block.props,
        layouts: block.props.layouts.map((layout) => ({
          ...layout,
          elementId: idMap.get(layout.elementId) ?? layout.elementId,
        })),
      },
    };
  }

  return {
    ...block,
    containers,
    elements,
  };
}

function refreshTreeNodeId(node: ElementTreeNode, idMap: Map<string, string>): ElementTreeNode {
  return "children" in node ? refreshContainerIds(node, idMap) : refreshElementId(node, idMap);
}

function refreshContainerIds(container: ContainerNode, idMap: Map<string, string>): ContainerNode {
  const id = createId();
  idMap.set(container.id, id);

  return {
    ...container,
    id,
    children: container.children.map((child) => refreshTreeNodeId(child, idMap)),
  };
}

function refreshElementId(element: ElementNode, idMap: Map<string, string>): ElementNode {
  const id = createId();
  idMap.set(element.id, id);

  return {
    ...element,
    id,
  };
}

function parseDraft(rawDraft: string): PersistedEditorDraft | null {
  try {
    return editorDraftSchema.parse(JSON.parse(rawDraft));
  } catch {
    return null;
  }
}

function parseCustomPalettes(rawPalettes: string): Palette[] {
  try {
    return customPalettesSchema.parse(JSON.parse(rawPalettes));
  } catch {
    return [];
  }
}

function parsePaymentStatus(rawPaymentStatus: string | null): ProjectPaymentStatus | null {
  if (!rawPaymentStatus) {
    return null;
  }

  const parsedPaymentStatus = projectPaymentStatusSchema.safeParse(rawPaymentStatus);

  return parsedPaymentStatus.success ? parsedPaymentStatus.data : null;
}

function saveCustomPalettes(palettes: Palette[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CUSTOM_PALETTES_STORAGE_KEY, JSON.stringify(palettes));
}

const initialSite = createDefaultSiteData();
const initialCurrentPage = getCurrentSitePage(initialSite, initialSite.pages[0]?.id ?? "home");
const initialPage = sitePageToPageData(initialSite, initialCurrentPage);
const HISTORY_LIMIT = 50;

function cloneSite(site: SiteData): SiteData {
  return structuredClone(site);
}

function createHistorySnapshot(state: EditorState): EditorHistorySnapshot {
  return {
    currentPageId: state.currentPageId,
    paymentStatus: state.paymentStatus,
    previewMode: state.previewMode,
    selectedBlockId: state.selectedBlockId,
    selectedContainerId: state.selectedContainerId,
    selectedElementId: state.selectedElementId,
    selectedHeaderSlot: state.selectedHeaderSlot,
    selectedInsertionTarget: state.selectedInsertionTarget
      ? structuredClone(state.selectedInsertionTarget)
      : null,
    site: cloneSite(state.site),
  };
}

function restoreHistorySnapshot(snapshot: EditorHistorySnapshot) {
  return {
    ...syncCurrentPageState(snapshot.site, snapshot.currentPageId, snapshot.selectedBlockId),
    paymentStatus: snapshot.paymentStatus,
    previewMode: snapshot.previewMode,
    selectedBlockId: snapshot.selectedBlockId,
    selectedContainerId: snapshot.selectedContainerId,
    selectedElementId: snapshot.selectedElementId,
    selectedHeaderSlot: snapshot.selectedHeaderSlot,
    selectedInsertionTarget: snapshot.selectedInsertionTarget,
  };
}

function pushHistory(state: EditorState, groupKey?: string) {
  const now = Date.now();

  if (groupKey && state.historyGroupKey === groupKey && now - state.historyGroupAt < 1000) {
    return {
      historyGroupAt: now,
    };
  }

  return {
    historyFuture: [],
    historyGroupAt: now,
    historyGroupKey: groupKey ?? null,
    historyPast: [...state.historyPast, createHistorySnapshot(state)].slice(-HISTORY_LIMIT),
  };
}

function createEditorSlice(
  siteInput: SiteData,
  currentPageId: string,
  selectedBlockId: string | null,
) {
  const site = normalizeSiteData(cloneSite(siteInput));
  const currentPage = getCurrentSitePage(site, currentPageId);
  const page = sitePageToPageData(site, currentPage);

  return {
    currentPageId: currentPage.id,
    page,
    selectedBlockId: normalizeSelectedBlockId(page, selectedBlockId),
    site,
  };
}

function syncCurrentPageState(
  site: SiteData,
  currentPageId: string,
  selectedBlockId: string | null,
) {
  return createEditorSlice(site, currentPageId, selectedBlockId);
}

function replaceCurrentPageBlocks(state: EditorState, blocks: Block[], selectedBlockId: string | null) {
  const site = updateSitePage(state.site, state.currentPageId, (sitePage) => ({
    ...sitePage,
    blocks,
  }));
  const nextSlice = syncCurrentPageState(site, state.currentPageId, selectedBlockId);
  const selectedContainerId =
    state.selectedContainerId && findContainerLocationInSite(site, state.selectedContainerId)
      ? state.selectedContainerId
      : null;
  const selectedElementId =
    state.selectedElementId && findElementLocationInSite(site, state.selectedElementId)
      ? state.selectedElementId
      : null;
  const elementLocation = selectedElementId ? findElementLocationInSite(site, selectedElementId) : null;
  const containerLocation = selectedContainerId
    ? findContainerLocationInSite(site, selectedContainerId)
    : null;

  return {
    ...nextSlice,
    ...pushHistory(state),
    selectedContainerId,
    selectedElementId,
    selectedHeaderSlot: state.selectedHeaderSlot,
    selectedInsertionTarget:
      (elementLocation && targetFromLocation(elementLocation)) ||
      (containerLocation && targetFromLocation(containerLocation)) ||
      (nextSlice.selectedBlockId ? { blockId: nextSlice.selectedBlockId, kind: "block" as const } : null),
    isDirty: true,
  };
}

function updateHeaderSlots(site: SiteData, update: (slots: HeaderSlots) => HeaderSlots): SiteData {
  const currentHeader = site.globalSections?.header;
  const slots = update({
    left: [...(currentHeader?.slots?.left ?? [])],
    center: [...(currentHeader?.slots?.center ?? [])],
    right: [...(currentHeader?.slots?.right ?? [])],
    mobile: [...(currentHeader?.slots?.mobile ?? [])],
  });

  return normalizeSiteData({
    ...site,
    globalSections: {
      ...site.globalSections,
      header: {
        enabled: currentHeader?.enabled ?? true,
        height: currentHeader?.height ?? "md",
        sticky: currentHeader?.sticky ?? true,
        transparent: currentHeader?.transparent ?? currentHeader?.variant === "transparent",
        variant: currentHeader?.variant ?? "cta-right",
        ...currentHeader,
        slots,
        elements: flattenHeaderSlots(slots),
      },
    },
  });
}

function flattenHeaderSlots(slots: HeaderSlots): ElementNode[] {
  return [
    ...(slots.left ?? []),
    ...(slots.center ?? []),
    ...(slots.right ?? []),
    ...(slots.mobile ?? []),
  ];
}

const headerSlotOrder: HeaderSlotType[] = ["left", "center", "right", "mobile"];

function getHeaderSlots(site: SiteData): HeaderSlots {
  const slots = site.globalSections?.header?.slots;

  return {
    left: [...(slots?.left ?? [])],
    center: [...(slots?.center ?? [])],
    right: [...(slots?.right ?? [])],
    mobile: [...(slots?.mobile ?? [])],
  };
}

function createDefaultHeaderSlotsForSite(site: SiteData): HeaderSlots {
  const logo = createDefaultElement("logo");
  const menu = createDefaultElement("menu");
  const login = createDefaultElement("loginButton");
  const cta = createDefaultElement("signupButton");

  return {
    left: [
      {
        ...logo,
        props: {
          ...logo.props,
          href: "/",
          label: site.brand.name,
          logoType: "text",
          text: site.brand.logoText ?? site.brand.name.slice(0, 2).toUpperCase(),
        },
      },
    ],
    center: [
      {
        ...menu,
        props: {
          ...menu.props,
          items: site.navigation.items,
        },
      },
    ],
    right: [
      {
        ...login,
        props: {
          ...login.props,
          href: "/login",
          label: "로그인",
        },
      },
      {
        ...cta,
        props: {
          ...cta.props,
          href: site.navigation.cta?.href ?? "/contact",
          label: site.navigation.cta?.label ?? "문의하기",
        },
      },
    ],
    mobile: [],
  };
}

function getFirstContainerId(block: Block): string | null {
  return block.containers?.[0]?.id ?? null;
}

function targetFromLocation(location: LocationRef): ElementInsertionTarget | null {
  switch (location.type) {
    case "container":
      return {
        blockId: location.sectionId,
        containerId: location.containerId,
        kind: "block",
      };
    case "section":
      return {
        blockId: location.sectionId,
        kind: "block",
      };
    case "headerSlot":
      return {
        kind: "headerSlot",
        slot: location.slot,
      };
    case "page":
      return null;
  }
}

function findContainerLocationInTree(
  container: ContainerNode,
  pageId: string,
  sectionId: string,
  containerId: string,
): LocationRef | null {
  if (container.id === containerId) {
    return {
      containerId,
      pageId,
      sectionId,
      type: "container",
    };
  }

  for (const child of container.children) {
    if ("children" in child) {
      const location = findContainerLocationInTree(child, pageId, sectionId, containerId);

      if (location) {
        return location;
      }
    }
  }

  return null;
}

function findContainerLocationInSite(site: SiteData, containerId: string): LocationRef | null {
  for (const page of site.pages) {
    for (const block of page.blocks) {
      for (const container of block.containers ?? []) {
        const location = findContainerLocationInTree(container, page.id, block.id, containerId);

        if (location) {
          return location;
        }
      }
    }
  }

  return null;
}

function findElementLocationInContainer(
  container: ContainerNode,
  pageId: string,
  sectionId: string,
  elementId: string,
): LocationRef | null {
  for (const child of container.children) {
    if ("children" in child) {
      const location = findElementLocationInContainer(child, pageId, sectionId, elementId);

      if (location) {
        return location;
      }

      continue;
    }

    if (child.id === elementId) {
      return {
        containerId: container.id,
        pageId,
        sectionId,
        type: "container",
      };
    }
  }

  return null;
}

function findElementLocationInBlock(block: Block, pageId: string, elementId: string): LocationRef | null {
  if ((block.elements ?? []).some((element) => element.id === elementId)) {
    return {
      pageId,
      sectionId: block.id,
      type: "section",
    };
  }

  for (const container of block.containers ?? []) {
    const location = findElementLocationInContainer(container, pageId, block.id, elementId);

    if (location) {
      return location;
    }
  }

  return null;
}

function findElementLocationInSite(site: SiteData, elementId: string): LocationRef | null {
  const slots = getHeaderSlots(site);

  for (const slot of headerSlotOrder) {
    if ((slots[slot] ?? []).some((element) => element.id === elementId)) {
      return {
        slot,
        type: "headerSlot",
      };
    }
  }

  for (const page of site.pages) {
    for (const block of page.blocks) {
      const location = findElementLocationInBlock(block, page.id, elementId);

      if (location) {
        return location;
      }
    }
  }

  return null;
}

function findElementInTree(node: ElementTreeNode, elementId: string): ElementNode | null {
  if (!("children" in node)) {
    return node.id === elementId ? node : null;
  }

  for (const child of node.children) {
    const element = findElementInTree(child, elementId);

    if (element) {
      return element;
    }
  }

  return null;
}

function findElementInSite(site: SiteData, elementId: string): ElementNode | null {
  const slots = getHeaderSlots(site);

  for (const slot of headerSlotOrder) {
    const element = (slots[slot] ?? []).find((slotElement) => slotElement.id === elementId);

    if (element) {
      return element;
    }
  }

  for (const page of site.pages) {
    for (const block of page.blocks) {
      const rootElement = (block.elements ?? []).find((element) => element.id === elementId);

      if (rootElement) {
        return rootElement;
      }

      for (const container of block.containers ?? []) {
        const element = findElementInTree(container, elementId);

        if (element) {
          return element;
        }
      }
    }
  }

  return null;
}

function updateElementNode(element: ElementNode, update: ElementUpdate): ElementNode {
  return {
    ...element,
    props: update.props ? { ...(element.props ?? {}), ...update.props } : element.props,
    style: update.style ? { ...(element.style ?? {}), ...update.style } : element.style,
  };
}

function updateElementInTree(node: ElementTreeNode, elementId: string, update: ElementUpdate): ElementTreeNode {
  if ("children" in node) {
    return {
      ...node,
      children: node.children.map((child) => updateElementInTree(child, elementId, update)),
    };
  }

  return node.id === elementId ? updateElementNode(node, update) : node;
}

function updateElementInBlock(block: Block, elementId: string, update: ElementUpdate): Block {
  return {
    ...block,
    elements: block.elements?.map((element) =>
      element.id === elementId ? updateElementNode(element, update) : element,
    ),
    containers: block.containers?.map((container) =>
      updateElementInTree(container, elementId, update) as ContainerNode,
    ),
  } as Block;
}

function removeElementFromTree(node: ElementTreeNode, elementId: string): ElementTreeNode | null {
  if (!("children" in node)) {
    return node.id === elementId ? null : node;
  }

  return {
    ...node,
    children: node.children.flatMap((child) => {
      const nextChild = removeElementFromTree(child, elementId);

      return nextChild ? [nextChild] : [];
    }),
  };
}

function removeElementFromBlock(block: Block, elementId: string): Block {
  return {
    ...block,
    elements: block.elements?.filter((element) => element.id !== elementId),
    containers: block.containers?.flatMap((container) => {
      const nextContainer = removeElementFromTree(container, elementId);

      return nextContainer && "children" in nextContainer ? [nextContainer] : [];
    }),
  } as Block;
}

function insertElementIntoContainer(
  container: ContainerNode,
  containerId: string,
  element: ElementNode,
  index?: number,
): ContainerNode {
  if (container.id === containerId) {
    return {
      ...container,
      children: insertArrayItem(container.children, element, index),
    };
  }

  return {
    ...container,
    children: container.children.map((child) =>
      "children" in child ? insertElementIntoContainer(child, containerId, element, index) : child,
    ),
  };
}

function updateContainerInTree(
  container: ContainerNode,
  containerId: string,
  update: ContainerUpdate,
): ContainerNode {
  if (container.id === containerId) {
    return {
      ...container,
      layout: update.layout ? { ...(container.layout ?? {}), ...update.layout } : container.layout,
      style: update.style ? { ...(container.style ?? {}), ...update.style } : container.style,
    };
  }

  return {
    ...container,
    children: container.children.map((child) =>
      "children" in child ? updateContainerInTree(child, containerId, update) : child,
    ),
  };
}

function reorderChildren(children: ElementTreeNode[], activeId: string, overId: string): ElementTreeNode[] {
  const activeIndex = children.findIndex((child) => child.id === activeId);
  const overIndex = children.findIndex((child) => child.id === overId);

  if (activeIndex === -1 || overIndex === -1) {
    return children;
  }

  return moveArrayItem(children, activeIndex, overIndex);
}

function reorderElementsInContainer(
  container: ContainerNode,
  containerId: string,
  activeId: string,
  overId: string,
): ContainerNode {
  if (container.id === containerId) {
    return {
      ...container,
      children: reorderChildren(container.children, activeId, overId),
    };
  }

  return {
    ...container,
    children: container.children.map((child) =>
      "children" in child ? reorderElementsInContainer(child, containerId, activeId, overId) : child,
    ),
  };
}

function removeElementFromHeaderSlots(slots: HeaderSlots, elementId: string): HeaderSlots {
  return {
    left: (slots.left ?? []).filter((element) => element.id !== elementId),
    center: (slots.center ?? []).filter((element) => element.id !== elementId),
    right: (slots.right ?? []).filter((element) => element.id !== elementId),
    mobile: (slots.mobile ?? []).filter((element) => element.id !== elementId),
  };
}

function removeElementFromEveryPage(site: SiteData, elementId: string): SiteData {
  return normalizeSiteData({
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) => removeElementFromBlock(block, elementId)),
    })),
  });
}

function insertElementIntoSiteContainer(
  site: SiteData,
  location: Extract<LocationRef, { type: "container" }>,
  element: ElementNode,
  index?: number,
): SiteData {
  return updateSitePage(site, location.pageId, (sitePage) => ({
    ...sitePage,
    blocks: sitePage.blocks.map((block) =>
      block.id === location.sectionId
        ? ({
            ...block,
            containers: block.containers?.map((container) =>
              insertElementIntoContainer(container, location.containerId, element, index),
            ),
          } as Block)
        : block,
    ),
  }));
}

export const useEditorStore = create<EditorState>((set, get) => ({
  page: clonePage(initialPage),
  site: cloneSite(initialSite),
  currentPageId: initialCurrentPage.id,
  customPalettes: [],
  historyFuture: [],
  historyGroupAt: 0,
  historyGroupKey: null,
  historyPast: [],
  selectedBlockId: getInitialSelectedBlockId(initialPage),
  selectedContainerId: null,
  selectedElementId: null,
  selectedHeaderSlot: null,
  selectedInsertionTarget: getInitialSelectedBlockId(initialPage)
    ? { blockId: getInitialSelectedBlockId(initialPage) ?? "", kind: "block" }
    : null,
  previewMode: "desktop",
  paymentStatus: "NONE",
  isDirty: false,
  setPage: (page) =>
    set((state) => ({
      ...syncCurrentPageState(pageDataToSiteData(page), page.id ?? "home", getInitialSelectedBlockId(page)),
      ...pushHistory(state),
      selectedContainerId: null,
      selectedElementId: null,
      selectedHeaderSlot: null,
      selectedInsertionTarget: getInitialSelectedBlockId(page)
        ? { blockId: getInitialSelectedBlockId(page) ?? "", kind: "block" }
        : null,
      isDirty: true,
    })),
  setSite: (site) =>
    set(() => {
      const nextSlice = syncCurrentPageState(site, site.pages[0]?.id ?? "home", null);

      return {
        ...nextSlice,
        ...pushHistory(state),
        selectedContainerId: null,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: nextSlice.selectedBlockId
          ? { blockId: nextSlice.selectedBlockId, kind: "block" }
          : null,
        isDirty: true,
      };
    }),
  updateSiteMeta: (partial) =>
    set((state) => {
      const site = normalizeSiteData({
        ...state.site,
        ...partial,
        brand: partial.brand ? { ...state.site.brand, ...partial.brand } : state.site.brand,
        navigation: partial.navigation
          ? { ...state.site.navigation, ...partial.navigation }
          : state.site.navigation,
        globalSections: partial.globalSections
          ? { ...state.site.globalSections, ...partial.globalSections }
          : state.site.globalSections,
        seo: partial.seo ? { ...state.site.seo, ...partial.seo } : state.site.seo,
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "site-meta"),
        isDirty: true,
      };
    }),
  updatePageMeta: (partial) =>
    set((state) => {
      const { seo, ...rest } = partial;
      const site = updateSitePage(state.site, state.currentPageId, (sitePage) => {
        const nextSlug =
          typeof rest.slug === "string"
            ? ensureUniquePageSlug(rest.slug, state.site.pages, sitePage.id)
            : sitePage.slug;

        return {
          ...sitePage,
          title: rest.title ?? sitePage.title,
          slug: nextSlug,
          seo: seo ? { ...(sitePage.seo ?? state.page.seo), ...seo } : sitePage.seo,
        };
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "page-meta"),
        isDirty: true,
      };
    }),
  addPage: (input) =>
    set((state) => {
      const page = createSitePage(input);
      const nextPage = {
        ...page,
        slug: ensureUniquePageSlug(page.slug, state.site.pages),
      };
      const pages = [...state.site.pages, nextPage];
      const site = normalizeSiteData({
        ...state.site,
        navigation: {
          ...state.site.navigation,
          items: createNavigationFromPages(pages),
        },
        pages,
      });

      return {
        ...syncCurrentPageState(site, nextPage.id, getInitialSelectedBlockId(sitePageToPageData(site, nextPage))),
        ...pushHistory(state),
        selectedContainerId: null,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: getInitialSelectedBlockId(sitePageToPageData(site, nextPage))
          ? { blockId: getInitialSelectedBlockId(sitePageToPageData(site, nextPage)) ?? "", kind: "block" }
          : null,
        isDirty: true,
      };
    }),
  removePage: (id) =>
    set((state) => {
      const targetPage = state.site.pages.find((page) => page.id === id);

      if (!targetPage || targetPage.type === "home" || state.site.pages.length <= 1) {
        return state;
      }

      const pages = state.site.pages.filter((page) => page.id !== id);
      const fallbackPageId = state.currentPageId === id ? pages[0]?.id ?? "home" : state.currentPageId;
      const site = normalizeSiteData({
        ...state.site,
        navigation: {
          ...state.site.navigation,
          items: createNavigationFromPages(pages),
        },
        pages,
      });

      return {
        ...syncCurrentPageState(site, fallbackPageId, state.selectedBlockId),
        ...pushHistory(state),
        selectedContainerId: null,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: null,
        isDirty: true,
      };
    }),
  duplicatePage: (id) =>
    set((state) => {
      const pageIndex = state.site.pages.findIndex((page) => page.id === id);

      if (pageIndex === -1) {
        return state;
      }

      const sourcePage = state.site.pages[pageIndex];
      const duplicatedPage: SitePage = {
        ...structuredClone(sourcePage),
        id: createId(),
        title: `${sourcePage.title} Copy`,
        slug: ensureUniquePageSlug(`${sourcePage.slug}-copy`, state.site.pages),
        type: sourcePage.type === "home" ? "custom" : sourcePage.type,
        blocks: sourcePage.blocks.map((block) => cloneBlock(block, createId())),
      };
      const pages = [...state.site.pages];
      pages.splice(pageIndex + 1, 0, duplicatedPage);
      const site = normalizeSiteData({
        ...state.site,
        navigation: {
          ...state.site.navigation,
          items: createNavigationFromPages(pages),
        },
        pages,
      });

      return {
        ...syncCurrentPageState(site, duplicatedPage.id, getInitialSelectedBlockId(sitePageToPageData(site, duplicatedPage))),
        ...pushHistory(state),
        selectedContainerId: null,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: getInitialSelectedBlockId(sitePageToPageData(site, duplicatedPage))
          ? {
              blockId: getInitialSelectedBlockId(sitePageToPageData(site, duplicatedPage)) ?? "",
              kind: "block",
            }
          : null,
        isDirty: true,
      };
    }),
  updatePage: (id, partial) =>
    set((state) => {
      const site = updateSitePage(state.site, id, (sitePage) => ({
        ...sitePage,
        ...partial,
        slug:
          typeof partial.slug === "string"
            ? ensureUniquePageSlug(partial.slug, state.site.pages, sitePage.id)
            : sitePage.slug,
        seo: partial.seo ? { ...(sitePage.seo ?? { title: sitePage.title, description: "" }), ...partial.seo } : sitePage.seo,
      }));
      const pages = site.pages;
      const siteWithNavigation = normalizeSiteData({
        ...site,
        navigation: {
          ...site.navigation,
          items: createNavigationFromPages(pages),
        },
      });

      return {
        ...syncCurrentPageState(siteWithNavigation, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "page-update"),
        isDirty: true,
      };
    }),
  setCurrentPage: (id) =>
    set((state) => ({
      ...syncCurrentPageState(state.site, id, null),
      selectedContainerId: null,
      selectedElementId: null,
      selectedHeaderSlot: null,
      selectedInsertionTarget: null,
    })),
  selectBlock: (id) =>
    set((state) => {
      const selectedBlockId = id && state.page.blocks.some((block) => block.id === id) ? id : null;

      return {
        selectedBlockId,
        selectedContainerId: null,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: selectedBlockId ? { blockId: selectedBlockId, kind: "block" } : null,
      };
    }),
  selectContainer: (id) =>
    set((state) => {
      if (!id) {
        const target = state.selectedBlockId ? { blockId: state.selectedBlockId, kind: "block" as const } : null;

        return {
          selectedContainerId: null,
          selectedElementId: null,
          selectedHeaderSlot: null,
          selectedInsertionTarget: target,
        };
      }

      const location = findContainerLocationInSite(state.site, id);

      if (!location || location.type !== "container") {
        return state;
      }

      return {
        selectedBlockId: location.sectionId,
        selectedContainerId: id,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: {
          blockId: location.sectionId,
          containerId: id,
          kind: "block",
        },
      };
    }),
  selectElement: (selection) =>
    set((state) => {
      if (!selection) {
        const currentLocation = state.selectedContainerId
          ? findContainerLocationInSite(state.site, state.selectedContainerId)
          : state.selectedHeaderSlot
            ? { slot: state.selectedHeaderSlot, type: "headerSlot" as const }
            : state.selectedBlockId
              ? { pageId: state.currentPageId, sectionId: state.selectedBlockId, type: "section" as const }
              : null;

        return {
          selectedElementId: null,
          selectedInsertionTarget: currentLocation ? targetFromLocation(currentLocation) : null,
        };
      }

      const elementId = typeof selection === "string" ? selection : selection.elementId;

      if (!elementId) {
        const target =
          typeof selection === "string"
            ? null
            : selection.kind === "headerSlot"
              ? { kind: "headerSlot" as const, slot: selection.slot }
              : { blockId: selection.blockId, containerId: selection.containerId, kind: "block" as const };

        return {
          selectedElementId: null,
          selectedInsertionTarget: target,
        };
      }

      const location = findElementLocationInSite(state.site, elementId);
      const fallbackTarget =
        typeof selection === "string"
          ? null
          : selection.kind === "headerSlot"
            ? { kind: "headerSlot" as const, slot: selection.slot }
            : { blockId: selection.blockId, containerId: selection.containerId, kind: "block" as const };
      const target = location ? targetFromLocation(location) : fallbackTarget;

      if (location?.type === "headerSlot") {
        return {
          selectedBlockId: null,
          selectedContainerId: null,
          selectedElementId: elementId,
          selectedHeaderSlot: location.slot,
          selectedInsertionTarget: target,
        };
      }

      if (location?.type === "container") {
        return {
          selectedBlockId: location.sectionId,
          selectedContainerId: location.containerId,
          selectedElementId: elementId,
          selectedHeaderSlot: null,
          selectedInsertionTarget: target,
        };
      }

      if (location?.type === "section") {
        return {
          selectedBlockId: location.sectionId,
          selectedContainerId: null,
          selectedElementId: elementId,
          selectedHeaderSlot: null,
          selectedInsertionTarget: target,
        };
      }

      return {
        selectedElementId: elementId,
        selectedInsertionTarget: target,
      };
    }),
  setSelectedHeaderSlot: (slot) =>
    set({
      selectedBlockId: null,
      selectedContainerId: null,
      selectedElementId: null,
      selectedHeaderSlot: slot,
      selectedInsertionTarget: slot ? { kind: "headerSlot", slot } : null,
    }),
  selectInsertionTarget: (target) =>
    set(() => {
      if (!target) {
        return {
          selectedBlockId: null,
          selectedContainerId: null,
          selectedElementId: null,
          selectedHeaderSlot: null,
          selectedInsertionTarget: null,
        };
      }

      if (target.kind === "headerSlot") {
        return {
          selectedBlockId: null,
          selectedContainerId: null,
          selectedElementId: null,
          selectedHeaderSlot: target.slot,
          selectedInsertionTarget: target,
        };
      }

      return {
        selectedBlockId: target.blockId,
        selectedContainerId: target.containerId ?? null,
        selectedElementId: null,
        selectedHeaderSlot: null,
        selectedInsertionTarget: target,
      };
    }),
  clearSelection: () =>
    set({
      selectedBlockId: null,
      selectedContainerId: null,
      selectedElementId: null,
      selectedHeaderSlot: null,
      selectedInsertionTarget: null,
    }),
  findContainerLocation: (containerId) => findContainerLocationInSite(get().site, containerId),
  findElementLocation: (elementId) => findElementLocationInSite(get().site, elementId),
  getSelectedLocation: () => {
    const state = get();

    if (state.selectedElementId) {
      const location = findElementLocationInSite(state.site, state.selectedElementId);

      if (location) {
        return location;
      }
    }

    if (state.selectedContainerId) {
      const location = findContainerLocationInSite(state.site, state.selectedContainerId);

      if (location) {
        return location;
      }
    }

    if (state.selectedBlockId) {
      return {
        pageId: state.currentPageId,
        sectionId: state.selectedBlockId,
        type: "section",
      };
    }

    if (state.selectedHeaderSlot) {
      return {
        slot: state.selectedHeaderSlot,
        type: "headerSlot",
      };
    }

    return {
      pageId: state.currentPageId,
      type: "page",
    };
  },
  addBlock: (type) => get().addBlockToCurrentPage(type),
  addBlockToCurrentPage: (type) =>
    set((state) => {
      const block = createDefaultBlock(type);

      return replaceCurrentPageBlocks(state, [...state.page.blocks, block], block.id);
    }),
  insertBlockAt: (type, index) =>
    set((state) => {
      const block = createDefaultBlock(type);

      return replaceCurrentPageBlocks(state, insertArrayItem(state.page.blocks, block, index), block.id);
    }),
  removeBlock: (id) =>
    set((state) => {
      const blocks = state.page.blocks.filter((block) => block.id !== id);

      return replaceCurrentPageBlocks(state, blocks, state.selectedBlockId);
    }),
  duplicateBlock: (id) =>
    set((state) => {
      const blockIndex = state.page.blocks.findIndex((block) => block.id === id);

      if (blockIndex === -1) {
        return state;
      }

      const duplicatedBlock = cloneBlock(state.page.blocks[blockIndex], createId());
      const blocks = [...state.page.blocks];
      blocks.splice(blockIndex + 1, 0, duplicatedBlock);

      return replaceCurrentPageBlocks(state, blocks, duplicatedBlock.id);
    }),
  updateBlock: (id, props) =>
    set((state) =>
      replaceCurrentPageBlocks(
        state,
        state.page.blocks.map((block) => (block.id === id ? updateBlockProps(block, props) : block)),
        id,
      ),
    ),
  addElementToContainer: (containerId, type, index) =>
    set((state) => {
      const location = findContainerLocationInSite(state.site, containerId);

      if (!location || location.type !== "container") {
        return state;
      }

      const element = createDefaultElement(type);
      const site = insertElementIntoSiteContainer(state.site, location, element, index);

      return {
        ...syncCurrentPageState(site, state.currentPageId, location.sectionId),
        ...pushHistory(state),
        selectedContainerId: containerId,
        selectedElementId: element.id,
        selectedHeaderSlot: null,
        selectedInsertionTarget: {
          blockId: location.sectionId,
          containerId,
          kind: "block",
        },
        isDirty: true,
      };
    }),
  addElementToLocation: (type, location, index) => {
    if (location.type === "headerSlot") {
      get().addElementToHeaderSlot(location.slot, type, index);
      return;
    }

    if (location.type === "container") {
      get().addElementToContainer(location.containerId, type, index);
      return;
    }

    if (location.type === "section") {
      const page = get().site.pages.find((sitePage) => sitePage.id === location.pageId);
      const block = page?.blocks.find((pageBlock) => pageBlock.id === location.sectionId);
      const containerId = block ? getFirstContainerId(block) : null;

      if (containerId) {
        get().addElementToContainer(containerId, type, index);
        return;
      }

      get().createContainerSectionWithElement(type);
      return;
    }

    get().createContainerSectionWithElement(type, index);
  },
  addElementToSelectedTarget: (type) => {
    const state = get();

    if (state.selectedHeaderSlot) {
      state.addElementToHeaderSlot(state.selectedHeaderSlot, type);
      return;
    }

    if (state.selectedContainerId) {
      state.addElementToContainer(state.selectedContainerId, type);
      return;
    }

    if (state.selectedBlockId) {
      const block = state.page.blocks.find((pageBlock) => pageBlock.id === state.selectedBlockId);
      const containerId = block ? getFirstContainerId(block) : null;

      if (containerId) {
        state.addElementToContainer(containerId, type);
        return;
      }
    }

    const location = state.getSelectedLocation();

    if (location?.type === "headerSlot" || location?.type === "container") {
      state.addElementToLocation(type, location);
      return;
    }

    if (location?.type === "section") {
      const page = state.site.pages.find((sitePage) => sitePage.id === location.pageId);
      const block = page?.blocks.find((pageBlock) => pageBlock.id === location.sectionId);
      const containerId = block ? getFirstContainerId(block) : null;

      if (containerId) {
        state.addElementToContainer(containerId, type);
        return;
      }
    }

    get().createContainerSectionWithElement(type);
  },
  addElementToHeaderSlot: (slot, type, index) =>
    set((state) => {
      const element = createDefaultElement(type);
      const site = updateHeaderSlots(state.site, (slots) => ({
        ...slots,
        [slot]: insertArrayItem(slots[slot] ?? [], element, index),
      }));

      return {
        ...syncCurrentPageState(site, state.currentPageId, null),
        ...pushHistory(state),
        selectedBlockId: null,
        selectedContainerId: null,
        selectedElementId: element.id,
        selectedHeaderSlot: slot,
        selectedInsertionTarget: { kind: "headerSlot", slot },
        isDirty: true,
      };
    }),
  createContainerSectionWithElement: (type, insertPosition) =>
    set((state) => {
      const element = createDefaultElement(type);
      const block = createDefaultBlock("containerSection") as Extract<Block, { type: "containerSection" }>;
      const baseContainer = block.containers?.[0] ?? createDefaultContainer("stack");
      const container: ContainerNode = {
        ...baseContainer,
        children: [element],
      };
      const nextBlock: Extract<Block, { type: "containerSection" }> = {
        ...block,
        containers: [container],
        props: {
          ...block.props,
          subtitle: "",
          title: "새 섹션",
        },
        variant: "stack",
      };
      const blocks = insertArrayItem(state.page.blocks, nextBlock, insertPosition);

      return {
        ...replaceCurrentPageBlocks(state, blocks, nextBlock.id),
        selectedContainerId: container.id,
        selectedElementId: element.id,
        selectedHeaderSlot: null,
        selectedInsertionTarget: {
          blockId: nextBlock.id,
          containerId: container.id,
          kind: "block",
        },
      };
    }),
  moveElement: ({ elementId, index, to }) =>
    set((state) => {
      const movingElement = findElementInSite(state.site, elementId);

      if (!movingElement || (to.type !== "container" && to.type !== "headerSlot")) {
        return state;
      }

      const siteWithoutHeaderElement = updateHeaderSlots(state.site, (slots) =>
        removeElementFromHeaderSlots(slots, elementId),
      );
      const siteWithoutElement = removeElementFromEveryPage(siteWithoutHeaderElement, elementId);

      if (to.type === "headerSlot") {
        const site = updateHeaderSlots(siteWithoutElement, (slots) => ({
          ...slots,
          [to.slot]: insertArrayItem(slots[to.slot] ?? [], movingElement, index),
        }));

      return {
        ...syncCurrentPageState(site, state.currentPageId, null),
        ...pushHistory(state),
        selectedBlockId: null,
          selectedContainerId: null,
          selectedElementId: elementId,
          selectedHeaderSlot: to.slot,
          selectedInsertionTarget: { kind: "headerSlot", slot: to.slot },
          isDirty: true,
        };
      }

      const destination = findContainerLocationInSite(siteWithoutElement, to.containerId);

      if (!destination || destination.type !== "container") {
        return state;
      }

      const site = insertElementIntoSiteContainer(siteWithoutElement, destination, movingElement, index);

      return {
        ...syncCurrentPageState(site, state.currentPageId, destination.sectionId),
        ...pushHistory(state),
        selectedContainerId: destination.containerId,
        selectedElementId: elementId,
        selectedHeaderSlot: null,
        selectedInsertionTarget: {
          blockId: destination.sectionId,
          containerId: destination.containerId,
          kind: "block",
        },
        isDirty: true,
      };
    }),
  moveElementToHeaderSlot: (elementId, targetSlot, index) =>
    get().moveHeaderElement(elementId, targetSlot, index),
  moveHeaderElement: (elementId, toSlot, targetIndex) =>
    set((state) => {
      const site = updateHeaderSlots(state.site, (slots) => {
        let movingElement: ElementNode | null = null;
        const withoutElement = (Object.keys(slots) as HeaderSlotType[]).reduce<HeaderSlots>(
          (nextSlots, slot) => {
            const slotElements = slots[slot] ?? [];

            return {
              ...nextSlots,
              [slot]: slotElements.filter((element) => {
                if (element.id === elementId) {
                  movingElement = element;
                  return false;
                }

                return true;
              }),
            };
          },
          { left: [], center: [], right: [], mobile: [] },
        );

        if (!movingElement) {
          return slots;
        }

        const destination = [...(withoutElement[toSlot] ?? [])];
        const nextIndex =
          typeof targetIndex === "number"
            ? Math.max(0, Math.min(destination.length, targetIndex))
            : destination.length;
        destination.splice(nextIndex, 0, movingElement);

        return {
          ...withoutElement,
          [toSlot]: destination,
        };
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state),
        selectedBlockId: null,
        selectedContainerId: null,
        selectedElementId: elementId,
        selectedHeaderSlot: toSlot,
        selectedInsertionTarget: { kind: "headerSlot", slot: toSlot },
        isDirty: true,
      };
    }),
  reorderHeaderSlotElements: (slot, activeId, overId) =>
    set((state) => {
      if (activeId === overId) {
        return state;
      }

      const site = updateHeaderSlots(state.site, (slots) => {
        const elements = slots[slot] ?? [];
        const activeIndex = elements.findIndex((element) => element.id === activeId);
        const overIndex = elements.findIndex((element) => element.id === overId);

        if (activeIndex === -1 || overIndex === -1) {
          return slots;
        }

        return {
          ...slots,
          [slot]: moveArrayItem(elements, activeIndex, overIndex),
        };
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, null),
        ...pushHistory(state),
        selectedBlockId: null,
        selectedContainerId: null,
        selectedElementId: activeId,
        selectedHeaderSlot: slot,
        selectedInsertionTarget: { kind: "headerSlot", slot },
        isDirty: true,
      };
    }),
  removeElement: (elementId) =>
    set((state) => {
      const siteWithHeader = updateHeaderSlots(state.site, (slots) => ({
        left: (slots.left ?? []).filter((element) => element.id !== elementId),
        center: (slots.center ?? []).filter((element) => element.id !== elementId),
        right: (slots.right ?? []).filter((element) => element.id !== elementId),
        mobile: (slots.mobile ?? []).filter((element) => element.id !== elementId),
      }));
      const site = updateSitePage(siteWithHeader, state.currentPageId, (sitePage) => ({
        ...sitePage,
        blocks: sitePage.blocks.map((block) => removeElementFromBlock(block, elementId)),
      }));

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state),
        selectedContainerId:
          state.selectedContainerId && findContainerLocationInSite(site, state.selectedContainerId)
            ? state.selectedContainerId
            : null,
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
        selectedHeaderSlot: state.selectedElementId === elementId ? null : state.selectedHeaderSlot,
        isDirty: true,
      };
    }),
  reorderElements: (containerId, activeId, overId) =>
    set((state) => {
      if (activeId === overId) {
        return state;
      }

      const location = findContainerLocationInSite(state.site, containerId);

      if (!location || location.type !== "container") {
        return state;
      }

      const blocks = state.page.blocks.map((block) => {
        if (block.id !== location.sectionId) {
          return block;
        }

        return {
          ...block,
          containers: block.containers?.map((container) =>
            reorderElementsInContainer(container, containerId, activeId, overId),
          ),
        } as Block;
      });

      return {
        ...replaceCurrentPageBlocks(state, blocks, location.sectionId),
        selectedContainerId: containerId,
        selectedElementId: activeId,
        selectedHeaderSlot: null,
        selectedInsertionTarget: {
          blockId: location.sectionId,
          containerId,
          kind: "block",
        },
      };
    }),
  updateContainer: (blockId, containerId, update) =>
    set((state) => {
      const blocks = state.page.blocks.map((block) =>
        block.id === blockId
          ? ({
              ...block,
              containers: block.containers?.map((container) =>
                updateContainerInTree(container, containerId, update),
              ),
            } as Block)
          : block,
      );

      return replaceCurrentPageBlocks(state, blocks, blockId);
    }),
  updateElement: (elementId, update) =>
    set((state) => {
      const siteWithHeader = updateHeaderSlots(state.site, (slots) => ({
        left: (slots.left ?? []).map((element) =>
          element.id === elementId ? updateElementNode(element, update) : element,
        ),
        center: (slots.center ?? []).map((element) =>
          element.id === elementId ? updateElementNode(element, update) : element,
        ),
        right: (slots.right ?? []).map((element) =>
          element.id === elementId ? updateElementNode(element, update) : element,
        ),
        mobile: (slots.mobile ?? []).map((element) =>
          element.id === elementId ? updateElementNode(element, update) : element,
        ),
      }));
      const site = updateSitePage(siteWithHeader, state.currentPageId, (sitePage) => ({
        ...sitePage,
        blocks: sitePage.blocks.map((block) => updateElementInBlock(block, elementId, update)),
      }));

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, `element:${elementId}`),
        selectedElementId: elementId,
        isDirty: true,
      };
    }),
  updateHeaderConfig: (update) =>
    set((state) => {
      const currentHeader = state.site.globalSections?.header;
      const nextSlots = update.slots ?? currentHeader?.slots;
      const site = normalizeSiteData({
        ...state.site,
        globalSections: {
          ...state.site.globalSections,
          header: {
            enabled: currentHeader?.enabled ?? true,
            height: currentHeader?.height ?? "md",
            sticky: currentHeader?.sticky ?? true,
            transparent: currentHeader?.transparent ?? currentHeader?.variant === "transparent",
            variant: currentHeader?.variant ?? "cta-right",
            ...currentHeader,
            ...update,
            elements: nextSlots ? flattenHeaderSlots(nextSlots) : currentHeader?.elements,
          },
        },
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "header-config"),
        isDirty: true,
      };
    }),
  setBlockVariant: (id, variant) =>
    set((state) =>
      replaceCurrentPageBlocks(
        state,
        state.page.blocks.map((block) => (block.id === id ? ({ ...block, variant } as Block) : block)),
        id,
      ),
    ),
  moveBlock: (id, direction) =>
    set((state) => {
      const currentIndex = state.page.blocks.findIndex((block) => block.id === id);

      if (currentIndex === -1) {
        return state;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= state.page.blocks.length) {
        return state;
      }

      return replaceCurrentPageBlocks(state, moveItem(state.page.blocks, currentIndex, targetIndex), id);
    }),
  reorderBlocks: (activeId, overId) =>
    set((state) => {
      if (activeId === overId) {
        return state;
      }

      const activeIndex = state.page.blocks.findIndex((block) => block.id === activeId);
      const overIndex = state.page.blocks.findIndex((block) => block.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        return state;
      }

      return replaceCurrentPageBlocks(state, moveItem(state.page.blocks, activeIndex, overIndex), activeId);
    }),
  reorderSections: (activeId, overId) => get().reorderBlocks(activeId, overId),
  resetHeaderSlots: () =>
    set((state) => {
      const slots = createDefaultHeaderSlotsForSite(state.site);
      const site = updateHeaderSlots(state.site, () => slots);

      return {
        ...syncCurrentPageState(site, state.currentPageId, null),
        ...pushHistory(state),
        selectedBlockId: null,
        selectedContainerId: null,
        selectedElementId: slots.left?.[0]?.id ?? null,
        selectedHeaderSlot: "left",
        selectedInsertionTarget: { kind: "headerSlot", slot: "left" },
        isDirty: true,
      };
    }),
  setTheme: (theme) =>
    set((state) => {
      const site = normalizeSiteData({
        ...state.site,
        theme,
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "theme"),
        isDirty: true,
      };
    }),
  setPalette: (palette) =>
    set((state) => {
      const site = normalizeSiteData({
        ...state.site,
        theme: {
          ...state.site.theme,
          paletteId: palette.id,
          colors: palette.colors,
          stylePackId: undefined,
        },
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "palette"),
        isDirty: true,
      };
    }),
  setStylePack: (stylePack) =>
    set((state) => {
      const site = normalizeSiteData({
        ...state.site,
        theme: applyStylePackToTheme(state.site.theme, stylePack),
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state),
        isDirty: true,
      };
    }),
  applyStylePack: (stylePack) => get().setStylePack(stylePack),
  setNavigation: (navigation) =>
    set((state) => {
      const site = normalizeSiteData({
        ...state.site,
        navigation,
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        ...pushHistory(state, "navigation"),
        isDirty: true,
      };
    }),
  saveCustomPalette: (palette) =>
    set((state) => {
      const customPalette: Palette = {
        ...palette,
        id: palette.id.startsWith("custom-") ? palette.id : `custom-${palette.id}`,
        isCustom: true,
      };
      const customPalettes = [
        ...state.customPalettes.filter((item) => item.id !== customPalette.id),
        customPalette,
      ];

      saveCustomPalettes(customPalettes);

      const site = normalizeSiteData({
        ...state.site,
        theme: {
          ...state.site.theme,
          paletteId: customPalette.id,
          colors: customPalette.colors,
          stylePackId: undefined,
        },
      });

      return {
        customPalettes,
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        isDirty: true,
      };
    }),
  createCustomPalette: ({ name, colors }) =>
    set((state) => {
      const palette: Palette = {
        id: `custom-${createId()}`,
        name: name.trim() || "Custom Palette",
        description: "사용자가 직접 저장한 커스텀 팔레트",
        moodTags: ["custom"],
        colors,
        isCustom: true,
      };
      const customPalettes = [...state.customPalettes, palette];

      saveCustomPalettes(customPalettes);

      const site = normalizeSiteData({
        ...state.site,
        theme: {
          ...state.site.theme,
          paletteId: palette.id,
          colors: palette.colors,
          stylePackId: undefined,
        },
      });

      return {
        customPalettes,
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        isDirty: true,
      };
    }),
  removeCustomPalette: (id) =>
    set((state) => {
      const customPalettes = state.customPalettes.filter((palette) => palette.id !== id);
      const isCurrentPalette = state.page.theme.paletteId === id;

      saveCustomPalettes(customPalettes);
      const site = isCurrentPalette
        ? normalizeSiteData({
            ...state.site,
            theme: {
              ...state.site.theme,
              paletteId: undefined,
            },
          })
        : state.site;

      return {
        customPalettes,
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        isDirty: isCurrentPalette ? true : state.isDirty,
      };
    }),
  loadCustomPalettes: () => {
    if (typeof window === "undefined") {
      return;
    }

    const rawPalettes = window.localStorage.getItem(CUSTOM_PALETTES_STORAGE_KEY);

    if (!rawPalettes) {
      return;
    }

    set({
      customPalettes: parseCustomPalettes(rawPalettes),
    });
  },
  setPaymentStatus: (status) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MOCK_PAYMENT_STATUS_STORAGE_KEY, status);
    }

    set({
      paymentStatus: status,
    });
  },
  setPreviewMode: (mode) =>
    set({
      previewMode: mode,
    }),
  resetEditor: () =>
    set({
      ...syncCurrentPageState(initialSite, initialCurrentPage.id, getInitialSelectedBlockId(initialPage)),
      selectedContainerId: null,
      selectedElementId: null,
      selectedHeaderSlot: null,
      selectedInsertionTarget: getInitialSelectedBlockId(initialPage)
        ? { blockId: getInitialSelectedBlockId(initialPage) ?? "", kind: "block" }
        : null,
      previewMode: "desktop",
      paymentStatus: "NONE",
      isDirty: false,
    }),
  loadFromLocalStorage: () => {
    if (typeof window === "undefined") {
      return;
    }

    const rawDraft = window.localStorage.getItem(EDITOR_DRAFT_STORAGE_KEY);
    const savedPaymentStatus = parsePaymentStatus(
      window.localStorage.getItem(MOCK_PAYMENT_STATUS_STORAGE_KEY),
    );

    if (!rawDraft) {
      if (savedPaymentStatus) {
        set({
          paymentStatus: savedPaymentStatus,
        });
      }

      return;
    }

    const draft = parseDraft(rawDraft);

    if (!draft) {
      return;
    }

    const site = draft.site ?? (draft.page ? pageDataToSiteData(draft.page) : initialSite);
    const currentPageId = draft.currentPageId ?? site.pages[0]?.id ?? "home";
    const nextSlice = syncCurrentPageState(site, currentPageId, draft.selectedBlockId);

    set({
      ...nextSlice,
      selectedContainerId: null,
      selectedElementId: null,
      selectedHeaderSlot: null,
      selectedInsertionTarget: nextSlice.selectedBlockId
        ? { blockId: nextSlice.selectedBlockId, kind: "block" }
        : null,
      previewMode: draft.previewMode,
      paymentStatus: savedPaymentStatus ?? draft.paymentStatus ?? "NONE",
      isDirty: false,
    });
  },
  saveToLocalStorage: () => {
    if (typeof window === "undefined") {
      return;
    }

    const { currentPageId, page, paymentStatus, previewMode, selectedBlockId, site } = get();
    const draft: PersistedEditorDraft = {
      currentPageId,
      page,
      paymentStatus,
      selectedBlockId,
      site,
      previewMode,
    };

    window.localStorage.setItem(EDITOR_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    window.localStorage.setItem(MOCK_PAYMENT_STATUS_STORAGE_KEY, paymentStatus);
    set({ isDirty: false });
  },
}));
