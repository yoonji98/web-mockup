"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LandingPreview } from "@/components/blocks/landing-preview";
import { canRemoveWatermark } from "@/lib/billing/entitlements";
import { getPublishedProjectBySlug, type PublishedProject } from "@/lib/project-repository";

type PublishedProjectClientProps = {
  slug: string;
};

export function PublishedProjectClient({ slug }: PublishedProjectClientProps) {
  const [project, setProject] = useState<PublishedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getPublishedProjectBySlug(slug).then((publishedProject) => {
      if (!isMounted) {
        return;
      }

      setProject(publishedProject);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-sm font-medium text-slate-500">발행 페이지를 불러오는 중입니다.</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">/site/{slug}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            발행된 페이지를 찾을 수 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            현재 v1 발행 데이터는 이 브라우저의 localStorage에 저장됩니다.
          </p>
          <Link
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            href="/editor"
          >
            에디터로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const showWatermark = !canRemoveWatermark(project.paymentStatus);

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="truncate text-sm font-medium text-slate-600">
            공개 URL 미리보기: /site/{project.slug}
          </p>
          <Link
            className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            href="/editor"
          >
            에디터로 돌아가기
          </Link>
        </div>
      </div>
      <div className="relative">
        <LandingPreview pageData={project.page} />
        {showWatermark ? (
          <div className="pointer-events-none fixed bottom-4 right-4 rounded-md bg-slate-950/85 px-3 py-2 text-xs font-semibold text-white shadow-lg">
            Built with Landing Studio
          </div>
        ) : null}
      </div>
    </main>
  );
}
