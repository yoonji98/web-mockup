"use client";

import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { featureKits } from "@/data/feature-kits";
import { pageCatalog } from "@/data/page-catalog";
import { stylePacks } from "@/data/style-packs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/store/editor-store";
import type { FeatureKit } from "@/types/feature-kit";
import type { PageDefinition, PageDefinitionCategory } from "@/types/page-catalog";
import type { SiteData, SiteType } from "@/types/page";

type PageCount = "one-page" | "small-site" | "full-site";
type LoginButtonMode = "auto" | "include" | "hide";
type MenuMode = "auto" | "anchor" | "multi-page";
type GenerationLevel = "beautiful-website" | "clickable-prototype" | "frontend-scaffold" | "full-stack";

const steps = ["종류", "수준", "기능", "페이지", "스타일", "생성"] as const;

const siteTypeOptions: Array<{ label: string; value: SiteType }> = [
  { label: "랜딩페이지", value: "landing" },
  { label: "회사/매장", value: "business" },
  { label: "포트폴리오", value: "portfolio" },
  { label: "SaaS / 웹앱", value: "saas" },
  { label: "블로그 / 콘텐츠", value: "content" },
  { label: "커뮤니티", value: "community" },
  { label: "공공기관", value: "government" },
  { label: "관리자 대시보드", value: "admin" },
  { label: "카페/식당", value: "cafe" },
  { label: "병원/클리닉", value: "clinic" },
  { label: "강의/코칭", value: "education" },
  { label: "에이전시", value: "agency" },
  { label: "쇼핑몰", value: "shop" },
  { label: "크리에이터", value: "creator" },
];

const generationLevelOptions: Array<{ description: string; label: string; value: GenerationLevel }> = [
  { label: "예쁜 웹사이트", value: "beautiful-website", description: "정적 페이지와 브랜드 톤을 우선 구성" },
  { label: "클릭 가능한 프로토타입", value: "clickable-prototype", description: "라우트와 화면 흐름을 확인" },
  { label: "React 프론트엔드 프로젝트", value: "frontend-scaffold", description: "mock data 기반 스캐폴드 준비" },
  { label: "풀스택 스타터 준비", value: "full-stack", description: "인증, 결제, DB 필요성을 함께 표시" },
];

const pageCountOptions: Array<{ description: string; label: string; value: PageCount }> = [
  { label: "한 페이지", value: "one-page", description: "단일 랜딩페이지" },
  { label: "작은 사이트", value: "small-site", description: "3~5페이지" },
  { label: "전체 사이트", value: "full-site", description: "5~8페이지" },
];

const toneOptions = ["전문적인", "미니멀한", "따뜻한", "고급스러운", "트렌디한", "강렬한", "공공 신뢰형"];

const loginButtonOptions: Array<{ description: string; label: string; value: LoginButtonMode }> = [
  { label: "자동 판단", value: "auto", description: "사이트 목적에 맞춰 결정" },
  { label: "로그인 포함", value: "include", description: "상단에 로그인 버튼 추가" },
  { label: "숨김", value: "hide", description: "CTA만 사용" },
];

const menuModeOptions: Array<{ description: string; label: string; value: MenuMode }> = [
  { label: "자동 메뉴", value: "auto", description: "페이지 구조에 맞춰 생성" },
  { label: "앵커 메뉴", value: "anchor", description: "한 페이지 섹션 이동" },
  { label: "다중 페이지", value: "multi-page", description: "페이지별 경로 메뉴" },
];

const categoryBySiteType: Record<SiteType, PageDefinitionCategory[]> = {
  agency: ["company", "portfolio", "global"],
  admin: ["admin", "global"],
  business: ["company", "global"],
  cafe: ["company", "global"],
  clinic: ["company", "global"],
  community: ["community", "global"],
  content: ["content", "global"],
  creator: ["portfolio", "content", "global"],
  education: ["company", "content", "global"],
  government: ["government", "global"],
  landing: ["saas", "company", "global"],
  portfolio: ["portfolio", "global"],
  saas: ["saas", "global"],
  shop: ["commerce", "global"],
};

