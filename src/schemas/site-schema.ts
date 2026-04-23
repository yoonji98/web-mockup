import { z } from "zod";

import { collectionDefinitionSchema } from "@/schemas/collection-schema";
import { containerNodeSchema, elementNodeSchema } from "@/schemas/element-schema";
import { blockSchema, themeSchema } from "@/schemas/page-schema";
import {
  footerVariants,
  headerHeightTypes,
  headerVariants,
  sitePageTypes,
  siteTypes,
} from "@/types/page";
import { headerSlotTypes } from "@/types/elements";

export const navItemSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .strict();

const headerSlotsSchema = z
  .object(
    Object.fromEntries(
      headerSlotTypes.map((slot) => [slot, z.array(elementNodeSchema).optional()]),
    ),
  )
  .partial()
  .strict();

export const sitePageSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    type: z.enum(sitePageTypes),
    seo: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
      .strict()
      .optional(),
    blocks: z.array(blockSchema),
  })
  .strict();

export const siteDataSchema = z
  .object({
    id: z.string().min(1).optional(),
    name: z.string().min(1),
    slug: z.string().min(1).optional(),
    brand: z
      .object({
        name: z.string().min(1),
        tagline: z.string().min(1).optional(),
        logoText: z.string().min(1).optional(),
      })
      .strict(),
    theme: themeSchema,
    collections: z.array(collectionDefinitionSchema).optional(),
    navigation: z
      .object({
        items: z.array(navItemSchema),
        cta: navItemSchema.optional(),
      })
      .strict(),
    pages: z.array(sitePageSchema).min(1),
    globalSections: z
      .object({
        header: z
          .object({
            containers: z.array(containerNodeSchema).optional(),
            elements: z.array(elementNodeSchema).optional(),
            enabled: z.boolean().optional(),
            height: z.enum(headerHeightTypes).optional(),
            slots: headerSlotsSchema.optional(),
            sticky: z.boolean().optional(),
            transparent: z.boolean().optional(),
            variant: z.enum(headerVariants),
          })
          .strict()
          .optional(),
        footer: z
          .object({
            containers: z.array(containerNodeSchema).optional(),
            elements: z.array(elementNodeSchema).optional(),
            enabled: z.boolean().optional(),
            variant: z.enum(footerVariants),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    seo: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        keywords: z.array(z.string().min(1)),
      })
      .strict(),
  })
  .strict();

export const generateSiteRequestSchema = z
  .object({
    businessName: z.string().min(1),
    siteType: z.enum(siteTypes),
    industry: z.string().min(1),
    targetAudience: z.string().min(1),
    goal: z.string().min(1),
    tone: z.string().min(1),
    pageCount: z.enum(["one-page", "small-site", "full-site"]),
    generationLevel: z.enum(["static-mockup", "frontend-scaffold", "full-stack"]).optional(),
    selectedFeatureKitIds: z.array(z.string().min(1)).optional(),
    selectedPageIds: z.array(z.string().min(1)).optional(),
    requiredFeatureKeys: z.array(z.string().min(1)).optional(),
    stylePreference: z.string().optional(),
    stylePackId: z.string().min(1).optional(),
    loginButtonMode: z.enum(["auto", "include", "hide"]).optional(),
    menuMode: z.enum(["auto", "anchor", "multi-page"]).optional(),
  })
  .strict();

export type SiteDataFromSchema = z.infer<typeof siteDataSchema>;
