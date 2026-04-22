"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { PricingModal } from "@/components/billing/PricingModal";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { canExportReactProject } from "@/lib/billing/entitlements";
import { useEditorStore } from "@/store/editor-store";

function readFileNameFromDisposition(disposition: string | null) {
  const match = disposition?.match(/filename="([^"]+)"/);

  return match?.[1] ?? "my-landing-page.zip";
}

export function ExportReactProjectButton() {
  const page = useEditorStore((state) => state.page);
  const paymentStatus = useEditorStore((state) => state.paymentStatus);
  const setPaymentStatus = useEditorStore((state) => state.setPaymentStatus);
  const site = useEditorStore((state) => state.site);
  const defaultProjectName = useMemo(
    () => site.slug ?? page.slug ?? site.name ?? "my-landing-page",
    [page.slug, site.name, site.slug],
  );
  const [error, setError] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [projectName, setProjectName] = useState(defaultProjectName);

  const openExportDialog = () => {
    setError(null);

    if (!canExportReactProject(paymentStatus)) {
      setIsPricingOpen(true);
      return;
    }

    setProjectName(defaultProjectName);
    setIsExportOpen(true);
  };

  const exportProject = async () => {
    const nextProjectName = projectName.trim();

    if (!nextProjectName) {
      setError("프로젝트 이름을 입력하세요.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/export/react-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site,
          projectName: nextProjectName,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;

        throw new Error(payload?.error ?? "React 프로젝트 export에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = readFileNameFromDisposition(response.headers.get("Content-Disposition"));
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setIsExportOpen(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <Button disabled={isLoading} onClick={openExportDialog} variant="secondary">
          <Download size={15} />
          {isLoading ? "Export 중..." : "React 프로젝트 Export"}
        </Button>
        {error && !isExportOpen ? <p className="max-w-52 text-xs leading-5 text-red-600">{error}</p> : null}
      </div>

      <Dialog
        description="export될 Vite React 프로젝트 이름을 입력하세요."
        footer={
          <div className="grid gap-2 sm:flex sm:justify-end">
            <Button disabled={isLoading} onClick={() => setIsExportOpen(false)} variant="secondary">
              취소
            </Button>
            <Button disabled={isLoading} onClick={exportProject}>
              <Download size={15} />
              {isLoading ? "생성 중..." : "ZIP 다운로드"}
            </Button>
          </div>
        }
        onOpenChange={setIsExportOpen}
        open={isExportOpen}
        title="React 프로젝트 Export"
      >
        <div className="grid gap-3">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>프로젝트 이름</span>
            <Input
              autoFocus
              onChange={(event) => setProjectName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void exportProject();
                }
              }}
              value={projectName}
            />
          </label>
          {error ? <p className="rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-600">{error}</p> : null}
        </div>
      </Dialog>

      <PricingModal
        feature="export"
        onClose={() => setIsPricingOpen(false)}
        onMockPaid={() => {
          setPaymentStatus("PAID");
          setIsPricingOpen(false);
          setProjectName(defaultProjectName);
          setIsExportOpen(true);
        }}
        open={isPricingOpen}
      />
    </>
  );
}