const defaultRequiredPageIds: Record<SiteType, string[]> = {
  agency: ["company-home", "company-services", "company-contact"],
  admin: ["admin-dashboard", "admin-users", "admin-settings"],
  business: ["company-home", "company-about", "company-contact"],
  cafe: ["company-home", "company-services", "global-contact"],
  clinic: ["company-home", "company-services", "global-contact"],
  community: ["community-feed", "community-post-detail", "community-profile"],
  content: ["content-home", "content-post-list", "content-post-detail"],
  creator: ["portfolio-home", "portfolio-about", "portfolio-contact"],
  education: ["company-home", "company-services", "global-contact"],
  government: ["government-about", "government-policy", "government-notices"],
  landing: ["saas-landing"],
  portfolio: ["portfolio-home", "portfolio-project-list", "portfolio-contact"],
  saas: ["saas-landing", "saas-features", "saas-pricing"],
  shop: ["global-home", "commerce-category-list", "commerce-product-detail"],
};

export function AISiteWizard() {
  const isDirty = useEditorStore((state) => state.isDirty);
  const setSite = useEditorStore((state) => state.setSite);
  const [businessName, setBusinessName] = useState("Landing Studio");
  const [error, setError] = useState<string | null>(null);
  const [generationLevel, setGenerationLevel] = useState<GenerationLevel>("clickable-prototype");
  const [goal, setGoal] = useState("문의 전환");
  const [industry, setIndustry] = useState("AI 웹사이트 빌더");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSite, setLastSite] = useState<SiteData | null>(null);
  const [loginButtonMode, setLoginButtonMode] = useState<LoginButtonMode>("auto");
  const [menuMode, setMenuMode] = useState<MenuMode>("auto");
  const [pageCount, setPageCount] = useState<PageCount>("small-site");
  const [selectedFeatureKitIds, setSelectedFeatureKitIds] = useState<string[]>(["support-kit", "legal-kit"]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [siteType, setSiteType] = useState<SiteType>("business");
  const [stepIndex, setStepIndex] = useState(0);
  const [stylePackId, setStylePackId] = useState(stylePacks[0]?.id ?? "");
  const [targetAudience, setTargetAudience] = useState("초기 스타트업과 마케팅 팀");
  const [tone, setTone] = useState("전문적인");

  const selectedFeatureKits = useMemo(
    () => selectedFeatureKitIds.map((id) => featureKits.find((kit) => kit.id === id)).filter(isFeatureKit),
    [selectedFeatureKitIds],
  );
  const pagePlan = useMemo(
    () => buildPagePlan(siteType, pageCount, selectedFeatureKits, selectedPageIds),
    [pageCount, selectedFeatureKits, selectedPageIds, siteType],
  );
  const selectedStylePack = stylePacks.find((stylePack) => stylePack.id === stylePackId) ?? stylePacks[0];

  const generate = async () => {
    if (isDirty && !window.confirm("현재 작업을 AI 생성 결과로 덮어쓸까요?")) {
      return;
    }

    const finalPageIds = pagePlan.selected.map((page) => page.id);
    const requiredFeatureKeys = Array.from(
      new Set(selectedFeatureKits.flatMap((featureKit) => featureKit.requiredFeatureKeys ?? [])),
    );

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/generate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          generationLevel,
          goal,
          industry,
          loginButtonMode,
          menuMode,
          pageCount,
          requiredFeatureKeys,
          selectedFeatureKitIds,
          selectedPageIds: finalPageIds,
          siteType,
          stylePackId: selectedStylePack?.id,
          stylePreference: selectedStylePack?.name,
          targetAudience,
          tone,
        }),
      });
      const payload = (await response.json()) as { error?: string; site?: SiteData; warning?: string };

      if (!response.ok || !payload.site) {
        throw new Error(payload.error ?? "AI 웹사이트 생성에 실패했습니다.");
      }

      setSite(payload.site);
      setLastSite(payload.site);
      setStepIndex(5);
      setError(payload.warning ?? null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={16} />
          AI Site Wizard
        </CardTitle>
        <CardDescription>Page Catalog와 Feature Kit을 기준으로 SiteData 초안을 만듭니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-1">
          {steps.map((step, index) => (
            <span
              className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-blue-600" : "bg-slate-200"}`}
              key={step}
            />
          ))}
        </div>

        {stepIndex === 0 ? (
          <div className="grid gap-4">
            <OptionGrid
              options={siteTypeOptions}
              selected={siteType}
              onSelect={(value) => {
                setSiteType(value as SiteType);
                setSelectedPageIds([]);
              }}
            />
            <div className="grid gap-3">
              <Input onChange={(event) => setBusinessName(event.target.value)} value={businessName} />
              <Input onChange={(event) => setIndustry(event.target.value)} value={industry} />
              <Textarea onChange={(event) => setTargetAudience(event.target.value)} value={targetAudience} />
              <Input onChange={(event) => setGoal(event.target.value)} value={goal} />
            </div>
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid gap-4">
            <OptionGrid
              options={generationLevelOptions}
              selected={generationLevel}
              onSelect={(value) => setGenerationLevel(value as GenerationLevel)}
            />
            <OptionGrid
              options={pageCountOptions}
              selected={pageCount}
              onSelect={(value) => setPageCount(value as PageCount)}
            />
            <OptionGrid
              options={menuModeOptions}
              selected={menuMode}
              onSelect={(value) => setMenuMode(value as MenuMode)}
            />
            <OptionGrid
              options={loginButtonOptions}
              selected={loginButtonMode}
              onSelect={(value) => setLoginButtonMode(value as LoginButtonMode)}
            />
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="grid gap-2">
            {featureKits.map((featureKit) => (
              <ToggleCard
                active={selectedFeatureKitIds.includes(featureKit.id)}
                key={featureKit.id}
                onToggle={() =>
                  setSelectedFeatureKitIds((ids) =>
                    ids.includes(featureKit.id)
                      ? ids.filter((id) => id !== featureKit.id)
                      : [...ids, featureKit.id],
                  )
                }
                title={featureKit.name}
              >
                <p className="mt-1 text-xs leading-5 text-slate-500">{featureKit.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="slate">{featureKit.category}</Badge>
                  <Badge variant="slate">복잡도 {featureKit.complexity}</Badge>
                </div>
              </ToggleCard>
            ))}
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="grid gap-4">
            <PageGroup title="Required" pages={pagePlan.required} locked />
            <PageGroup
              onToggle={(pageId) => togglePageId(pageId, setSelectedPageIds)}
              pages={pagePlan.recommended}
              selectedPageIds={selectedPageIds}
              title="Recommended"
            />
            <PageGroup
              onToggle={(pageId) => togglePageId(pageId, setSelectedPageIds)}
              pages={pagePlan.optional}
              selectedPageIds={selectedPageIds}
              title="Optional"
            />
          </div>
        ) : null}

        {stepIndex === 4 ? (
          <div className="grid gap-4">
            <OptionGrid
              options={toneOptions.map((option) => ({ label: option, value: option }))}
              selected={tone}
              onSelect={setTone}
            />
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              StylePack
              <Select onChange={(event) => setStylePackId(event.target.value)} value={stylePackId}>
                {stylePacks.map((stylePack) => (
                  <option key={stylePack.id} value={stylePack.id}>
                    {stylePack.name}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        ) : null}

        {stepIndex === 5 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">생성 요약</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="blue">{siteTypeOptions.find((option) => option.value === siteType)?.label}</Badge>
              <Badge variant="green">{generationLevel}</Badge>
              <Badge variant="slate">{pagePlan.selected.length} pages</Badge>
              <Badge variant="slate">{tone}</Badge>
            </div>
            {lastSite ? (
              <p className="mt-3 text-xs leading-5 text-slate-600">
                {lastSite.pages.length}개 페이지 생성 완료: {lastSite.pages.map((page) => page.title).join(", ")}
              </p>
            ) : (
              <p className="mt-3 text-xs leading-5 text-slate-600">
                선택 페이지: {pagePlan.selected.map((page) => page.name).join(", ")}
              </p>
            )}
          </div>
        ) : null}

        {error ? <p className="rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={stepIndex === 0 || isLoading}
            onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
            variant="outline"
          >
            이전
          </Button>
          {stepIndex < 5 ? (
            <Button
              className="flex-1"
              disabled={isLoading}
              onClick={() => setStepIndex((index) => Math.min(5, index + 1))}
            >
              다음
            </Button>
          ) : (
            <Button className="flex-1" disabled={isLoading} onClick={generate}>
              {isLoading ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}
              {lastSite ? "다시 생성" : "AI 생성"}
            </Button>
          )}
        </div>

        {stepIndex < 5 ? (
          <Button disabled={isLoading} onClick={generate} variant="secondary">
            {isLoading ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}
            현재 선택으로 생성
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

type OptionGridProps = {
  onSelect: (value: string) => void;
  options: Array<{ description?: string; label: string; value: string }>;
  selected: string;
};

function OptionGrid({ onSelect, options, selected }: OptionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          className={`rounded-2xl border p-3 text-left transition ${
            selected === option.value
              ? "border-blue-400 bg-blue-50 ring-4 ring-blue-500/10"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
          key={option.value}
          onClick={() => onSelect(option.value)}
          type="button"
        >
          <span className="block text-sm font-semibold text-slate-950">{option.label}</span>
          {option.description ? (
            <span className="mt-1 block text-xs leading-5 text-slate-500">{option.description}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function ToggleCard({
  active,
  children,
  onToggle,
  title,
}: {
  active: boolean;
  children: ReactNode;
  onToggle: () => void;
  title: string;
}) {
  return (
    <button
      className={`rounded-2xl border p-3 text-left transition ${
        active ? "border-blue-400 bg-blue-50 ring-4 ring-blue-500/10" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
      onClick={onToggle}
      type="button"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-950">{title}</span>
        <Badge variant={active ? "blue" : "slate"}>{active ? "선택됨" : "선택"}</Badge>
      </span>
      {children}
    </button>
  );
}

function PageGroup({
  locked = false,
  onToggle,
  pages,
  selectedPageIds = [],
  title,
}: {
  locked?: boolean;
  onToggle?: (pageId: string) => void;
  pages: PageDefinition[];
  selectedPageIds?: string[];
  title: string;
}) {
  if (pages.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <p className="text-xs font-semibold uppercase text-slate-500">{title}</p>
      {pages.map((page) => {
        const active = locked || selectedPageIds.includes(page.id);

        return (
          <button
            className={`rounded-2xl border p-3 text-left transition ${
              active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
            disabled={locked}
            key={page.id}
            onClick={() => onToggle?.(page.id)}
            type="button"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-950">{page.name}</span>
              <Badge variant={page.requires?.length ? "red" : "slate"}>{page.pageKind}</Badge>
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{page.routePattern}</span>
          </button>
        );
      })}
    </div>
  );
}

function buildPagePlan(
  siteType: SiteType,
  pageCount: PageCount,
  selectedFeatureKits: FeatureKit[],
  selectedPageIds: string[],
) {
  const requiredIds = new Set([
    ...defaultRequiredPageIds[siteType],
    ...selectedFeatureKits.flatMap((kit) => kit.includedPageIds),
  ]);
  const recommendedIds = new Set(selectedFeatureKits.flatMap((kit) => kit.recommendedPageIds ?? []));
  const categories = categoryBySiteType[siteType];
  const recommendedLimit = pageCount === "one-page" ? 0 : pageCount === "small-site" ? 4 : 8;
  const categoryMatches = pageCatalog
    .filter((page) => categories.includes(page.category) && !requiredIds.has(page.id))
    .slice(0, recommendedLimit);

  categoryMatches.forEach((page) => recommendedIds.add(page.id));
  selectedPageIds.forEach((pageId) => recommendedIds.add(pageId));

  const required = pageCatalog.filter((page) => requiredIds.has(page.id));
  const recommended = pageCatalog.filter((page) => recommendedIds.has(page.id) && !requiredIds.has(page.id));
  const optional = pageCatalog
    .filter((page) => categories.includes(page.category) && !requiredIds.has(page.id) && !recommendedIds.has(page.id))
    .slice(0, 6);
  const selected = uniquePages([
    ...required,
    ...recommended.filter((page) => selectedPageIds.includes(page.id) || selectedFeatureKits.some((kit) => kit.recommendedPageIds?.includes(page.id))),
  ]);

  return {
    optional,
    recommended,
    required,
    selected: selected.length > 0 ? selected : required,
  };
}

function togglePageId(pageId: string, setSelectedPageIds: Dispatch<SetStateAction<string[]>>) {
  setSelectedPageIds((ids) => (ids.includes(pageId) ? ids.filter((id) => id !== pageId) : [...ids, pageId]));
}

function uniquePages(pages: PageDefinition[]) {
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.id)) {
      return false;
    }

    seen.add(page.id);
    return true;
  });
}

function isFeatureKit(value: FeatureKit | undefined): value is FeatureKit {
  return Boolean(value);
}
