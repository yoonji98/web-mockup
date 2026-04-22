import {
  MissingBillingSecretError,
  type BillingProvider,
  type BillingProviderName,
} from "@/lib/billing/provider";

const providerName: BillingProviderName = "toss";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new MissingBillingSecretError(providerName, name);
  }

  return value;
}

export function createTossBillingProvider(): BillingProvider {
  return {
    name: providerName,
    async createCheckout(input) {
      requireEnv("TOSS_SECRET_KEY");
      requireEnv("NEXT_PUBLIC_TOSS_CLIENT_KEY");

      const params = new URLSearchParams({
        amount: String(input.amount),
        currency: input.currency,
        projectId: input.projectId,
      });

      return {
        provider: providerName,
        checkoutUrl: input.successUrl ?? `/editor?checkout=toss-mock&${params.toString()}`,
        paymentId: `toss-${input.projectId}`,
      };
    },
    async confirmPayment(input) {
      requireEnv("TOSS_SECRET_KEY");

      return {
        projectId: input.projectId,
        status: "PAID",
        externalPaymentKey: input.paymentKey ?? input.orderId,
      };
    },
  };
}
