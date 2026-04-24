"use client";

import {
  BadgeDollarSign,
  BriefcaseBusiness,
  FileQuestion,
  Footprints,
  GalleryHorizontal,
  Images,
  LayoutTemplate,
  Mail,
  MessageSquareQuote,
  MousePointerClick,
  PanelTop,
  Rows3,
} from "lucide-react";

import { AISiteWizard } from "@/components/editor/AISiteWizard";
import { ElementLibraryPanel } from "@/components/editor/ElementLibraryPanel";
import { FeatureKitPanel } from "@/components/editor/FeatureKitPanel";
import { HeaderBuilderPanel } from "@/components/editor/HeaderBuilderPanel";
import { LayerTreePanel } from "@/components/editor/LayerTreePanel";
import { NavigationPanel } from "@/components/editor/NavigationPanel";
import { PagesPanel } from "@/components/editor/PagesPanel";
import { PatternLibraryPanel } from "@/components/editor/PatternLibraryPanel";
import { ReferencePackGallery } from "@/components/editor/ReferencePackGallery";
import { SiteTemplateGallery } from "@/components/editor/SiteTemplateGallery";
import { StylePackPanel } from "@/components/editor/StylePackPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blockTypes } from "@/types/page";
import { useEditorStore } from "@/store/editor-store";
import type { BlockType } from "@/types/page";

const blockLabels: Record<BlockType, string> = {
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
  customSection: "Custom",
  containerSection: "Container",
  gridSection: "Grid",
  columnsSection: "Columns",
  freeformSection: "Freeform",
};

const blockDescriptions: Record<BlockType, string> = {
  hero: "첫 화면",
  features: "기능 소개",
  about: "브랜드 설명",
  services: "서비스",
  portfolio: "작업 사례",
  collectionList: "데이터 목록",
  collectionDetail: "데이터 상세",
  testimonials: "후기",
  pricing: "요금제",
  faq: "질문 답변",
  cta: "전환 유도",
  contact: "문의",
  footer: "하단 정보",
  customSection: "빈 섹션",
  containerSection: "요소 배치",
  gridSection: "그리드",
  columnsSection: "다단 구성",
  freeformSection: "자유 배치",
};

const blockIcons: Record<BlockType, typeof PanelTop> = {
  hero: PanelTop,
  features: Rows3,
  about: GalleryHorizontal,
  services: BriefcaseBusiness,
  portfolio: Images,
  collectionList: Rows3,
  collectionDetail: FileQuestion,
  testimonials: MessageSquareQuote,
  pricing: BadgeDollarSign,
  faq: FileQuestion,
  cta: MousePointerClick,
  contact: Mail,
  footer: Footprints,
  customSection: LayoutTemplate,
  containerSection: Rows3,
  gridSection: GalleryHorizontal,
  columnsSection: Images,
  freeformSection: MousePointerClick,
};

export function LeftSidebar() {
  const addBlock = useEditorStore((state) => state.addBlock);

  return (
    <aside className="h-full overflow-auto border-r border-slate-200/80 bg-slate-50/80 p-4">
      <Tabs defaultValue="pages">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent className="grid gap-5" value="pages">
          <PagesPanel />
          <ReferencePackGallery />
          <FeatureKitPanel />
          <SiteTemplateGallery />
          <NavigationPanel />
          <AISiteWizard />
        </TabsContent>

        <TabsContent className="grid gap-5" value="blocks">
          <PatternLibraryPanel />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate size={16} />
                블록 추가
              </CardTitle>
              <CardDescription>현재 페이지에 필요한 섹션을 추가합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map((type) => {
                  const Icon = blockIcons[type];

                  return (
                    <button
                      className="group rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
                      key={type}
                      onClick={() => addBlock(type)}
                      type="button"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                        <Icon size={17} />
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-slate-950">
                        {blockLabels[type]}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {blockDescriptions[type]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="grid gap-5" value="elements">
          <ElementLibraryPanel />
        </TabsContent>

        <TabsContent className="grid gap-5" value="layers">
          <LayerTreePanel />
        </TabsContent>

        <TabsContent className="grid gap-5" value="header">
          <HeaderBuilderPanel />
        </TabsContent>

        <TabsContent value="style">
          <StylePackPanel />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
