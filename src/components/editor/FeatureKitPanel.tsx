"use client";

import { useMemo, useState } from "react";
import { PackagePlus } from "lucide-react";

import { featureKits } from "@/data/feature-kits";
import { findPageDefinition, routePatternToSlug } from "@/data/page-catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditorStore } from "@/store/editor-store";
import type { FeatureKit } from "@/types/feature-kit";
import type { PageDefinition } from "@/types/page-catalog";
import type { SitePage } from "@/types/page";

const categoryLabels: Record<FeatureKit["category"], string> = {
  admin: "Admin",
  auth: "Auth",
  commerce: "Commerce",
  company: "Company",
  content: "Content",
  government: "Gov",
  legal: "Legal",
  portfolio: "Portfolio",
  support: "Support",
};

export function FeatureKitPanel() {
  const addPagesFromCatalog = useEditorStore((state) => state.addPagesFromCatalog);
  const sitePages = useEditorStore((state) => state.site.pages);
  const [expandedKitId, setExpandedKitId] = useState(featureKits[0]?.id ?? "");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus size={16} />
          Feature Kits
        </CardTitle>
        <CardDescription>기능 묶음으로 관련 페이지를 한 번에 추가합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {featureKits.map((featureKit) => (
          <FeatureKitCard
            expanded={expandedKitId === featureKit.id}
            featureKit={featureKit}
            key={featureKit.id}
            onAdd={() => {
              const count = addPagesFromCatalog([
                ...featureKit.includedPageIds,
                ...(featureKit.recommendedPageIds ?? []),
              ]);
              setStatus(count > 0 ? `${count}개 페이지를 추가했습니다.` : "추가할 새 페이지가 없습니다.");
            }}
            onToggle={() => setExpandedKitId((currentId) => (currentId === featureKit.id ? "" : featureKit.id))}
            sitePages={sitePages}
          />
        ))}
        {status ? <p className="rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-700">{status}</p> : null}
      </CardContent>
    </Card>
  );
}

type FeatureKitCardProps = {
  expanded: boolean;
  featureKit: FeatureKit;
  onAdd: () => void;
  onToggle: () => void;
  sitePages: SitePage[];
};

function FeatureKitCard({ expanded, featureKit, onAdd, onToggle, sitePages }: FeatureKitCardProps) {
  const pages = useMemo(
    () =>
      [...featureKit.includedPageIds, ...(featureKit.recommendedPageIds ?? [])]
        .map((pageId) => findPageDefinition(pageId))
        .filter((page): page is PageDefinition => Boolean(page)),
    [featureKit],
  );
  const addedCount = pages.filter((pageDefinition) => isAlreadyAdded(pageDefinition.id, pageDefinition.routePattern, sitePages)).length;
  const isComplete = pages.length > 0 && addedCount === pages.length;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <button className="w-full text-left" onClick={onToggle} type="button">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-950">{featureKit.name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{featureKit.description}</p>
          </div>
          <Badge variant={isComplete ? "green" : "blue"}>{categoryLabels[featureKit.category]}</Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="slate">복잡도 {featureKit.complexity}</Badge>
          <Badge variant="slate">{pages.length} pages</Badge>
          <Badge variant="slate">{supportedModes(featureKit).join(" / ")}</Badge>
          {featureKit.requiredFeatureKeys?.slice(0, 2).map((key) => (
            <Badge key={key} variant="default">
              {key}
            </Badge>
          ))}
        </div>
      </button>

      {expanded ? (
        <div className="mt-3 grid gap-3">
          <div className="grid gap-2 rounded-xl bg-slate-50 p-3">
            {pages.map((pageDefinition) => {
              const added = isAlreadyAdded(pageDefinition.id, pageDefinition.routePattern, sitePages);

              return (
                <div className="flex items-center justify-between gap-2 text-xs" key={pageDefinition.id}>
                  <span className="min-w-0 truncate font-semibold text-slate-700">{pageDefinition.name}</span>
                  <Badge variant={added ? "green" : "slate"}>{added ? "추가됨" : pageDefinition.pageKind}</Badge>
                </div>
              );
            })}
          </div>
          <Button disabled={isComplete} onClick={onAdd} size="sm" variant="secondary">
            <PackagePlus size={14} />
            페이지 추가
          </Button>
        </div>
      ) : null}
    </article>
  );
}

function isAlreadyAdded(pageDefinitionId: string, routePattern: string, pages: SitePage[]) {
  const slug = routePattern === "/" ? "home" : routePatternToSlug(routePattern);

  return pages.some((page) => page.id === pageDefinitionId || page.slug === slug);
}

function supportedModes(featureKit: FeatureKit) {
  return [
    featureKit.modeSupport.website ? "website" : null,
    featureKit.modeSupport.prototype ? "prototype" : null,
    featureKit.modeSupport.frontendScaffold ? "frontend" : null,
    featureKit.modeSupport.fullStack ? "full-stack" : null,
  ].filter((mode): mode is string => Boolean(mode));
}
