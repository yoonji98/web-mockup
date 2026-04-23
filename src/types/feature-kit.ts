import type { PageComplexity } from "@/types/page-catalog";

export const featureKitCategories = [
  "auth",
  "commerce",
  "content",
  "support",
  "admin",
  "legal",
  "portfolio",
  "company",
  "government",
] as const;

export type FeatureKitCategory = (typeof featureKitCategories)[number];

export type FeatureKit = {
  category: FeatureKitCategory;
  complexity: PageComplexity;
  description: string;
  id: string;
  includedPageIds: string[];
  modeSupport: {
    frontendScaffold: boolean;
    fullStack: boolean;
    prototype: boolean;
    website: boolean;
  };
  name: string;
  recommendedPageIds?: string[];
  requiredFeatureKeys?: string[];
};
