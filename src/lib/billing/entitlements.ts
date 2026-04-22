import type { ProjectPaymentStatus } from "@/lib/project-repository";

export type PaidFeature = "publish" | "export";

export function canPublishProject(paymentStatus: ProjectPaymentStatus) {
  return paymentStatus === "PAID";
}

export function canExportReactProject(paymentStatus: ProjectPaymentStatus) {
  return paymentStatus === "PAID";
}

export function canRemoveWatermark(paymentStatus: ProjectPaymentStatus) {
  return paymentStatus === "PAID";
}

export function getPaymentRequiredMessage(feature: PaidFeature) {
  if (feature === "publish") {
    return "발행은 결제 완료 후 사용할 수 있습니다.";
  }

  return "React 프로젝트 ZIP 다운로드는 결제 완료 후 사용할 수 있습니다.";
}
