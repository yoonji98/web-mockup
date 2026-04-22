import { z } from "zod";

import { generateJsonWithOpenAI, MissingOpenAIKeyError } from "@/lib/ai";
import { createRewriteBlockPrompt } from "@/lib/prompts/rewrite-block-prompt";
import { blockSchema } from "@/schemas/page-schema";

const rewriteBlockRequestSchema = z
  .object({
    block: blockSchema,
    instruction: z.string().min(1),
    pageContext: z
      .object({
        goal: z.string().optional(),
        industry: z.string().optional(),
        title: z.string().min(1),
        tone: z.string().optional(),
      })
      .strict(),
  })
  .strict();

export async function POST(request: Request) {
  const body = await request.json();
  const parsedRequest = rewriteBlockRequestSchema.safeParse(body);

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
    const prompt = createRewriteBlockPrompt(parsedRequest.data);
    const updatedProps = await generateJsonWithOpenAI({
      ...prompt,
      maxOutputTokens: 2500,
    });
    const parsedBlock = blockSchema.safeParse({
      ...parsedRequest.data.block,
      props: updatedProps,
    });

    if (!parsedBlock.success) {
      return Response.json(
        {
          error: "AI 응답이 블록 스키마와 일치하지 않습니다.",
          issues: parsedBlock.error.issues,
        },
        { status: 500 },
      );
    }

    return Response.json({
      props: parsedBlock.data.props,
    });
  } catch (error) {
    if (error instanceof MissingOpenAIKeyError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      {
        error: "AI 블록 문구 수정에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}
