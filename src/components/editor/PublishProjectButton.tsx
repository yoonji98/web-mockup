"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, UploadCloud } from "lucide-react";

import { PricingModal } from "@/components/billing/PricingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { canPublishProject } from "@/lib/billing/entitlements";
import { isValidProjectSlug, normalizeProjectSlug, publishProject } from "@/lib/project-repository";
import { useEditorStore } from "@/store/editor-store";

export function PublishProjectButton() {
  const { page, paymentStatus, setPaymentStatus } = useEditorStore();
  const [error, setError] = useState<string | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [slug, setSlug] = useState(normalizeProjectSlug(page.slug ?? page.title));

  const openPublishModal = () => {
    if (!canPublishProject(paymentStatus)) {
      setIsPricingOpen(true);
      return;
    }

    setError(null);
    setSlug(normalizeProjectSlug(page.slug ?? page.title));
    setIsPublishOpen(true);
  };

  const markPaid = () => {
    setPaymentStatus("PAID");
    setIsPricingOpen(false);
    setError(null);
    setSlug(normalizeProjectSlug(page.slug ?? page.title));
    setIsPublishOpen(true);
  };

  const submitPublish = async () => {
    const nextSlug = slug.trim();

    if (!isValidProjectSlug(nextSlug)) {
      setError("Slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
      return;
    }

    setError(null);
    setIsPublishing(true);

    try {
      const publishedProject = await publishProject({
        page,
        paymentStatus,
        slug: nextSlug,
      });

      setPublishedSlug(publishedProject.slug);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "발행에 실패했습니다.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <Button onClick={openPublishModal}>
        <UploadCloud size={15} />
        발행하기
      </Button>

      <Dialog
        description="localStorage 기반 v1 발행 URL을 생성합니다."
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={() => setIsPublishOpen(false)} variant="secondary">
              닫기
            </Button>
            <Button disabled={isPublishing} onClick={submitPublish}>
              <UploadCloud size={15} />
              {isPublishing ? "발행 중..." : "발행"}
            </Button>
          </div>
        }
        onOpenChange={setIsPublishOpen}
        open={isPublishOpen}
        title="페이지 발행"
      >
        <Badge variant="blue">Published URL</Badge>
        <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="slug">
          Slug
        </label>
        <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="inline-flex items-center bg-slate-50 px-3 text-sm font-medium text-slate-500">
            /site/
          </span>
          <Input
            className="min-w-0 flex-1 rounded-none border-0 shadow-none focus:ring-0"
            id="slug"
            onChange={(event) => {
              setSlug(normalizeProjectSlug(event.target.value));
              setPublishedSlug(null);
            }}
            placeholder="my-landing-page"
            value={slug}
          />
        </div>

        {error ? <p className="mt-3 text-sm leading-6 text-red-600">{error}</p> : null}

        {publishedSlug ? (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">발행되었습니다.</p>
            <Link
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-900 underline underline-offset-4"
              href={`/site/${publishedSlug}`}
              target="_blank"
            >
              /site/{publishedSlug}
              <ExternalLink size={13} />
            </Link>
          </div>
        ) : null}
      </Dialog>

      <PricingModal
        feature="publish"
        onClose={() => setIsPricingOpen(false)}
        onMockPaid={markPaid}
        open={isPricingOpen}
      />
    </>
  );
}
