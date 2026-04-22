import { v4 as createId } from "uuid";

import { createDefaultBlock } from "@/data/block-defaults";
import { starterPageData } from "@/data/starter-page";
import { createHeaderSlots, withMigratedElementData } from "@/lib/element-migration";
import { footerVariants } from "@/types/page";
import type { Block, FooterVariant, PageData, SiteData, SitePage, SitePageType } from "@/types/page";
import type { ElementNode, HeaderSlots } from "@/types/elements";

export type CreateSitePageInput = {
  includeStarterBlocks?: boolean;
  slug?: string;
  title: string;
  type: SitePageType;
};

export function createDefaultSiteData(): SiteData {
  return pageDataToSiteData(starterPageData);
}

export function pageDataToSiteData(page: PageData): SiteData {
  const footerBlock = page.blocks.find((block) => block.type === "footer");
  const pageBlocks = page.blocks.filter((block) => block.type !== "footer");
  const footerProps = footerBlock?.type === "footer" ? footerBlock.props : null;
  const footerVariant = footerBlock?.variant;
  const slug = page.slug ?? makeSlug(page.title || "home");
  const pageId = page.id ?? "home";

  return normalizeSiteData({
    id: page.id,
    name: page.title,
    slug,
    brand: {
      name: footerProps?.brandName ?? page.title,
      tagline: footerProps?.description ?? page.seo.description,
      logoText: footerProps?.brandName?.slice(0, 2).toUpperCase() ?? page.title.slice(0, 2).toUpperCase(),
    },
    theme: page.theme,
    navigation: {
      items: [
        {
          label: "Home",
          href: "/",
        },
      ],
      cta: {
        label: "문의하기",
        href: "/contact",
      },
    },
    pages: [
      {
        id: pageId,
        title: page.title,
        slug,
        type: "home",
        seo: {
          title: page.seo.title,
          description: page.seo.description,
        },
        blocks:
          pageBlocks.length > 0
            ? pageBlocks.map(withMigratedElementData)
            : [createDefaultBlock("hero"), createDefaultBlock("cta")].map(withMigratedElementData),
      },
    ],
    globalSections: {
      header: {
        enabled: true,
        variant: "cta-right",
      },
      footer: {
        enabled: true,
        variant: isFooterVariant(footerVariant) ? footerVariant : "simple",
      },
    },
    seo: page.seo,
  });
}

export function sitePageToPageData(site: SiteData, page: SitePage): PageData {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    theme: site.theme,
    seo: {
      title: page.seo?.title ?? site.seo.title,
      description: page.seo?.description ?? site.seo.description,
      keywords: site.seo.keywords,
    },
    blocks: page.blocks,
  };
}

export function getCurrentSitePage(site: SiteData, currentPageId: string): SitePage {
  const normalizedSite = normalizeSiteData(site);

  return (
    normalizedSite.pages.find((page) => page.id === currentPageId) ??
    normalizedSite.pages.find((page) => page.type === "home") ??
    normalizedSite.pages[0]
  );
}

export function updateSitePage(
  site: SiteData,
  pageId: string,
  update: (page: SitePage) => SitePage,
): SiteData {
  return normalizeSiteData({
    ...site,
    pages: site.pages.map((page) => (page.id === pageId ? update(page) : page)),
  });
}

export function normalizeSiteData(site: SiteData): SiteData {
  const pages = site.pages.length > 0 ? site.pages : [createSitePage({ title: "Home", type: "home" })];
  const hasHome = pages.some((page) => page.type === "home");
  const nextPages = ensureUniquePageSlugs(hasHome ? pages : [{ ...pages[0], type: "home" }, ...pages.slice(1)]).map(
    (page) => ({
      ...page,
      blocks: page.blocks.map(withMigratedElementData),
    }),
  );
  const fallbackHeaderSlots = createHeaderSlots({
    brandName: site.brand.name || site.name,
    cta: site.navigation.cta,
    logoText: site.brand.logoText,
    navItems: site.navigation.items,
  });
  const headerSlots = hasHeaderSlots(site.globalSections?.header?.slots)
    ? site.globalSections?.header?.slots
    : createSlotsFromHeaderElements(site.globalSections?.header?.elements) ?? fallbackHeaderSlots;
  const headerElements =
    site.globalSections?.header?.elements && site.globalSections.header.elements.length > 0
      ? site.globalSections.header.elements
      : flattenHeaderSlots(headerSlots);

  return {
    ...site,
    brand: {
      name: site.brand.name || site.name,
      tagline: site.brand.tagline,
      logoText: site.brand.logoText || site.brand.name.slice(0, 2).toUpperCase(),
    },
    navigation: {
      items: site.navigation.items.length > 0 ? site.navigation.items : createNavigationFromPages(nextPages),
      cta: site.navigation.cta,
    },
    pages: nextPages,
    globalSections: {
      header: {
        containers: site.globalSections?.header?.containers,
        elements: headerElements,
        height: site.globalSections?.header?.height ?? "md",
        enabled: site.globalSections?.header?.enabled ?? true,
        slots: headerSlots,
        sticky: site.globalSections?.header?.sticky ?? true,
        transparent:
          site.globalSections?.header?.transparent ??
          site.globalSections?.header?.variant === "transparent",
        variant: site.globalSections?.header?.variant ?? "cta-right",
      },
      footer: {
        containers: site.globalSections?.footer?.containers,
        elements: site.globalSections?.footer?.elements,
        enabled: site.globalSections?.footer?.enabled ?? true,
        variant: site.globalSections?.footer?.variant ?? "simple",
      },
    },
  };
}

