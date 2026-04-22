"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Copy,
  FileText,
  Home,
  Images,
  Landmark,
  Plus,
  Trash2,
} from "lucide-react";

import { PageCreateDialog } from "@/components/editor/PageCreateDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ensureUniquePageSlug, makeSlug } from "@/lib/site-data";
import { useEditorStore } from "@/store/editor-store";
import { sitePageTypes, type SitePage, type SitePageType } from "@/types/page";

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

const pageTypeIcons: Record<SitePageType, typeof FileText> = {
  home: Home,
  landing: Landmark,
  about: FileText,
  services: BriefcaseBusiness,
  portfolio: Images,
  pricing: FileText,
  contact: FileText,
  blog: FileText,
  product: FileText,
  custom: FileText,
};

export function PagesPanel() {
  const {
    addPage,
    currentPageId,
    duplicatePage,
    removePage,
    setCurrentPage,
    site,
    updatePage,
  } = useEditorStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const currentPage = useMemo(
    () => site.pages.find((page) => page.id === currentPageId) ?? site.pages[0],
    [currentPageId, site.pages],
  );
  const slugPreview = currentPage
    ? ensureUniquePageSlug(currentPage.slug, site.pages, currentPage.id)
    : "";
  const hasSlugIssue = currentPage ? makeSlug(currentPage.slug) !== currentPage.slug : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Pages</CardTitle>
            <CardDescription>다중 페이지 웹사이트 구조를 관리합니다.</CardDescription>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} size="icon" variant="outline">
            <Plus size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {site.pages.map((page) => (
          <PageListItem
            active={page.id === currentPageId}
            key={page.id}
            onDuplicate={() => duplicatePage(page.id)}
            onRemove={() => removePage(page.id)}
            onSelect={() => setCurrentPage(page.id)}
            page={page}
          />
        ))}

        {currentPage ? (
          <div className="mt-2 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">현재 페이지 설정</p>
              <p className="mt-1 text-xs text-slate-500">제목과 URL slug는 즉시 반영됩니다.</p>
            </div>
            <label className="grid gap-2 text-xs font-semibold text-slate-600">
              Title
              <Input
                onChange={(event) => updatePage(currentPage.id, { title: event.target.value })}
                value={currentPage.title}
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold text-slate-600">
              Slug
              <Input
                onChange={(event) => updatePage(currentPage.id, { slug: event.target.value })}
                value={currentPage.slug}
              />
            </label>
            {hasSlugIssue ? (
              <p className="text-xs leading-5 text-amber-600">
                저장 시 `{slugPreview}` 형태로 정리됩니다.
              </p>
            ) : null}
            <label className="grid gap-2 text-xs font-semibold text-slate-600">
              Type
              <Select
                disabled={currentPage.type === "home"}
                onChange={(event) =>
                  updatePage(currentPage.id, { type: event.target.value as SitePageType })
                }
                value={currentPage.type}
              >
                {sitePageTypes.map((pageType) => (
                  <option key={pageType} value={pageType}>
                    {pageTypeLabels[pageType]}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        ) : null}
      </CardContent>
      <PageCreateDialog
        onCreate={addPage}
        onOpenChange={setIsCreateOpen}
        open={isCreateOpen}
      />
    </Card>
  );
}

type PageListItemProps = {
  active: boolean;
  onDuplicate: () => void;
  onRemove: () => void;
  onSelect: () => void;
  page: SitePage;
};

function PageListItem({ active, onDuplicate, onRemove, onSelect, page }: PageListItemProps) {
  const Icon = pageTypeIcons[page.type];
  const isHome = page.type === "home";

  return (
    <article
      className={`rounded-2xl border p-3 transition ${
        active
          ? "border-blue-300 bg-blue-50 shadow-sm ring-4 ring-blue-500/10"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <button className="w-full text-left" onClick={onSelect} type="button">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
            <Icon size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-slate-950">{page.title}</span>
              {isHome ? <Badge variant="green">Home</Badge> : null}
            </span>
            <span className="mt-1 block truncate text-xs text-slate-500">
              /{isHome ? "" : page.slug}
            </span>
          </span>
        </div>
      </button>
      <div className="mt-3 flex gap-2">
        <Button className="flex-1" onClick={onDuplicate} size="sm" variant="outline">
          <Copy size={14} />
          복제
        </Button>
        <Button
          className="flex-1"
          disabled={isHome}
          onClick={onRemove}
          size="sm"
          variant="ghost"
        >
          <Trash2 size={14} />
          삭제
        </Button>
      </div>
    </article>
  );
}
