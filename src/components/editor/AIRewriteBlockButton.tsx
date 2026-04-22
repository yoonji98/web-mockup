"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import type { Block } from "@/types/page";

type AIRewriteBlockButtonProps = {
  block: Block;
};

const quickInstructions = ["더 짧게", "더 감성적으로", "더 전문적으로", "CTA 강하게"];

export function AIRewriteBlockButton({ block }: AIRewriteBlockButtonProps) {
  const { page, updateBlock } = useEditorStore();
  const [customInstruction, setCustomInstruction] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const rewrite = async (instruction: string) => {
    if (!instruction.trim()) {
      setError("수정 요청을 입력하세요.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/rewrite-block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          block,
          instruction,
          pageContext: {
            goal: page.goal,
            industry: page.industry,
            title: page.title,
          },
        }),
      });
      const data = (await response.json()) as { error?: string; props?: Block["props"] };

      if (!response.ok || !data.props) {
        throw new Error(data.error ?? "AI 문구 수정에 실패했습니다.");
      }

      updateBlock(block.id, data.props);
      setCustomInstruction("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI 문구 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Sparkles size={15} />
        AI로 문구 다듬기
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickInstructions.map((instruction) => (
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            disabled={isLoading}
            key={instruction}
            onClick={() => rewrite(instruction)}
            type="button"
          >
            {instruction}
          </button>
        ))}
      </div>
      <Textarea
        className="mt-3 min-h-20"
        onChange={(event) => setCustomInstruction(event.target.value)}
        placeholder="예: 더 친근한 말투로 바꿔줘"
        value={customInstruction}
      />
      {error ? <p className="mt-2 text-sm leading-6 text-red-600">{error}</p> : null}
      <Button
        className="mt-3 w-full"
        disabled={isLoading}
        onClick={() => rewrite(customInstruction)}
        variant="secondary"
      >
        <Sparkles size={15} />
        {isLoading ? "수정 중..." : "직접 요청 적용"}
      </Button>
    </section>
  );
}
