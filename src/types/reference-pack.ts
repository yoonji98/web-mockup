export const referencePackCategories = [
  "portal",
  "commerce-fashion",
  "commerce-brand",
  "saas-ai",
  "company",
  "portfolio",
  "blog-media",
  "dashboard",
] as const;

export const referencePackHeaderTypes = [
  "utility+mega",
  "utility+category",
  "minimal-corporate",
  "portal-dense",
  "editorial-simple",
] as const;

export const referencePackSearchModes = ["none", "inline", "icon", "prominent"] as const;
export const referencePackNavigationDensities = ["sparse", "balanced", "dense"] as const;
export const referencePackNavigationStyles = [
  "simple",
  "category-strip",
  "mega-menu",
  "portal-board",
] as const;
export const referencePackHeroTypes = [
  "portal-board",
  "editorial-banner",
  "commerce-hero",
  "promo-mosaic",
  "saas-concise",
  "brand-story",
] as const;
export const referencePackContentDensities = ["airy", "balanced", "dense"] as const;
export const referencePackTypographyScales = ["compact", "balanced", "display"] as const;
export const referencePackTypographyTones = [
  "neutral",
  "luxury",
  "editorial",
  "tech",
  "portal",
] as const;
export const referencePackSpacingModes = ["compact", "balanced", "spacious"] as const;
export const referencePackCardPaddings = ["sm", "md", "lg"] as const;
export const referencePackBorderDensities = ["none", "subtle", "medium"] as const;
export const referencePackShadowDensities = ["none", "soft", "medium"] as const;
export const referencePackFooterVariants = ["simple", "columns", "brand-heavy", "newsletter"] as const;
export const referencePackFooterEmphasis = [
  "minimal",
  "navigation",
  "commerce",
  "institutional",
] as const;

export type ReferencePackCategory = (typeof referencePackCategories)[number];
export type ReferencePackHeaderType = (typeof referencePackHeaderTypes)[number];
export type ReferencePackSearchMode = (typeof referencePackSearchModes)[number];
export type ReferencePackNavigationDensity = (typeof referencePackNavigationDensities)[number];
export type ReferencePackNavigationStyle = (typeof referencePackNavigationStyles)[number];
export type ReferencePackHeroType = (typeof referencePackHeroTypes)[number];
export type ReferencePackContentDensity = (typeof referencePackContentDensities)[number];
export type ReferencePackTypographyScale = (typeof referencePackTypographyScales)[number];
export type ReferencePackTypographyTone = (typeof referencePackTypographyTones)[number];
export type ReferencePackSpacingMode = (typeof referencePackSpacingModes)[number];
export type ReferencePackCardPadding = (typeof referencePackCardPaddings)[number];
export type ReferencePackBorderDensity = (typeof referencePackBorderDensities)[number];
export type ReferencePackShadowDensity = (typeof referencePackShadowDensities)[number];
export type ReferencePackFooterVariant = (typeof referencePackFooterVariants)[number];
export type ReferencePackFooterEmphasis = (typeof referencePackFooterEmphasis)[number];

export type ReferencePackNavItem = {
  href: string;
  label: string;
};

export type ReferencePack = {
  category: ReferencePackCategory;
  description: string;
  footerPreset: {
    emphasis: ReferencePackFooterEmphasis;
    newsletter: boolean;
    variant: ReferencePackFooterVariant;
  };
  headerPreset: {
    accountActions: boolean;
    cartAction: boolean;
    languageSelector: boolean;
    quickLinks?: string[];
    searchMode: ReferencePackSearchMode;
    sticky: boolean;
    type: ReferencePackHeaderType;
    utilityBar: boolean;
  };
  homepagePreset: {
    contentDensity: ReferencePackContentDensity;
    defaultGridPresetId: string;
    defaultPatternIds: string[];
    heroType: ReferencePackHeroType;
  };
  id: string;
  inspiredBy?: string[];
  name: string;
  navigationPreset: {
    density: ReferencePackNavigationDensity;
    items: ReferencePackNavItem[];
    style: ReferencePackNavigationStyle;
  };
  previewImage?: string;
  recommendedFeatureKitIds: string[];
  recommendedPageIds: string[];
  recommendedStylePackIds: string[];
  typographyPreset: {
    bodyFont: string;
    headingFont: string;
    id: string;
    scale: ReferencePackTypographyScale;
    tone: ReferencePackTypographyTone;
  };
  densityPreset: {
    borderDensity: ReferencePackBorderDensity;
    cardPadding: ReferencePackCardPadding;
    shadowDensity: ReferencePackShadowDensity;
    spacing: ReferencePackSpacingMode;
  };
};
