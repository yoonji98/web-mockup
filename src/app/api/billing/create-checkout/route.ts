import { NextRequest } from "next/server";
import { z } from "zod";

import { getBillingProvider, MissingBillingSecretError } from "@/lib/billing/provider";

const createCheckoutRequestSchema = z
  .object({
    projectId: z.string().min(1),
    amount: z.number().int().positive(),
    currency: z.string().min(1).default("KRW"),
    successUrl: z.string().url().optional(),
    failUrl: z.string().url().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsedRequest = createCheckoutRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "Invalid checkout request.",
        issues: parsedRequest.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  try {
    const provider = getBillingProvider();
    const checkout = await provider.createCheckout(parsedRequest.data);

    return Response.json(checkout);
  } catch (error) {
    if (error instanceof MissingBillingSecretError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "결제 요청 생성에 실패했습니다." }, { status: 500 });
  }
}
