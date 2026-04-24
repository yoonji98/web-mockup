import { z } from "zod";

import {
  referencePackBorderDensities,
  referencePackCardPaddings,
  referencePackCategories,
  referencePackContentDensities,
  referencePackFooterEmphasis,
  referencePackFooterVariants,
  referencePackHeaderTypes,
  referencePackHeroTypes,
  referencePackNavigationDensities,
  referencePackNavigationStyles,
  referencePackSearchModes,
  referencePackShadowDensities,
  referencePackSpacingModes,
  referencePackTypographyScales,
  referencePackTypographyTones,
} from "@/types/reference-pack";

export const referencePackNavItemSchema = z
  .object({
    href: z.string().min(1),
    label: z.string().min(1),
  })
  .strict();

export const referencePackSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(referencePackCategories),
    inspiredBy: z.array(z.string().min(1)).optional(),
    previewImage: z.string().min(1).optional(),
    headerPreset: z
      .object({
        type: z.enum(referencePackHeaderTypes),
        utilityBar: z.boolean(),
        sticky: z.boolean(),
        searchMode: z.enum(referencePackSearchModes),
        accountActions: z.boolean(),
        cartAction: z.boolean(),
        languageSelector: z.boolean(),
        quickLinks: z.array(z.string().min(1)).optional(),
      })
      .strict(),
    navigationPreset: z
      .object({
        density: z.enum(referencePackNavigationDensities),
        style: z.enum(referencePackNavigationStyles),
        items: z.array(referencePackNavItemSchema),
      })
      .strict(),
    homepagePreset: z
      .object({
        heroType: z.enum(referencePackHeroTypes),
        defaultPatternIds: z.array(z.string().min(1)),
        defaultGridPresetId: z.string().min(1),
        contentDensity: z.enum(referencePackContentDensities),
      })
      .strict(),
    typographyPreset: z
      .object({
        id: z.string().min(1),
        headingFont: z.string().min(1),
        bodyFont: z.string().min(1),
        scale: z.enum(referencePackTypographyScales),
        tone: z.enum(referencePackTypographyTones),
      })
      .strict(),
    densityPreset: z
      .object({
        spacing: z.enum(referencePackSpacingModes),
        cardPadding: z.enum(referencePackCardPaddings),
        borderDensity: z.enum(referencePackBorderDensities),
        shadowDensity: z.enum(referencePackShadowDensities),
      })
      .strict(),
    footerPreset: z
      .object({
        variant: z.enum(referencePackFooterVariants),
        emphasis: z.enum(referencePackFooterEmphasis),
        newsletter: z.boolean(),
      })
      .strict(),
    recommendedPageIds: z.array(z.string().min(1)),
    recommendedFeatureKitIds: z.array(z.string().min(1)),
    recommendedStylePackIds: z.array(z.string().min(1)),
  })
  .strict();
