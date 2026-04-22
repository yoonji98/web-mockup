import { palettes } from "@/data/palettes";
import type { PageData } from "@/types/page";

export type SuggestPalettePromptInput = {
  currentPage?: PageData;
  industry: string;
  targetAudience?: string;
  tone: string;
};

export function createSuggestPalettePrompt(input: SuggestPalettePromptInput) {
  return {
    instructions: [
      "You are a brand designer specializing in accessible landing page color systems.",
      "Return only one valid JSON object. Do not return Markdown or explanations outside JSON.",
      "Prefer mode=system with an existing paletteId from the provided list.",
      "Use mode=custom only when none of the system palettes fit.",
      "If creating customPalette, all colors must be HEX and background/text contrast must be readable.",
    ].join("\n"),
    prompt: JSON.stringify(
      {
        task: "Recommend a palette for this landing page.",
        input: {
          industry: input.industry,
          targetAudience: input.targetAudience,
          tone: input.tone,
          currentPage: input.currentPage
            ? {
                title: input.currentPage.title,
                industry: input.currentPage.industry,
                goal: input.currentPage.goal,
                currentPaletteId: input.currentPage.theme.paletteId,
              }
            : undefined,
        },
        availableSystemPalettes: palettes,
        responseShape: {
          mode: "system | custom",
          paletteId: "required when mode is system",
          customPalette: "required when mode is custom",
          reason: "Korean explanation string",
        },
      },
      null,
      2,
    ),
  };
}
