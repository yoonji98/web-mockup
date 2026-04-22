"use client";

import { v4 as createId } from "uuid";
import { z } from "zod";
import { create } from "zustand";

import { createDefaultBlock } from "@/data/block-defaults";
import { createDefaultElement } from "@/data/element-defaults";
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

type EditorState = {
  page: PageData;
  site: SiteData;
  currentPageId: string;
  customPalettes: Palette[];
  selectedBlockId: string | null;
  selectedElementId: string | null;
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
  selectElement: (selection: ElementSelection | null) => void;
  selectInsertionTarget: (target: ElementInsertionTarget | null) => void;
  addBlock: (type: BlockType) => void;
  addBlockToCurrentPage: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateBlock: (id: string, props: BlockPropsUpdate) => void;
  addElementToSelectedTarget: (type: ElementNodeType) => void;
  addElementToHeaderSlot: (slot: HeaderSlotType, type: ElementNodeType) => void;
  moveHeaderElement: (elementId: string, toSlot: HeaderSlotType, targetIndex?: number) => void;
  removeElement: (elementId: string) => void;
  reorderElements: (blockId: string, containerId: string | null, activeId: string, overId: string) => void;
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

function cloneSite(site: SiteData): SiteData {
  return structuredClone(site);
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

  return {
    ...syncCurrentPageState(site, state.currentPageId, selectedBlockId),
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

function addElementToContainer(container: ContainerNode, containerId: string, element: ElementNode): ContainerNode {
  if (container.id === containerId) {
    return {
      ...container,
      children: [...container.children, element],
    };
  }

  return {
    ...container,
    children: container.children.map((child) =>
      "children" in child ? addElementToContainer(child, containerId, element) : child,
    ),
  };
}

function addElementToBlock(block: Block, target: ElementInsertionTarget, element: ElementNode): Block {
  if (target.kind !== "block" || target.blockId !== block.id) {
    return block;
  }

  const shouldRenderAsElementTree = isLegacyContentBlock(block) ? "element-tree" : block.variant;

  if (target.containerId) {
    return {
      ...block,
      containers: block.containers?.map((container) =>
        addElementToContainer(container, target.containerId ?? "", element),
      ),
      variant: shouldRenderAsElementTree,
    } as Block;
  }

  if (block.type === "freeformSection") {
    const layoutIndex = block.props.layouts.length;

    return {
      ...block,
      elements: [...(block.elements ?? []), element],
      props: {
        ...block.props,
        layouts: [
          ...block.props.layouts,
          {
            breakpoint: "desktop",
            elementId: element.id,
            h: 120,
            w: 280,
            x: 80 + layoutIndex * 28,
            y: 80 + layoutIndex * 28,
            zIndex: layoutIndex + 1,
          },
        ],
      },
    };
  }

  if ((block.containers?.length ?? 0) > 0 && block.containers?.[0]) {
    const firstContainerId = block.containers[0].id;

    return {
      ...block,
      containers: block.containers.map((container) =>
        addElementToContainer(container, firstContainerId, element),
      ),
      variant: shouldRenderAsElementTree,
    } as Block;
  }

  return {
    ...block,
    elements: [...(block.elements ?? []), element],
    variant: shouldRenderAsElementTree,
  } as Block;
}

function isLegacyContentBlock(block: Block) {
  return (
    block.type !== "customSection" &&
    block.type !== "containerSection" &&
    block.type !== "gridSection" &&
    block.type !== "columnsSection" &&
    block.type !== "freeformSection"
  );
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

export const useEditorStore = create<EditorState>((set, get) => ({
  page: clonePage(initialPage),
  site: cloneSite(initialSite),
  currentPageId: initialCurrentPage.id,
  customPalettes: [],
  selectedBlockId: getInitialSelectedBlockId(initialPage),
  selectedElementId: null,
  selectedInsertionTarget: getInitialSelectedBlockId(initialPage)
    ? { blockId: getInitialSelectedBlockId(initialPage) ?? "", kind: "block" }
    : null,
  previewMode: "desktop",
  paymentStatus: "NONE",
  isDirty: false,
  setPage: (page) =>
    set({
      ...syncCurrentPageState(pageDataToSiteData(page), page.id ?? "home", getInitialSelectedBlockId(page)),
      selectedElementId: null,
      selectedInsertionTarget: getInitialSelectedBlockId(page)
        ? { blockId: getInitialSelectedBlockId(page) ?? "", kind: "block" }
        : null,
      isDirty: true,
    }),
  setSite: (site) =>
    set(() => {
      const nextSlice = syncCurrentPageState(site, site.pages[0]?.id ?? "home", null);

      return {
        ...nextSlice,
        selectedElementId: null,
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
        isDirty: true,
      };
    }),
  setCurrentPage: (id) =>
    set((state) => ({
      ...syncCurrentPageState(state.site, id, null),
      selectedElementId: null,
      selectedInsertionTarget: null,
    })),
  selectBlock: (id) =>
    set((state) => ({
      selectedBlockId: normalizeSelectedBlockId(state.page, id),
      selectedElementId: null,
      selectedInsertionTarget: id ? { blockId: id, kind: "block" } : null,
    })),
  selectElement: (selection) =>
    set({
      selectedElementId: selection?.elementId ?? null,
      selectedInsertionTarget: selection
        ? selection.kind === "headerSlot"
          ? { kind: "headerSlot", slot: selection.slot }
          : { blockId: selection.blockId, containerId: selection.containerId, kind: "block" }
        : null,
    }),
  selectInsertionTarget: (target) =>
    set({
      selectedInsertionTarget: target,
    }),
  addBlock: (type) => get().addBlockToCurrentPage(type),
  addBlockToCurrentPage: (type) =>
    set((state) => {
      const block = createDefaultBlock(type);

      return replaceCurrentPageBlocks(state, [...state.page.blocks, block], block.id);
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
  addElementToSelectedTarget: (type) =>
    set((state) => {
      const element = createDefaultElement(type);
      const target =
        state.selectedInsertionTarget ??
        (state.selectedBlockId ? { blockId: state.selectedBlockId, kind: "block" as const } : null);

      if (!target) {
        return state;
      }

      if (target.kind === "headerSlot") {
        const site = updateHeaderSlots(state.site, (slots) => ({
          ...slots,
          [target.slot]: [...(slots[target.slot] ?? []), element],
        }));

        return {
          ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
          selectedElementId: element.id,
          selectedInsertionTarget: target,
          isDirty: true,
        };
      }

      const blocks = state.page.blocks.map((block) => addElementToBlock(block, target, element));

      return {
        ...replaceCurrentPageBlocks(state, blocks, target.blockId),
        selectedElementId: element.id,
        selectedInsertionTarget: target,
      };
    }),
  addElementToHeaderSlot: (slot, type) =>
    set((state) => {
      const element = createDefaultElement(type);
      const site = updateHeaderSlots(state.site, (slots) => ({
        ...slots,
        [slot]: [...(slots[slot] ?? []), element],
      }));

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
        selectedElementId: element.id,
        selectedInsertionTarget: { kind: "headerSlot", slot },
        isDirty: true,
      };
    }),
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
        selectedElementId: elementId,
        selectedInsertionTarget: { kind: "headerSlot", slot: toSlot },
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
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
        isDirty: true,
      };
    }),
  reorderElements: (blockId, containerId, activeId, overId) =>
    set((state) => {
      if (activeId === overId) {
        return state;
      }

      const blocks = state.page.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        if (!containerId) {
          const elements = block.elements ?? [];
          const activeIndex = elements.findIndex((element) => element.id === activeId);
          const overIndex = elements.findIndex((element) => element.id === overId);

          if (activeIndex === -1 || overIndex === -1) {
            return block;
          }

          return {
            ...block,
            elements: moveArrayItem(elements, activeIndex, overIndex),
          } as Block;
        }

        return {
          ...block,
          containers: block.containers?.map((container) =>
            reorderElementsInContainer(container, containerId, activeId, overId),
          ),
        } as Block;
      });

      return replaceCurrentPageBlocks(state, blocks, blockId);
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
  setTheme: (theme) =>
    set((state) => {
      const site = normalizeSiteData({
        ...state.site,
        theme,
      });

      return {
        ...syncCurrentPageState(site, state.currentPageId, state.selectedBlockId),
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
      selectedElementId: null,
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
      selectedElementId: null,
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
