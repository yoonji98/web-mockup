"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { getPaymentRequiredMessage, type PaidFeature } from "@/lib/billing/entitlements";

type PricingModalProps = {
  feature: PaidFeature;
  open: boolean;
  onClose: () => void;
  onMockPaid: () => void;
};

const featureLabels: Record<PaidFeature, string> = {
  publish: "발행",
  export: "다운로드",
};

export function PricingModal({ feature, onClose, onMockPaid, open }: PricingModalProps) {
  return (
    <Dialog
      description={getPaymentRequiredMessage(feature)}
      footer={
        <div className="grid gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <Button onClick={onClose} variant="secondary">
            나중에
          </Button>
          <Button onClick={onMockPaid}>결제 완료로 설정</Button>
        </div>
      }
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
      title={`${featureLabels[feature]} 기능 잠금 해제`}
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <Badge variant="blue">Pro 플랜</Badge>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-bold text-slate-950">49,000원</span>
          <span className="pb-1 text-sm text-slate-500">프로젝트당</span>
        </div>
        <ul className="mt-5 grid gap-3 text-sm text-slate-600">
          {["발행 URL 생성", "Vite React 프로젝트 ZIP export", "워터마크 제거"].map((item) => (
            <li className="flex items-center gap-2" key={item}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Check size={13} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
