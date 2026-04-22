import { stylePacks } from "@/data/style-packs";
import { makeSlug } from "@/lib/site-data";
import type { SiteData, SiteType } from "@/types/page";
import type { SiteTemplate } from "@/types/template";

export function createSiteDataFromTemplate(template: SiteTemplate): SiteData {
  const stylePack =
    stylePacks.find((pack) => pack.id === template.recommendedStylePackIds[0]) ?? stylePacks[0];

  return {
    id: template.id,
    name: template.name,
    slug: makeSlug(template.name),
    brand: {
      name: template.name,
      tagline: template.description,
      logoText: template.name.slice(0, 2).toUpperCase(),
    },
    theme: {
      paletteId: stylePack.id,
      stylePackId: stylePack.id,
      colors: stylePack.colors,
      fontFamily: stylePack.typography.bodyFont,
      radius: stylePack.shape.radius,
      shadow: stylePack.effects.shadow,
      spacing: stylePack.layout.sectionPadding,
      typography: stylePack.typography,
      layout: stylePack.layout,
      shape: stylePack.shape,
      effects: stylePack.effects,
      button: stylePack.button,
    },
    navigation: {
      items: structuredClone(template.navigation),
      cta: {
        label: "문의하기",
        href: "/contact",
      },
    },
    pages: structuredClone(template.pages),
    globalSections: {
      header: {
        enabled: true,
        variant: "cta-right",
      },
      footer: {
        enabled: true,
        variant: "columns",
      },
    },
    seo: {
      title: template.name,
      description: template.description,
      keywords: template.moodTags,
    },
  };
}

export function findTemplateForSiteType(templates: SiteTemplate[], siteType: SiteType) {
  return (
    templates.find((template) => template.siteType === siteType) ??
    templates.find((template) => template.siteType === "business") ??
    templates[0]
  );
}
