import { z } from "zod";

import { palettes } from "@/data/palettes";
import { generateJsonWithOpenAI, MissingOpenAIKeyError } from "@/lib/ai";
import { createSuggestPalettePrompt } from "@/lib/prompts/suggest-palette-prompt";
import { pageDataSchema, paletteSchema } from "@/schemas/page-schema";

const suggestPaletteRequestSchema = z
  .object({
    currentPage: pageDataSchema.optional(),
    industry: z.string().min(1),
    targetAudience: z.string().optional(),
    tone: z.string().min(1),
  })
  .strict();

const suggestPaletteResponseSchema = z.discriminatedUnion("mode", [
  z
    .object({
      mode: z.literal("system"),
      paletteId: z.string().min(1),
      reason: z.string().min(1),
    })
    .strict(),
  z
    .object({
      mode: z.literal("custom"),
      customPalette: paletteSchema,
      reason: z.string().min(1),
    })
    .strict(),
]);

export async function POST(request: Request) {
  const body = await request.json();
  const parsedRequest = suggestPaletteRequestSchema.safeParse(body);

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
    const prompt = createSuggestPalettePrompt(parsedRequest.data);
    const aiJson = await generateJsonWithOpenAI({
      ...prompt,
      maxOutputTokens: 1800,
    });
    const parsedSuggestion = suggestPaletteResponseSchema.safeParse(aiJson);

    if (!parsedSuggestion.success) {
      return Response.json(
        {
          error: "AI 응답이 팔레트 추천 스키마와 일치하지 않습니다.",
          issues: parsedSuggestion.error.issues,
        },
        { status: 500 },
      );
    }

    const suggestion = parsedSuggestion.data;

    if (suggestion.mode === "system") {
      if (!palettes.some((palette) => palette.id === suggestion.paletteId)) {
        return Response.json(
          {
            error: "AI가 존재하지 않는 시스템 팔레트를 추천했습니다.",
          },
          { status: 500 },
        );
      }
    }

    return Response.json(suggestion);
  } catch (error) {
    if (error instanceof MissingOpenAIKeyError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      {
        error: "AI 팔레트 추천에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}
