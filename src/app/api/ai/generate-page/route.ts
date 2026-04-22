import { z } from "zod";

import { generateJsonWithOpenAI, MissingOpenAIKeyError } from "@/lib/ai";
import { createGeneratePagePrompt } from "@/lib/prompts/generate-page-prompt";
import { goalTypes } from "@/types/page";
import { pageDataSchema } from "@/schemas/page-schema";

const generatePageRequestSchema = z
  .object({
    businessName: z.string().min(1),
    goal: z.enum(goalTypes),
    industry: z.string().min(1),
    palettePreference: z.string().optional(),
    targetAudience: z.string().min(1),
    tone: z.string().min(1),
  })
  .strict();

export async function POST(request: Request) {
  const body = await request.json();
  const parsedRequest = generatePageRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "입력값이 올바르지 않습니다.",
        issues: parsedRequest.error.issues,
      },
      { status: 400 },
    );
  }

  try {
    const prompt = createGeneratePagePrompt(parsedRequest.data);
    const aiJson = await generateJsonWithOpenAI({
      ...prompt,
      maxOutputTokens: 6000,
    });
    const parsedPage = pageDataSchema.safeParse(aiJson);

    if (!parsedPage.success) {
      return Response.json(
        {
          error: "AI 응답이 PageData 스키마와 일치하지 않습니다.",
          issues: parsedPage.error.issues,
        },
        { status: 500 },
      );
    }

    return Response.json(parsedPage.data);
  } catch (error) {
    if (error instanceof MissingOpenAIKeyError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      {
        error: "AI 랜딩페이지 생성에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}
