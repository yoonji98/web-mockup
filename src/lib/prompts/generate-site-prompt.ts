import { stylePacks } from "@/data/style-packs";
import { blockTypes, blockVariantOptions, sitePageTypes, siteTypes } from "@/types/page";
import { containerNodeTypes, elementNodeTypes, headerSlotTypes } from "@/types/elements";
import type { z } from "zod";
import type { generateSiteRequestSchema } from "@/schemas/site-schema";

export type GenerateSitePromptInput = z.infer<typeof generateSiteRequestSchema>;

export function createGenerateSitePrompt(input: GenerateSitePromptInput) {
  return {
    instructions: [
      "You are an expert Korean website strategist, information architect, and conversion copywriter.",
      "Return only one valid JSON object. Do not return Markdown, HTML, React code, comments, or explanations.",
      "The JSON must match the SiteData shape exactly.",
      "AI must generate SiteData JSON only. Never generate React, JSX, CSS, HTML, or implementation code.",
      "Write all customer-facing copy in Korean.",
      "Use concise copy. Avoid long sentences.",
      "Use only supported site types, page types, block types, and block variants from the provided lists.",
      "Use only supported element types and container types from the provided lists.",
      "Use an existing stylePackId from availableStylePacks whenever possible.",
      "Build header with slots: left logo, center menu, right CTA. Add loginButton when the selected site type or loginButtonMode needs it.",
      "For custom layout sections, create containers and elements. Do not put React code or HTML in props.",
    ].join("\n"),
    prompt: JSON.stringify(
      {
        task: "Generate a complete SiteData JSON object for an AI website builder.",
        input,
        rules: {
          pageCount: {
            "one-page": "exactly 1 page",
            "small-site": "3 to 5 pages",
            "full-site": "5 to 8 pages",
          },
          navigation: "Create navigation items that point to / for home and /slug for subpages.",
          globalSections: "Use global header and footer. Do not include footer block unless necessary.",
          blocks: "Each block must include id, type, variant, props. Layout blocks may include containers/elements.",
          elements: "Use supported element types only. Add heading/text/button/image/card elements inside custom layout sections.",
          seo: "Create practical Korean SEO title, description, and keywords.",
          cta: "CTA strategy must match the selected goal.",
          menuMode:
            "If menuMode is anchor, prefer one-page #section links. If multi-page, use /slug links. If auto, choose the best structure.",
          loginButton:
            "If loginButtonMode is include, add loginButton to header right slot. If hide, omit loginButton. If auto, add it for shop, education, app, SaaS, or signup-focused goals.",
        },
        supported: {
          siteTypes,
          sitePageTypes,
          blockTypes,
          blockVariantOptions,
          containerNodeTypes,
          elementNodeTypes,
          headerSlotTypes,
          stylePackIds: stylePacks.map((stylePack) => stylePack.id),
        },
        availableStylePacks: stylePacks.map((stylePack) => ({
          id: stylePack.id,
          name: stylePack.name,
          description: stylePack.description,
          moodTags: stylePack.moodTags,
          recommendedFor: stylePack.recommendedFor,
          colors: stylePack.colors,
          typography: stylePack.typography,
          layout: stylePack.layout,
          shape: stylePack.shape,
          effects: stylePack.effects,
          button: stylePack.button,
        })),
        requiredSiteDataShape: {
          name: "string",
          slug: "optional string",
          brand: {
            name: "string",
            tagline: "optional string",
            logoText: "optional string",
          },
          theme: {
            stylePackId: "one of availableStylePacks ids",
            paletteId: "same as stylePackId",
            colors: "colors from selected style pack",
            typography: "typography from selected style pack",
            layout: "layout from selected style pack",
            shape: "shape from selected style pack",
            effects: "effects from selected style pack",
            button: "button from selected style pack",
            fontFamily: "selected body font",
            radius: "selected shape radius",
            shadow: "selected effects shadow",
            spacing: "selected layout sectionPadding",
          },
          navigation: {
            items: [{ label: "string", href: "string" }],
            cta: { label: "string", href: "string" },
          },
          pages: [
            {
              id: "stable id string",
              title: "string",
              slug: "home for home page, otherwise URL slug",
              type: "one supported page type",
              seo: { title: "string", description: "string" },
              blocks: "array of supported blocks",
            },
          ],
          globalSections: {
            header: {
              enabled: true,
              height: "sm | md | lg",
              slots: {
                left: "logo elements",
                center: "menu/link elements",
                right: "loginButton/signupButton/button elements",
                mobile: "optional mobile-specific elements",
              },
              sticky: true,
              transparent: false,
              variant: "minimal | centered | cta-right | transparent | custom",
            },
            footer: { enabled: true, variant: "simple | columns | brand-heavy | newsletter" },
          },
          seo: {
            title: "string",
            description: "string",
            keywords: ["string"],
          },
        },
      },
      null,
      2,
    ),
  };
}
