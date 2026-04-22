import { generateJsonWithOpenAI, MissingOpenAIKeyError } from "@/lib/ai";
import { createGenerateSitePrompt } from "@/lib/prompts/generate-site-prompt";
import type { GenerateSitePromptInput } from "@/lib/prompts/generate-site-prompt";
import { normalizeSiteData } from "@/lib/site-data";
import { createSiteDataFromTemplate, findTemplateForSiteType } from "@/lib/site-template";
import { siteTemplates } from "@/data/site-templates";
import { generateSiteRequestSchema, siteDataSchema } from "@/schemas/site-schema";
import type { ElementNode } from "@/types/elements";

export async function POST(request: Request) {
  const body = await request.json();
  const parsedRequest = generateSiteRequestSchema.safeParse(body);

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
    const prompt = createGenerateSitePrompt(parsedRequest.data);
    const aiJson = await generateJsonWithOpenAI({
      ...prompt,
      maxOutputTokens: 12000,
    });
    const parsedSite = siteDataSchema.safeParse(aiJson);

    if (!parsedSite.success) {
      return Response.json({
        site: createFallbackSite(parsedRequest.data),
        warning: "AI 응답 검증에 실패해 안전한 기본 사이트를 생성했습니다.",
      });
    }

    return Response.json({
      site: normalizeSiteData(parsedSite.data),
    });
  } catch (error) {
    if (error instanceof MissingOpenAIKeyError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      {
        error: "AI 웹사이트 생성에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}

function createFallbackSite(input: GenerateSitePromptInput) {
  const template = findTemplateForSiteType(siteTemplates, input.siteType);
  const site = createSiteDataFromTemplate(template);

  const normalizedSite = normalizeSiteData({
    ...site,
    name: input.businessName,
    brand: {
      ...site.brand,
      name: input.businessName,
      tagline: `${input.industry} 고객을 위한 ${input.goal}`,
      logoText: input.businessName.slice(0, 2).toUpperCase(),
    },
    seo: {
      title: input.businessName,
      description: `${input.targetAudience}를 위한 ${input.industry} 웹사이트`,
      keywords: [input.industry, input.goal, input.tone],
    },
  });

  if (input.loginButtonMode !== "include") {
    return normalizedSite;
  }

  const loginButton: ElementNode = {
    id: "header-login",
    type: "loginButton",
    props: {
      href: "/login",
      label: "로그인",
      variant: "ghost",
    },
  };
  const header = normalizedSite.globalSections?.header;
  const slots = {
    left: [...(header?.slots?.left ?? [])],
    center: [...(header?.slots?.center ?? [])],
    right: [loginButton, ...(header?.slots?.right ?? [])],
    mobile: [...(header?.slots?.mobile ?? [])],
  };

  return normalizeSiteData({
    ...normalizedSite,
    globalSections: {
      ...normalizedSite.globalSections,
      header: {
        enabled: header?.enabled ?? true,
        height: header?.height ?? "md",
        sticky: header?.sticky ?? true,
        transparent: header?.transparent ?? false,
        variant: header?.variant ?? "cta-right",
        ...header,
        slots,
        elements: [...slots.left, ...slots.center, ...slots.right, ...slots.mobile],
      },
    },
  });
}
