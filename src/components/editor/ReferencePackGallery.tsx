"use client";

import { useMemo, useState } from "react";
import { LayoutTemplate } from "lucide-react";

import { ReferencePackPreviewCard } from "@/components/editor/ReferencePackPreviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { findReferencePack, referencePacks } from "@/data/reference-packs";
import { useEditorStore } from "@/store/editor-store";

export function ReferencePackGallery() {
  const applyReferencePack = useEditorStore((state) => state.applyReferencePack);
  const isDirty = useEditorStore((state) => state.isDirty);
  const site = useEditorStore((state) => state.site);
  const startSiteFromReferencePack = useEditorStore((state) => state.startSiteFromReferencePack);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [keepCurrentStylePack, setKeepCurrentStylePack] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState(referencePacks[0]?.id ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const selectedPack = useMemo(
    () => findReferencePack(selectedPackId) ?? referencePacks[0] ?? null,
    [selectedPackId],
  );
  const hasExistingContent = useMemo(
    () =>
      isDirty ||
      site.pages.length > 1 ||
      site.pages.some((page) => page.blocks.length > 4) ||
      Boolean(site.referencePack?.id),
    [isDirty, site.pages, site.referencePack?.id],
  );

  function openPreview(packId: string) {
    setSelectedPackId(packId);
    setDialogOpen(true);
  }

  function applyToCurrentSite() {
    if (!selectedPack) {
      return;
    }

    if (
      hasExistingContent &&
      !window.confirm("현재 사이트 구조와 홈 구성이 Reference Pack 기준으로 바뀝니다. 계속할까요?")
    ) {
      return;
    }

    applyReferencePack(selectedPack.id, { preserveStylePack: keepCurrentStylePack });
    setDialogOpen(false);
    setStatus(`${selectedPack.name}을 현재 사이트에 적용했습니다.`);
  }

  function startNewSite() {
    if (!selectedPack) {
      return;
    }

    if (
      hasExistingContent &&
      !window.confirm("현재 작업 중인 사이트를 새 Reference Pack 사이트로 교체할까요?")
    ) {
      return;
    }

    startSiteFromReferencePack(selectedPack.id, { preserveStylePack: keepCurrentStylePack });
    setDialogOpen(false);
    setStatus(`${selectedPack.name} 기준 새 사이트를 시작했습니다.`);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate size={16} />
            Reference Packs
          </CardTitle>
          <CardDescription>스타일을 넘어서 header, navigation, home 구조까지 한 번에 바꿉니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {referencePacks.map((pack) => (
            <ReferencePackPreviewCard
              key={pack.id}
              onPreview={() => openPreview(pack.id)}
              pack={pack}
              selected={site.referencePack?.id === pack.id}
            />
          ))}
          {status ? <p className="rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-700">{status}</p> : null}
        </CardContent>
      </Card>

      {selectedPack ? (
        <Dialog
          className="max-w-3xl"
          description="현재 사이트에 바로 적용하거나, 이 구조를 기준으로 새 사이트를 시작할 수 있습니다."
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button disabled variant="ghost">
                헤더/네비만 적용 준비중
              </Button>
              <div className="flex gap-2">
                <Button onClick={startNewSite} variant="outline">
                  새 사이트로 시작
                </Button>
                <Button onClick={applyToCurrentSite}>현재 사이트에 적용</Button>
              </div>
            </div>
          }
          onOpenChange={setDialogOpen}
          open={dialogOpen}
          title={selectedPack.name}
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <ReferencePackPreviewCard detailed pack={selectedPack} />
            <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">적용 옵션</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  추천 StylePack을 같이 적용할지, 현재 색상/스타일을 유지할지 선택합니다.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <input
                  checked={keepCurrentStylePack}
                  className="mt-0.5"
                  onChange={(event) => setKeepCurrentStylePack(event.target.checked)}
                  type="checkbox"
                />
                <span className="grid gap-1">
                  <span className="font-semibold text-slate-950">현재 StylePack 유지</span>
                  <span className="text-xs leading-5 text-slate-500">
                    체크하면 현재 색상/스타일을 유지하고 header, navigation, typography, density만 Reference Pack 기준으로 맞춥니다.
                  </span>
                </span>
              </label>

              <div className="grid gap-2 rounded-xl bg-white p-3">
                <p className="text-xs font-semibold text-slate-500">적용 후 반영</p>
                <Bullet>Header 구조</Bullet>
                <Bullet>Navigation 구조</Bullet>
                <Bullet>Home page top blocks</Bullet>
                <Bullet>Typography / Density</Bullet>
                <Bullet>추천 metadata 저장</Bullet>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedPack.recommendedStylePackIds.map((stylePackId) => (
                  <Badge key={stylePackId} variant="green">
                    {stylePackId}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Dialog>
      ) : null}
    </>
  );
}

function Bullet({ children }: { children: string }) {
  return <p className="text-xs font-semibold text-slate-700">{children}</p>;
}
