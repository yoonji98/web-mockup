"use client";

import { useState } from "react";
import { WandSparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { palettes } from "@/data/palettes";
import { useEditorStore } from "@/store/editor-store";
import type { Palette } from "@/types/page";

type PaletteSuggestion =
  | {
      mode: "system";
      paletteId: string;
      reason: string;
    }
  | {
      mode: "custom";
      customPalette: Palette;
      reason: string;
    };

export function AIPaletteSuggestButton() {
  const { page, saveCustomPalette, setPalette } = useEditorStore();
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState(page.industry ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<PaletteSuggestion | null>(null);
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("전문적인");

  const requestSuggestion = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/suggest-palette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPage: page,
          industry,
          targetAudience,
          tone,
        }),
      });
      const data = (await response.json()) as PaletteSuggestion | { error?: string };

      if (!response.ok || !("mode" in data)) {
        throw new Error("error" in data && data.error ? data.error : "AI 팔레트 추천에 실패했습니다.");
      }

      setSuggestion(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI 팔레트 추천 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = () => {
    if (!suggestion) {
      return;
    }

    if (suggestion.mode === "system") {
      const palette = palettes.find((item) => item.id === suggestion.paletteId);

      if (!palette) {
        setError("추천된 시스템 팔레트를 찾을 수 없습니다.");
        return;
      }

      setPalette(palette);
      return;
    }

    saveCustomPalette(suggestion.customPalette);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">AI 색상 추천</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">업종과 분위기에 맞는 색상 기반을 제안합니다.</p>
        </div>
        <Button onClick={() => setIsOpen((value) => !value)} size="sm" variant="outline">
          <WandSparkles size={14} />
          {isOpen ? "닫기" : "AI 추천"}
        </Button>
      </div>

      {isOpen ? (
        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            업종
            <Input onChange={(event) => setIndustry(event.target.value)} value={industry} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            분위기
            <Input onChange={(event) => setTone(event.target.value)} value={tone} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            타겟 고객
            <Input onChange={(event) => setTargetAudience(event.target.value)} value={targetAudience} />
          </label>
          {error ? <p className="text-sm leading-6 text-red-600">{error}</p> : null}
          <Button disabled={isLoading} onClick={requestSuggestion} variant="secondary">
            <WandSparkles size={15} />
            {isLoading ? "추천 중..." : "추천 받기"}
          </Button>

          {suggestion ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm leading-6 text-slate-700">{suggestion.reason}</p>
              <Badge className="mt-3" variant="blue">
                {suggestion.mode === "system"
                  ? `시스템 팔레트: ${suggestion.paletteId}`
                  : `커스텀 팔레트: ${suggestion.customPalette.name}`}
              </Badge>
              <Button className="mt-3 w-full" onClick={applySuggestion}>
                적용하기
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
