"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Copy, PanelRight, Trash2 } from "lucide-react";

import { AIRewriteBlockButton } from "@/components/editor/AIRewriteBlockButton";
import { AboutEditor } from "@/components/editor/block-editors/AboutEditor";
import { CollectionBlockEditor } from "@/components/editor/block-editors/CollectionBlockEditor";
import { ContactEditor } from "@/components/editor/block-editors/ContactEditor";
import { ContainerSectionEditor } from "@/components/editor/block-editors/ContainerSectionEditor";
import { CtaEditor } from "@/components/editor/block-editors/CtaEditor";
import { FaqEditor } from "@/components/editor/block-editors/FaqEditor";
import { FeaturesEditor } from "@/components/editor/block-editors/FeaturesEditor";
import { FooterEditor } from "@/components/editor/block-editors/FooterEditor";
import { FreeformSectionEditor } from "@/components/editor/block-editors/FreeformSectionEditor";
import { HeroEditor } from "@/components/editor/block-editors/HeroEditor";
import { PortfolioEditor } from "@/components/editor/block-editors/PortfolioEditor";
import { PricingEditor } from "@/components/editor/block-editors/PricingEditor";
import { ServicesEditor } from "@/components/editor/block-editors/ServicesEditor";
import { TestimonialsEditor } from "@/components/editor/block-editors/TestimonialsEditor";
import { ElementPropertiesPanel } from "@/components/editor/ElementPropertiesPanel";
import { SelectionBreadcrumb } from "@/components/editor/SelectionBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editor-store";
import { blockVariantOptions } from "@/types/page";
import type { Block, BlockType } from "@/types/page";

const blockNames: Record<Block["type"], string> = {
  hero: "Hero",
  features: "Features",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  collectionList: "Collection List",
  collectionDetail: "Collection Detail",
  testimonials: "Testimonials",
  pricing: "Pricing",
  faq: "FAQ",
  cta: "CTA",
  contact: "Contact",
  footer: "Footer",
  customSection: "Custom Section",
  containerSection: "Container Section",
  gridSection: "Grid Section",
  columnsSection: "Columns Section",
  freeformSection: "Freeform Section",
};

export function RightPanel() {
  const { duplicateBlock, moveBlock, page, removeBlock, selectedBlockId, selectedElementId, setBlockVariant } =
    useEditorStore();
  const selectedBlock = useMemo(
    () => page.blocks.find((block) => block.id === selectedBlockId) ?? null,
    [page.blocks, selectedBlockId],
  );

  if (selectedElementId) {
    return (
      <aside className="h-full overflow-auto border-l border-slate-200/80 bg-slate-50/80 p-4">
        <SelectionBreadcrumb />
        <ElementPropertiesPanel />
      </aside>
    );
  }

  if (!selectedBlock) {
    return (
      <aside className="h-full overflow-auto border-l border-slate-200/80 bg-slate-50/80 p-4">
        <SelectionBreadcrumb />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PanelRight size={16} />
              속성 편집
            </CardTitle>
            <CardDescription>
              캔버스에서 블록을 선택하면 블록 타입에 맞는 폼 편집기가 표시됩니다.
            </CardDescription>
          </CardHeader>
        </Card>
      </aside>
    );
  }

  const selectedIndex = page.blocks.findIndex((block) => block.id === selectedBlock.id);

  return (
    <aside className="h-full overflow-auto border-l border-slate-200/80 bg-slate-50/80 p-4">
      <SelectionBreadcrumb />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PanelRight size={16} />
                속성 편집
              </CardTitle>
              <CardDescription>{blockNames[selectedBlock.type]} 블록의 콘텐츠를 편집합니다.</CardDescription>
            </div>
            <Badge variant="blue">#{selectedIndex + 1}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={selectedIndex <= 0}
              onClick={() => moveBlock(selectedBlock.id, "up")}
              size="sm"
              variant="outline"
            >
              <ArrowUp size={14} />
              위
            </Button>
            <Button
              disabled={selectedIndex === page.blocks.length - 1}
              onClick={() => moveBlock(selectedBlock.id, "down")}
              size="sm"
              variant="outline"
            >
              <ArrowDown size={14} />
              아래
            </Button>
            <Button onClick={() => duplicateBlock(selectedBlock.id)} size="sm" variant="outline">
              <Copy size={14} />
              복제
            </Button>
            <Button onClick={() => removeBlock(selectedBlock.id)} size="sm" variant="danger">
              <Trash2 size={14} />
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5">
        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠</CardTitle>
                <CardDescription>입력 내용은 현재 페이지 JSON에 즉시 저장됩니다.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-4">
                <BlockEditor block={selectedBlock} key={selectedBlock.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design">
            <Card>
              <CardHeader>
                <CardTitle>디자인</CardTitle>
                <CardDescription>같은 콘텐츠를 다른 블록 variant로 전환합니다.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent>
                <VariantSelector
                  block={selectedBlock}
                  onSelect={(variant) => setBlockVariant(selectedBlock.id, variant)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <AIRewriteBlockButton block={selectedBlock} />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}

type BlockEditorProps = {
  block: Block;
};

function BlockEditor({ block }: BlockEditorProps) {
  switch (block.type) {
    case "hero":
      return <HeroEditor block={block} />;
    case "features":
      return <FeaturesEditor block={block} />;
    case "about":
      return <AboutEditor block={block} />;
    case "services":
      return <ServicesEditor block={block} />;
    case "portfolio":
      return <PortfolioEditor block={block} />;
    case "collectionList":
    case "collectionDetail":
      return <CollectionBlockEditor block={block} />;
    case "testimonials":
      return <TestimonialsEditor block={block} />;
    case "pricing":
      return <PricingEditor block={block} />;
    case "faq":
      return <FaqEditor block={block} />;
    case "cta":
      return <CtaEditor block={block} />;
    case "contact":
      return <ContactEditor block={block} />;
    case "footer":
      return <FooterEditor block={block} />;
    case "customSection":
    case "containerSection":
    case "gridSection":
    case "columnsSection":
      return <ContainerSectionEditor block={block} />;
    case "freeformSection":
      return <FreeformSectionEditor block={block} />;
  }
}

type VariantSelectorProps = {
  block: Block;
  onSelect: (variant: string) => void;
};

function VariantSelector({ block, onSelect }: VariantSelectorProps) {
  const rawOptions = [...blockVariantOptions[block.type as BlockType]] as string[];
  const hasElementTree = (block.elements?.length ?? 0) > 0 || (block.containers?.length ?? 0) > 0;
  const options =
    hasElementTree && !rawOptions.includes("element-tree")
      ? ["element-tree", ...rawOptions]
      : rawOptions;

  return (
    <div className="grid gap-2">
      {options.map((variant) => {
        const isSelected = (block.variant ?? options[0]) === variant;

        return (
          <button
            className={`rounded-2xl border p-3 text-left text-sm transition ${
              isSelected
                ? "border-blue-400 bg-blue-50 text-blue-950 ring-4 ring-blue-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            key={variant}
            onClick={() => onSelect(variant)}
            type="button"
          >
            <span className="font-semibold">{variant}</span>
            <span className="mt-1 block text-xs text-slate-500">
              이 블록의 레이아웃과 카드 표현 방식을 바꿉니다.
            </span>
          </button>
        );
      })}
    </div>
  );
}
