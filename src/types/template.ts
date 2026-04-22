import type { NavItem, SitePage, SiteType } from "@/types/page";

export type SiteTemplate = {
  description: string;
  id: string;
  moodTags: string[];
  name: string;
  navigation: NavItem[];
  pages: SitePage[];
  recommendedStylePackIds: string[];
  siteType: SiteType;
};
