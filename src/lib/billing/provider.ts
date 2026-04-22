import { createStripeBillingProvider } from "@/lib/billing/stripe";
import { createTossBillingProvider } from "@/lib/billing/toss";

export type BillingProviderName = "toss" | "stripe";

export type CreateCheckoutInput = {
  projectId: string;
  amount: number;
  currency: string;
  successUrl?: string;
  failUrl?: string;
};

export type CreateCheckoutResult = {
  provider: BillingProviderName;
  checkoutUrl: string;
  paymentId?: string;
  externalPaymentKey?: string;
};

export type ConfirmPaymentInput = {
  projectId: string;
  paymentKey?: string;
  orderId?: string;
  amount?: number;
};

export type ConfirmPaymentResult = {
  projectId: string;
  status: "PAID";
  externalPaymentKey?: string;
};

export interface BillingProvider {
  name: BillingProviderName;
  createCheckout: (input: CreateCheckoutInput) => Promise<CreateCheckoutResult>;
  confirmPayment: (input: ConfirmPaymentInput) => Promise<ConfirmPaymentResult>;
}

export class MissingBillingSecretError extends Error {
  constructor(provider: BillingProviderName, envName: string) {
    super(`${provider} 결제 설정에 필요한 ${envName} 환경변수가 없습니다.`);
    this.name = "MissingBillingSecretError";
  }
}

export function readBillingProviderName(): BillingProviderName {
  return process.env.BILLING_PROVIDER === "stripe" ? "stripe" : "toss";
}

export function getBillingProvider(): BillingProvider {
  const providerName = readBillingProviderName();

  if (providerName === "stripe") {
    return createStripeBillingProvider();
  }

  return createTossBillingProvider();
}
