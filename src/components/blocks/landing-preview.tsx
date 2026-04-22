import { SiteRenderer } from "@/components/site/SiteRenderer";
import { pageDataToSiteData } from "@/lib/site-data";
import type { PageData } from "@/types/page";

type LandingPreviewProps = {
  pageData: PageData;
};

export function LandingPreview({ pageData }: LandingPreviewProps) {
  const site = pageDataToSiteData(pageData);
  const currentPage = site.pages[0];

  return <SiteRenderer currentPage={currentPage} site={site} />;
}
