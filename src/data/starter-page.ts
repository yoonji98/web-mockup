import { blockDefaults } from "@/data/block-defaults";
import { stylePacks } from "@/data/style-packs";
import type { PageData } from "@/types/page";

const defaultStylePack =
  stylePacks.find((stylePack) => stylePack.id === "clean-saas") ?? stylePacks[0];

export const starterPageData: PageData = {
  id: "starter-page",
  slug: "demo",
  title: "AI Landing Studio",
  industry: "SaaS",
  goal: "lead",
  theme: {
    paletteId: defaultStylePack.id,
    stylePackId: defaultStylePack.id,
    colors: defaultStylePack.colors,
    fontFamily: defaultStylePack.typography.bodyFont,
    radius: defaultStylePack.shape.radius,
    shadow: defaultStylePack.effects.shadow,
    spacing: defaultStylePack.layout.sectionPadding,
    typography: defaultStylePack.typography,
    layout: defaultStylePack.layout,
    shape: defaultStylePack.shape,
    effects: defaultStylePack.effects,
    button: defaultStylePack.button,
  },
  seo: {
    title: "AI Landing Studio",
    description: "블록과 팔레트로 빠르게 만드는 랜딩페이지",
    keywords: ["AI 랜딩페이지", "PageData", "랜딩페이지 빌더"],
  },
  blocks: [
    {
      id: "hero-main",
      ...structuredClone(blockDefaults.hero),
    },
    {
      id: "feature-grid",
      ...structuredClone(blockDefaults.features),
    },
    {
      id: "cta-export",
      ...structuredClone(blockDefaults.cta),
    },
    {
      id: "footer-main",
      ...structuredClone(blockDefaults.footer),
    },
  ],
};
