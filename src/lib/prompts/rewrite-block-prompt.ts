import type { Block, PageData } from "@/types/page";

export type RewriteBlockPromptInput = {
  block: Block;
  instruction: string;
  pageContext: {
    goal?: PageData["goal"] | string;
    industry?: string;
    title: string;
    tone?: string;
  };
};

export function createRewriteBlockPrompt(input: RewriteBlockPromptInput) {
  return {
    instructions: [
      "You are an expert Korean landing page copywriter.",
      "Return only a valid JSON object for the updated props. Do not return id, type, Markdown, HTML, React code, or explanations.",
      "Keep the original block type and props shape exactly. Only rewrite copy fields.",
      "Write customer-facing copy in Korean.",
    ].join("\n"),
    prompt: JSON.stringify(
      {
        task: "Rewrite the selected landing page block props based on the instruction.",
        pageContext: input.pageContext,
        instruction: input.instruction,
        blockType: input.block.type,
        currentProps: input.block.props,
      },
      null,
      2,
    ),
  };
}
