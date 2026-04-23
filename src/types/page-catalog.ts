export const pageDefinitionCategories = [
  "global",
  "commerce",
  "government",
  "portfolio",
  "saas",
  "content",
  "community",
  "company",
  "admin",
] as const;

export const pageKinds = [
  "static",
  "form",
  "list",
  "detail",
  "auth",
  "checkout",
  "dashboard",
  "settings",
  "error",
] as const;

export type PageDefinitionCategory = (typeof pageDefinitionCategories)[number];
export type PageKind = (typeof pageKinds)[number];
export type PageComplexity = 0 | 1 | 2 | 3 | 4 | 5;

export type PageDefinition = {
  canBeFrontendScaffold: boolean;
  canBeFullStack: boolean;
  canBeStaticMockup: boolean;
  category: PageDefinitionCategory;
  complexity: PageComplexity;
  dataModel?: string;
  defaultBlocks: string[];
  description: string;
  id: string;
  name: string;
  pageKind: PageKind;
  recommendedFor: string[];
  requires?: string[];
  routePattern: string;
};
