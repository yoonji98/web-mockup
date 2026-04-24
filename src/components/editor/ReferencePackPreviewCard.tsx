"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReferencePack } from "@/types/reference-pack";

type ReferencePackPreviewCardProps = {
  action?: ReactNode;
  className?: string;
  detailed?: boolean;
  onPreview?: () => void;
  pack: ReferencePack;
  selected?: boolean;
};

const categoryLabels: Record<ReferencePack["category"], string> = {
  portal: "Portal",
  "commerce-fashion": "Fashion Commerce",
  "commerce-brand": "Brand Commerce",
  "saas-ai": "AI / SaaS",
  company: "Company",
  portfolio: "Portfolio",
  "blog-media": "Blog / Media",
  dashboard: "Dashboard",
};

const previewTags: Record<ReferencePack["id"], string> = {
  "portal-civic": "Dense Portal",
  "fashion-mall": "Fashion Commerce",
  "brand-mall": "Brand Promo",
  "ai-corporate": "AI Corporate",
  "company-agency": "Company Core",
  "portfolio-editorial": "Editorial Portfolio",
  "blog-media": "Media Publishing",
  "dashboard-admin": "Admin Dense",
};

const headerTypeLabels: Record<ReferencePack["headerPreset"]["type"], string> = {
  "utility+mega": "Utility + Mega",
  "utility+category": "Utility + Category",
  "minimal-corporate": "Minimal Corporate",
  "portal-dense": "Portal Dense",
  "editorial-simple": "Editorial Simple",
};

const heroLabels: Record<ReferencePack["homepagePreset"]["heroType"], string> = {
  "portal-board": "Portal Board",
  "editorial-banner": "Editorial Banner",
  "commerce-hero": "Commerce Hero",
  "promo-mosaic": "Promo Mosaic",
  "saas-concise": "SaaS Concise",
  "brand-story": "Brand Story",
};

const densityLabels: Record<ReferencePack["navigationPreset"]["density"], string> = {
  sparse: "Sparse",
  balanced: "Balanced",
  dense: "Dense",
};

export function ReferencePackPreviewCard({
  action,
  className,
  detailed = false,
  onPreview,
  pack,
  selected = false,
}: ReferencePackPreviewCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-sm transition",
        selected ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-200 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">{pack.name}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{pack.description}</p>
        </div>
        <Badge variant="blue">{categoryLabels[pack.category]}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="slate">{previewTags[pack.id]}</Badge>
        <Badge variant="slate">{headerTypeLabels[pack.headerPreset.type]}</Badge>
        <Badge variant="slate">{heroLabels[pack.homepagePreset.heroType]}</Badge>
      </div>

      <div className="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3">
        <SummaryRow label="Header" value={headerSummary(pack)} />
        <SummaryRow label="Navigation" value={`${densityLabels[pack.navigationPreset.density]} · ${pack.navigationPreset.style}`} />
        <SummaryRow label="Hero" value={heroLabels[pack.homepagePreset.heroType]} />
        <SummaryRow label="Pages / Kits" value={`${pack.recommendedPageIds.length} pages · ${pack.recommendedFeatureKitIds.length} kits`} />
      </div>

      {detailed ? (
        <div className="mt-3 grid gap-3">
          <div className="flex flex-wrap gap-1.5">
            {pack.homepagePreset.defaultPatternIds.map((patternId) => (
              <Badge key={patternId} variant="default">
                {patternId}
              </Badge>
            ))}
          </div>
          <div className="grid gap-2 text-xs text-slate-600">
            <SummaryRow label="Grid preset" value={pack.homepagePreset.defaultGridPresetId} />
            <SummaryRow label="Typography" value={`${pack.typographyPreset.scale} · ${pack.typographyPreset.tone}`} />
            <SummaryRow label="Density" value={`${pack.densityPreset.spacing} · ${pack.densityPreset.cardPadding} card`} />
            <SummaryRow label="추천 StylePack" value={pack.recommendedStylePackIds.join(", ")} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pack.recommendedFeatureKitIds.map((featureKitId) => (
              <Badge key={featureKitId} variant="green">
                {featureKitId}
              </Badge>
            ))}
            {pack.recommendedPageIds.slice(0, 6).map((pageId) => (
              <Badge key={pageId} variant="slate">
                {pageId}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {onPreview || action ? (
        <div className="mt-3 flex items-center gap-2">
          {onPreview ? (
            <Button className="flex-1" onClick={onPreview} variant="outline">
              미리보기
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function headerSummary(pack: ReferencePack) {
  const parts = [pack.headerPreset.utilityBar ? "Utility" : "Clean"];

  if (pack.headerPreset.searchMode !== "none") {
    parts.push(`Search ${pack.headerPreset.searchMode}`);
  }

  if (pack.headerPreset.accountActions) {
    parts.push("Account");
  }

  if (pack.headerPreset.cartAction) {
    parts.push("Cart");
  }

  if (pack.headerPreset.languageSelector) {
    parts.push("Lang");
  }

  return parts.join(" · ");
}
