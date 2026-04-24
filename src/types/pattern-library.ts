import type { Block } from "@/types/page";

export const patternCategories = [
  "portal-government",
  "fashion-brand",
  "ai-company",
  "editorial-blog",
  "dashboard-admin",
] as const;

export const patternLayoutTypes = ["section", "header", "footer", "layout-preset"] as const;

export type PatternCategory = (typeof patternCategories)[number];
export type PatternLayoutType = (typeof patternLayoutTypes)[number];

export type PatternInsertResult = {
  blocks: Block[];
};

export type PatternDefinition = {
  archetypes: string[];
  category: PatternCategory;
  createBlocksOrContainers: () => PatternInsertResult;
  description: string;
  id: string;
  layoutType: PatternLayoutType;
  name: string;
  previewTags: string[];
};
