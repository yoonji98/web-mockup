import { palettes } from "@/data/palettes";
import type { Goal } from "@/types/page";

export type GeneratePagePromptInput = {
  businessName: string;
  goal: Goal;
  industry: string;
  palettePreference?: string;
  targetAudience: string;
  tone: string;
};

export function createGeneratePagePrompt(input: GeneratePagePromptInput) {
  return {
    instructions: [
      "You are an expert Korean landing page copywriter and conversion-focused page architect.",
      "Return only one valid JSON object. Do not return Markdown, HTML, React code, comments, or explanations.",
      "The JSON must match the PageData shape exactly and use only supported block types.",
      "Write all customer-facing copy in Korean.",
      "Use a system palette from the provided palette list unless the palettePreference clearly asks otherwise.",
    ].join("\n"),
    prompt: JSON.stringify(
      {
        task: "Generate a PageData JSON object for a landing page.",
        input,
        availablePalettes: palettes,
        requiredPageDataShape: {
          title: "string",
          slug: "optional slug string",
          industry: "string",
          goal: "reservation | lead | purchase | signup | download",
          theme: {
            paletteId: "one of availablePalettes ids",
            colors: "exact colors from selected palette",
            fontFamily: "Arial, Helvetica, sans-serif",
            radius: "md",
          },
          seo: {
            title: "string",
            description: "string",
            keywords: ["string"],
          },
          blocks: [
            "Use 5 to 7 blocks. Recommended order: hero, features, about, testimonials or pricing, faq, cta, footer.",
            "Every block must have { id, type, props }.",
          ],
        },
        supportedBlockProps: {
          hero: {
            title: "string",
            subtitle: "string",
            buttonText: "string",
            secondaryButtonText: "optional string",
            imagePrompt: "string",
            align: "left | center",
          },
          features: {
            title: "string",
            subtitle: "string",
            items: [{ title: "string", description: "string", icon: "optional string" }],
          },
          about: {
            title: "string",
            subtitle: "string",
            body: "string",
            imagePrompt: "optional string",
          },
          testimonials: {
            title: "string",
            subtitle: "string",
            items: [{ quote: "string", name: "string", role: "string" }],
          },
          pricing: {
            title: "string",
            subtitle: "string",
            plans: [
              {
                name: "string",
                price: "string",
                description: "string",
                features: ["string"],
                buttonText: "string",
                highlighted: "boolean",
              },
            ],
          },
          faq: {
            title: "string",
            items: [{ question: "string", answer: "string" }],
          },
          cta: {
            title: "string",
            subtitle: "string",
            buttonText: "string",
          },
          footer: {
            brandName: "string",
            description: "string",
            links: [{ label: "string", href: "string" }],
            copyright: "string",
          },
        },
      },
      null,
      2,
    ),
  };
}
