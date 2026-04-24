"use client";

import { useMemo, useState } from "react";
import { LayoutPanelTop } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  isPatternRecommendedForArchetype,
  patternLibrary,
} from "@/data/pattern-library";
import { useEditorStore } from "@/store/editor-store";
import type { PatternCategory, PatternDefinition } from "@/types/pattern-library";

const categoryLabels: Record<PatternCategory, string> = {
  "portal-government": "Portal / Government",
  "fashion-brand": "Fashion Mall / Brand Mall",
  "ai-company": "AI Corporate / Company",
  "editorial-blog": "Editorial / Blog",
  "dashboard-admin": "Dashboard / Admin",
};

export function PatternLibraryPanel() {
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const insertBlocksAt = useEditorStore((state) => state.insertBlocksAt);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const site = useEditorStore((state) => state.site);
  const [status, setStatus] = useState<string | null>(null);
  const currentPage = site.pages.find((page) => page.id === currentPageId) ?? site.pages[0];
  const selectedArchetype = site.referencePack?.category ?? null;
  const recommendedPatterns = useMemo(
    () => patternLibrary.filter((patternDefinition) => isPatternRecommendedForArchetype(patternDefinition, selectedArchetype)),
    [selectedArchetype],
  );
  const groupedPatterns = useMemo(
    () =>
      Object.entries(
        patternLibrary.reduce<Record<PatternCategory, PatternDefinition[]>>(
          (accumulator, patternDefinition) => {
            accumulator[patternDefinition.category].push(patternDefinition);
            return accumulator;
          },
          {
            "portal-government": [],
            "fashion-brand": [],
            "ai-company": [],
            "editorial-blog": [],
            "dashboard-admin": [],
          },
        ),
      ) as Array<[PatternCategory, PatternDefinition[]]>,
    [],
  );

  function insertPattern(patternDefinition: PatternDefinition) {
    const blocks = patternDefinition.createBlocksOrContainers().blocks;
    const selectedIndex = selectedBlockId
      ? currentPage.blocks.findIndex((block) => block.id === selectedBlockId)
      : -1;
    const insertIndex = selectedIndex >= 0 ? selectedIndex + 1 : currentPage.blocks.length;

    insertBlocksAt(blocks, insertIndex);
    setStatus(`${patternDefinition.name} 패턴을 현재 페이지에 추가했습니다.`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutPanelTop size={16} />
          Pattern Library
        </CardTitle>
        <CardDescription>사이트 구조 패턴을 현재 페이지에 바로 삽입합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {recommendedPatterns.length > 0 ? (
          <section className="grid gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-950">추천 패턴</p>
              <Badge variant="blue">{site.referencePack?.name}</Badge>
            </div>
            <div className="grid gap-3">
              {recommendedPatterns.map((patternDefinition) => (
                <PatternCard
                  key={`recommended-${patternDefinition.id}`}
                  onInsert={() => insertPattern(patternDefinition)}
                  patternDefinition={patternDefinition}
                  recommended
                />
              ))}
            </div>
          </section>
        ) : null}

        {groupedPatterns.map(([category, patterns]) => (
          <section className="grid gap-3" key={category}>
            <p className="text-sm font-semibold text-slate-950">{categoryLabels[category]}</p>
            <div className="grid gap-3">
              {patterns.map((patternDefinition) => (
                <PatternCard
                  key={patternDefinition.id}
                  onInsert={() => insertPattern(patternDefinition)}
                  patternDefinition={patternDefinition}
                />
              ))}
            </div>
          </section>
        ))}

        {status ? <p className="rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-700">{status}</p> : null}
      </CardContent>
    </Card>
  );
}

function PatternCard({
  onInsert,
  patternDefinition,
  recommended = false,
}: {
  onInsert: () => void;
  patternDefinition: PatternDefinition;
  recommended?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">{patternDefinition.name}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{patternDefinition.description}</p>
        </div>
        {recommended ? <Badge variant="green">추천</Badge> : <Badge variant="slate">{patternDefinition.layoutType}</Badge>}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {patternDefinition.previewTags.map((tag) => (
          <Badge key={tag} variant="slate">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-500">{patternDefinition.archetypes.join(" / ")}</span>
        <Button onClick={onInsert} size="sm" variant="outline">
          패턴 추가
        </Button>
      </div>
    </article>
  );
}
