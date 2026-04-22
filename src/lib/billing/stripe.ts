import {
  MissingBillingSecretError,
  type BillingProvider,
  type BillingProviderName,
} from "@/lib/billing/provider";

const providerName: BillingProviderName = "stripe";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new MissingBillingSecretError(providerName, name);
  }

  return value;
}

export function createStripeBillingProvider(): BillingProvider {
  return {
    name: providerName,
    async createCheckout(input) {
      requireEnv("STRIPE_SECRET_KEY");

      const params = new URLSearchParams({
        amount: String(input.amount),
        currency: input.currency,
        projectId: input.projectId,
      });

      return {
        provider: providerName,
        checkoutUrl: input.successUrl ?? `/editor?checkout=stripe-mock&${params.toString()}`,
        paymentId: `stripe-${input.projectId}`,
      };
    },
    async confirmPayment(input) {
      requireEnv("STRIPE_SECRET_KEY");

      return {
        projectId: input.projectId,
        status: "PAID",
        externalPaymentKey: input.paymentKey ?? input.orderId,
      };
    },
  };
}
