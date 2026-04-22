"use client";

import { LayoutTemplate } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteTemplates } from "@/data/site-templates";
import { createSiteDataFromTemplate } from "@/lib/site-template";
import { useEditorStore } from "@/store/editor-store";
import type { SiteTemplate } from "@/types/template";

export function SiteTemplateGallery() {
  const { isDirty, setSite } = useEditorStore();

  const applyTemplate = (template: SiteTemplate) => {
    if (isDirty && !window.confirm("현재 작업을 템플릿으로 덮어쓸까요?")) {
      return;
    }

    setSite(createSiteDataFromTemplate(template));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutTemplate size={16} />
          Templates
        </CardTitle>
        <CardDescription>웹사이트 목적에 맞는 다중 페이지 구조를 시작점으로 선택합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {siteTemplates.map((template) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            key={template.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{template.name}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{template.description}</p>
              </div>
              <Badge variant="blue">{template.pages.length}p</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {template.moodTags.map((tag) => (
                <Badge key={tag} variant="slate">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">Preview</p>
              <p className="mt-1 text-xs leading-5 text-slate-700">
                {template.pages.map((page) => page.title).join(" / ")}
              </p>
            </div>
            <Button className="mt-3 w-full" onClick={() => applyTemplate(template)} variant="outline">
              템플릿 적용
            </Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
