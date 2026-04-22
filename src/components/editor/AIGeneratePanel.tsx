"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import type { Goal, PageData } from "@/types/page";

type AIGenerateFormValues = {
  businessName: string;
  goal: Goal;
  industry: string;
  palettePreference: string;
  targetAudience: string;
  tone: string;
};

const goalOptions: Array<{ label: string; value: Goal }> = [
  { label: "예약 받기", value: "reservation" },
  { label: "문의 받기", value: "lead" },
  { label: "상품 판매", value: "purchase" },
  { label: "회원가입", value: "signup" },
  { label: "앱 다운로드", value: "download" },
];

const toneOptions = ["감성적인", "미니멀한", "고급스러운", "귀여운", "전문적인", "트렌디한"];

export function AIGeneratePanel() {
  const { page, setPage } = useEditorStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register } = useForm<AIGenerateFormValues>({
    defaultValues: {
      businessName: page.title,
      goal: page.goal ?? "lead",
      industry: page.industry ?? "",
      palettePreference: "",
      targetAudience: "",
      tone: "전문적인",
    },
  });

  const submit = async (values: AIGenerateFormValues) => {
    if (
      page.blocks.length > 0 &&
      !window.confirm("현재 작업 중인 페이지를 AI 생성 결과로 덮어쓸까요?")
    ) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/generate-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as PageData | { error?: string };

      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "AI 생성에 실패했습니다.");
      }

      setPage(data as PageData);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles size={18} />
          </span>
          <div>
            <CardTitle>AI 페이지 생성</CardTitle>
            <CardDescription>브랜드 정보를 기반으로 PageData를 생성합니다.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            브랜드명
            <Input {...register("businessName", { required: true })} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            업종
            <Input {...register("industry", { required: true })} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            타겟 고객
            <Input {...register("targetAudience", { required: true })} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            목적
            <Select {...register("goal", { required: true })}>
              {goalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            분위기
            <Select {...register("tone", { required: true })}>
              {toneOptions.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            색상 취향
            <Input placeholder="예: 차분한 블루, 고급스러운 골드" {...register("palettePreference")} />
          </label>

          {error ? <p className="text-sm leading-6 text-red-600">{error}</p> : null}

          <Button className="w-full" disabled={isLoading} type="submit">
            <Sparkles size={16} />
            {isLoading ? "생성 중..." : "AI로 생성하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
