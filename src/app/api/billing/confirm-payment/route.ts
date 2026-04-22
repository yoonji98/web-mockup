import { NextRequest } from "next/server";
import { z } from "zod";

import { getBillingProvider, MissingBillingSecretError } from "@/lib/billing/provider";

const confirmPaymentRequestSchema = z
  .object({
    projectId: z.string().min(1),
    paymentKey: z.string().min(1).optional(),
    orderId: z.string().min(1).optional(),
    amount: z.number().int().positive().optional(),
  })
  .strict();

async function markProjectPaid(projectId: string) {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  try {
    const { db } = await import("@/lib/db");

    await db.project.update({
      data: {
        paymentStatus: "PAID",
      },
      where: {
        id: projectId,
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsedRequest = confirmPaymentRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "Invalid payment confirmation request.",
        issues: parsedRequest.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  try {
    const provider = getBillingProvider();
    const payment = await provider.confirmPayment(parsedRequest.data);
    const databaseUpdated = await markProjectPaid(payment.projectId);

    return Response.json({
      ...payment,
      paymentStatus: "PAID",
      databaseUpdated,
    });
  } catch (error) {
    if (error instanceof MissingBillingSecretError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: "결제 승인 처리에 실패했습니다." }, { status: 500 });
  }
}