export function createSitePage(input: CreateSitePageInput): SitePage {
  const blocks = input.includeStarterBlocks ? createStarterBlocksForPage(input.type) : [createDefaultBlock("hero")];
  const slug = input.slug ? makeSlug(input.slug) : makeSlug(input.title);

  return {
    id: createId(),
    title: input.title.trim() || "Untitled",
    slug: input.type === "home" ? "home" : slug,
    type: input.type,
    seo: {
      title: input.title.trim() || "Untitled",
      description: `${input.title.trim() || "Untitled"} 페이지`,
    },
    blocks,
  };
}

export function createNavigationFromPages(pages: SitePage[]) {
  return pages.map((page) => ({
    label: page.title,
    href: page.type === "home" ? "/" : `/${page.slug}`,
  }));
}

export function makeSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "page";
}

export function ensureUniquePageSlug(slug: string, pages: SitePage[], exceptPageId?: string): string {
  const baseSlug = makeSlug(slug);
  let nextSlug = baseSlug;
  let index = 2;

  while (pages.some((page) => page.id !== exceptPageId && page.slug === nextSlug)) {
    nextSlug = `${baseSlug}-${index}`;
    index += 1;
  }

  return nextSlug;
}

function ensureUniquePageSlugs(pages: SitePage[]): SitePage[] {
  const usedSlugs = new Set<string>();

  return pages.map((page) => {
    const baseSlug = page.type === "home" ? "home" : makeSlug(page.slug || page.title);
    let slug = baseSlug;
    let index = 2;

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${index}`;
      index += 1;
    }

    usedSlugs.add(slug);

    return {
      ...page,
      slug,
    };
  });
}

function createStarterBlocksForPage(type: SitePageType): Block[] {
  if (type === "contact") {
    return [createDefaultBlock("hero"), createDefaultBlock("contact"), createDefaultBlock("faq")];
  }

  if (type === "services") {
    return [createDefaultBlock("hero"), createDefaultBlock("services"), createDefaultBlock("cta")];
  }

  if (type === "portfolio") {
    return [createDefaultBlock("hero"), createDefaultBlock("portfolio"), createDefaultBlock("testimonials")];
  }

  if (type === "pricing") {
    return [createDefaultBlock("hero"), createDefaultBlock("pricing"), createDefaultBlock("faq")];
  }

  if (type === "about") {
    return [createDefaultBlock("hero"), createDefaultBlock("about"), createDefaultBlock("testimonials")];
  }

  return [createDefaultBlock("hero"), createDefaultBlock("features"), createDefaultBlock("cta")];
}

function isFooterVariant(variant: string | undefined): variant is FooterVariant {
  return footerVariants.some((footerVariant) => footerVariant === variant);
}

function hasHeaderSlots(slots: HeaderSlots | undefined): slots is HeaderSlots {
  return Boolean(
    slots &&
      ((slots.left?.length ?? 0) > 0 ||
        (slots.center?.length ?? 0) > 0 ||
        (slots.right?.length ?? 0) > 0 ||
        (slots.mobile?.length ?? 0) > 0),
  );
}

function flattenHeaderSlots(slots: HeaderSlots): ElementNode[] {
  return [
    ...(slots.left ?? []),
    ...(slots.center ?? []),
    ...(slots.right ?? []),
    ...(slots.mobile ?? []),
  ];
}

function createSlotsFromHeaderElements(elements: ElementNode[] | undefined): HeaderSlots | null {
  if (!elements || elements.length === 0) {
    return null;
  }

  return elements.reduce<HeaderSlots>(
    (slots, element) => {
      if (element.type === "logo") {
        return {
          ...slots,
          left: [...(slots.left ?? []), element],
        };
      }

      if (element.type === "menu") {
        return {
          ...slots,
          center: [...(slots.center ?? []), element],
        };
      }

      return {
        ...slots,
        right: [...(slots.right ?? []), element],
      };
    },
    { left: [], center: [], right: [], mobile: [] },
  );
}
