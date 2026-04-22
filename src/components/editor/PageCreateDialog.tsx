"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { sitePageTypes, type SitePageType } from "@/types/page";

type PageCreateDialogProps = {
  onCreate: (input: {
    includeStarterBlocks: boolean;
    slug?: string;
    title: string;
    type: SitePageType;
  }) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const pageTypeLabels: Record<SitePageType, string> = {
  home: "Home",
  landing: "Landing",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  pricing: "Pricing",
  contact: "Contact",
  blog: "Blog",
  product: "Product",
  custom: "Custom",
};

export function PageCreateDialog({ onCreate, onOpenChange, open }: PageCreateDialogProps) {
  const [includeStarterBlocks, setIncludeStarterBlocks] = useState(true);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("새 페이지");
  const [type, setType] = useState<SitePageType>("custom");

  const submit = () => {
    if (!title.trim()) {
      return;
    }

    onCreate({
      includeStarterBlocks,
      slug: slug.trim() || undefined,
      title,
      type,
    });
    setTitle("새 페이지");
    setSlug("");
    setType("custom");
    setIncludeStarterBlocks(true);
    onOpenChange(false);
  };

  return (
    <Dialog
      description="페이지 타입을 고르면 기본 블록 구성을 자동으로 넣을 수 있습니다."
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            취소
          </Button>
          <Button onClick={submit}>페이지 추가</Button>
        </div>
      }
      onOpenChange={onOpenChange}
      open={open}
      title="새 페이지 만들기"
    >
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          페이지 이름
          <Input onChange={(event) => setTitle(event.target.value)} value={title} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Slug
          <Input
            onChange={(event) => setSlug(event.target.value)}
            placeholder="자동 생성"
            value={slug}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          페이지 타입
          <Select
            onChange={(event) => setType(event.target.value as SitePageType)}
            value={type}
          >
            {sitePageTypes.map((pageType) => (
              <option key={pageType} value={pageType}>
                {pageTypeLabels[pageType]}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          <input
            checked={includeStarterBlocks}
            className="h-4 w-4 accent-blue-600"
            onChange={(event) => setIncludeStarterBlocks(event.target.checked)}
            type="checkbox"
          />
          기본 블록 자동 생성
        </label>
      </div>
    </Dialog>
  );
}
