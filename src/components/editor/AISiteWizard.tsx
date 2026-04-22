"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/store/editor-store";
import type { SiteData, SiteType } from "@/types/page";

type PageCount = "one-page" | "small-site" | "full-site";
type LoginButtonMode = "auto" | "include" | "hide";
type MenuMode = "auto" | "anchor" | "multi-page";

const steps = ["종류", "정보", "규모", "톤", "생성"] as const;

const siteTypeOptions: Array<{ label: string; value: SiteType }> = [
  { label: "랜딩페이지", value: "landing" },
  { label: "회사/매장", value: "business" },
  { label: "포트폴리오", value: "portfolio" },
  { label: "카페/식당", value: "cafe" },
  { label: "병원/클리닉", value: "clinic" },
  { label: "강의/코칭", value: "education" },
  { label: "에이전시", value: "agency" },
  { label: "제품 소개", value: "shop" },
  { label: "크리에이터", value: "creator" },
];

const pageCountOptions: Array<{ description: string; label: string; value: PageCount }> = [
  { label: "한 페이지", value: "one-page", description: "단일 랜딩페이지" },
  { label: "작은 사이트", value: "small-site", description: "3~5페이지" },
  { label: "전체 사이트", value: "full-site", description: "5~8페이지" },
];

const toneOptions = ["감성적인", "미니멀한", "고급스러운", "전문적인", "따뜻한", "트렌디한", "강렬한"];

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

export function AISiteWizard() {
  const isDirty = useEditorStore((state) => state.isDirty);
  const setSite = useEditorStore((state) => state.setSite);
  const [businessName, setBusinessName] = useState("Landing Studio");
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState("문의 전환");
  const [industry, setIndustry] = useState("AI 웹사이트 빌더");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSite, setLastSite] = useState<SiteData | null>(null);
  const [loginButtonMode, setLoginButtonMode] = useState<LoginButtonMode>("auto");
  const [menuMode, setMenuMode] = useState<MenuMode>("auto");
  const [pageCount, setPageCount] = useState<PageCount>("small-site");
  const [siteType, setSiteType] = useState<SiteType>("business");
  const [stepIndex, setStepIndex] = useState(0);
  const [targetAudience, setTargetAudience] = useState("초기 스타트업과 마케팅 팀");
  const [tone, setTone] = useState("전문적인");

  const summary = useMemo(
    () => ({
      siteType: siteTypeOptions.find((option) => option.value === siteType)?.label ?? siteType,
      pageCount: pageCountOptions.find((option) => option.value === pageCount)?.label ?? pageCount,
    }),
    [pageCount, siteType],
  );

  const generate = async () => {
    if (isDirty && !window.confirm("현재 작업을 AI 생성 결과로 덮어쓸까요?")) {
      return;
    }

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
          goal,
          industry,
          loginButtonMode,
          menuMode,
          pageCount,
          siteType,
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
      setStepIndex(4);
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
        <CardDescription>SiteData JSON만 생성해 다중 페이지 웹사이트 초안을 만듭니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-1">
          {steps.map((step, index) => (
            <span
              className={`h-1.5 flex-1 rounded-full ${
                index <= stepIndex ? "bg-blue-600" : "bg-slate-200"
              }`}
              key={step}
            />
          ))}
        </div>

        {stepIndex === 0 ? (
          <OptionGrid
            options={siteTypeOptions}
            selected={siteType}
            onSelect={(value) => setSiteType(value as SiteType)}
          />
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid gap-3">
            <Input onChange={(event) => setBusinessName(event.target.value)} value={businessName} />
            <Input onChange={(event) => setIndustry(event.target.value)} value={industry} />
            <Textarea
              onChange={(event) => setTargetAudience(event.target.value)}
              value={targetAudience}
            />
            <Input onChange={(event) => setGoal(event.target.value)} value={goal} />
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="grid gap-4">
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

        {stepIndex === 3 ? (
          <OptionGrid
            options={toneOptions.map((option) => ({ label: option, value: option }))}
            selected={tone}
            onSelect={setTone}
          />
        ) : null}

        {stepIndex === 4 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">생성 요약</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="blue">{summary.siteType}</Badge>
              <Badge variant="slate">{summary.pageCount}</Badge>
              <Badge variant="green">{tone}</Badge>
            </div>
            {lastSite ? (
              <p className="mt-3 text-xs leading-5 text-slate-600">
                {lastSite.pages.length}개 페이지 생성 완료:{" "}
                {lastSite.pages.map((page) => page.title).join(", ")}
              </p>
            ) : null}
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
          {stepIndex < 4 ? (
            <Button
              className="flex-1"
              disabled={isLoading}
              onClick={() => setStepIndex((index) => Math.min(4, index + 1))}
            >
              다음
            </Button>
          ) : (
            <Button className="flex-1" disabled={isLoading} onClick={generate}>
              {isLoading ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}
              {lastSite ? "다른 스타일로 다시 생성" : "AI 생성"}
            </Button>
          )}
        </div>

        {stepIndex < 4 ? (
          <Button disabled={isLoading} onClick={generate} variant="secondary">
            {isLoading ? <Loader2 className="animate-spin" size={15} /> : <Sparkles size={15} />}
            바로 생성
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
          <span className="text-sm font-semibold text-slate-950">{option.label}</span>
          {option.description ? (
            <span className="mt-1 block text-xs text-slate-500">{option.description}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
