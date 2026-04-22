import { z } from "zod";

import {
  containerNodeSchema,
  elementNodeSchema,
  freeformElementLayoutSchema,
} from "@/schemas/element-schema";
import {
  backgroundStyleTypes,
  blockTypes,
  bodySizeTypes,
  borderStyleTypes,
  buttonSizeTypes,
  buttonStyleTypes,
  contentDensityTypes,
  goalTypes,
  headingWeightTypes,
  heroAlignments,
  maxWidthTypes,
  radiusTypes,
  styleShadowTypes,
  styleSpacingTypes,
} from "@/types/page";

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Expected a 3 or 6 digit hex color.");

export const blockTypeSchema = z.enum(blockTypes);
export const goalSchema = z.enum(goalTypes);
export const radiusSchema = z.enum(radiusTypes);
export const styleShadowSchema = z.enum(styleShadowTypes);
export const styleSpacingSchema = z.enum(styleSpacingTypes);
export const heroAlignSchema = z.enum(heroAlignments);

const navLinkSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .strict();

export const themeColorsSchema = z
  .object({
    primary: hexColorSchema,
    secondary: hexColorSchema,
    background: hexColorSchema,
    surface: hexColorSchema,
    text: hexColorSchema,
    mutedText: hexColorSchema,
    accent: hexColorSchema,
    border: hexColorSchema.optional(),
  })
  .strict();

const styleColorsSchema = themeColorsSchema.extend({
  border: hexColorSchema,
});

const typographySchema = z
  .object({
    headingFont: z.string().min(1),
    bodyFont: z.string().min(1),
    headingWeight: z.enum(headingWeightTypes),
    bodySize: z.enum(bodySizeTypes),
  })
  .strict();

const layoutSchema = z
  .object({
    maxWidth: z.enum(maxWidthTypes),
    sectionPadding: z.enum(styleSpacingTypes),
    contentDensity: z.enum(contentDensityTypes),
  })
  .strict();

const shapeSchema = z
  .object({
    radius: z.enum(radiusTypes),
    cardRadius: z.string().min(1),
    buttonRadius: z.string().min(1),
  })
  .strict();

const effectsSchema = z
  .object({
    shadow: z.enum(styleShadowTypes),
    borderStyle: z.enum(borderStyleTypes),
    backgroundStyle: z.enum(backgroundStyleTypes),
  })
  .strict();

const buttonSchema = z
  .object({
    style: z.enum(buttonStyleTypes),
    size: z.enum(buttonSizeTypes),
  })
  .strict();

export const paletteSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    moodTags: z.array(z.string().min(1)).min(1),
    colors: themeColorsSchema,
    isCustom: z.boolean().optional(),
  })
  .strict();

export const stylePackSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    moodTags: z.array(z.string().min(1)).min(1),
    recommendedFor: z.array(z.string().min(1)).min(1),
    colors: styleColorsSchema,
    typography: typographySchema,
    layout: layoutSchema,
    shape: shapeSchema,
    effects: effectsSchema,
    button: buttonSchema,
  })
  .strict();

export const themeSchema = z
  .object({
    paletteId: z.string().min(1).optional(),
    stylePackId: z.string().min(1).optional(),
    colors: themeColorsSchema,
    typography: typographySchema.optional(),
    layout: layoutSchema.optional(),
    shape: shapeSchema.optional(),
    effects: effectsSchema.optional(),
    button: buttonSchema.optional(),
    fontFamily: z.string().min(1),
    radius: radiusSchema,
    shadow: styleShadowSchema.optional(),
    spacing: styleSpacingSchema.optional(),
  })
  .strict();

function blockBase<TType extends (typeof blockTypes)[number]>(type: TType) {
  return {
    containers: z.array(containerNodeSchema).optional(),
    elements: z.array(elementNodeSchema).optional(),
    id: z.string().min(1),
    type: z.literal(type),
    variant: z.string().min(1).optional(),
  };
}

const heroBlockSchema = z
  .object({
    ...blockBase("hero"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        buttonText: z.string().min(1),
        secondaryButtonText: z.string().min(1).optional(),
        imagePrompt: z.string().min(1),
        align: heroAlignSchema,
      })
      .strict(),
  })
  .strict();

const featuresBlockSchema = z
  .object({
    ...blockBase("features"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        items: z
          .array(
            z
              .object({
                title: z.string().min(1),
                description: z.string().min(1),
                icon: z.string().min(1).optional(),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict();

const aboutBlockSchema = z
  .object({
    ...blockBase("about"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        body: z.string().min(1),
        imagePrompt: z.string().min(1).optional(),
      })
      .strict(),
  })
  .strict();

const servicesBlockSchema = z
  .object({
    ...blockBase("services"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        items: z
          .array(
            z
              .object({
                title: z.string().min(1),
                description: z.string().min(1),
                price: z.string().min(1).optional(),
                duration: z.string().min(1).optional(),
                buttonText: z.string().min(1).optional(),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict();

const portfolioBlockSchema = z
  .object({
    ...blockBase("portfolio"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        projects: z
          .array(
            z
              .object({
                title: z.string().min(1),
                description: z.string().min(1),
                category: z.string().min(1),
                imagePrompt: z.string().min(1).optional(),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict();

const testimonialsBlockSchema = z
  .object({
    ...blockBase("testimonials"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        items: z
          .array(
            z
              .object({
                quote: z.string().min(1),
                name: z.string().min(1),
                role: z.string().min(1),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict();

const pricingBlockSchema = z
  .object({
    ...blockBase("pricing"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        plans: z
          .array(
            z
              .object({
                name: z.string().min(1),
                price: z.string().min(1),
                description: z.string().min(1),
                features: z.array(z.string().min(1)).min(1),
                buttonText: z.string().min(1),
                highlighted: z.boolean(),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict();

const faqBlockSchema = z
  .object({
    ...blockBase("faq"),
    props: z
      .object({
        title: z.string().min(1),
        items: z
          .array(
            z
              .object({
                question: z.string().min(1),
                answer: z.string().min(1),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  })
  .strict();

const ctaBlockSchema = z
  .object({
    ...blockBase("cta"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        buttonText: z.string().min(1),
      })
      .strict(),
  })
  .strict();

const contactBlockSchema = z
  .object({
    ...blockBase("contact"),
    props: z
      .object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        email: z.string().min(1).optional(),
        phone: z.string().min(1).optional(),
        kakao: z.string().min(1).optional(),
        buttonText: z.string().min(1),
      })
      .strict(),
  })
  .strict();

const footerBlockSchema = z
  .object({
    ...blockBase("footer"),
    props: z
      .object({
        brandName: z.string().min(1),
        description: z.string().min(1),
        links: z.array(navLinkSchema).min(1),
        copyright: z.string().min(1),
      })
      .strict(),
  })
  .strict();

const containerSectionPropsSchema = z
  .object({
    background: z.string().min(1).optional(),
    padding: z.string().min(1).optional(),
    subtitle: z.string().min(1).optional(),
    title: z.string().min(1),
  })
  .strict();

const customSectionBlockSchema = z
  .object({
    ...blockBase("customSection"),
    props: containerSectionPropsSchema,
  })
  .strict();

const containerSectionBlockSchema = z
  .object({
    ...blockBase("containerSection"),
    props: containerSectionPropsSchema,
  })
  .strict();

const gridSectionBlockSchema = z
  .object({
    ...blockBase("gridSection"),
    props: containerSectionPropsSchema,
  })
  .strict();

const columnsSectionBlockSchema = z
  .object({
    ...blockBase("columnsSection"),
    props: containerSectionPropsSchema,
  })
  .strict();

const freeformSectionBlockSchema = z
  .object({
    ...blockBase("freeformSection"),
    props: z
      .object({
        background: z.string().min(1).optional(),
        height: z.string().min(1),
        layouts: z.array(freeformElementLayoutSchema),
        subtitle: z.string().min(1).optional(),
        title: z.string().min(1),
      })
      .strict(),
  })
  .strict();

export const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  featuresBlockSchema,
  aboutBlockSchema,
  servicesBlockSchema,
  portfolioBlockSchema,
  testimonialsBlockSchema,
  pricingBlockSchema,
  faqBlockSchema,
  ctaBlockSchema,
  contactBlockSchema,
  footerBlockSchema,
  customSectionBlockSchema,
  containerSectionBlockSchema,
  gridSectionBlockSchema,
  columnsSectionBlockSchema,
  freeformSectionBlockSchema,
]);

export const pageDataSchema = z
  .object({
    id: z.string().min(1).optional(),
    title: z.string().min(1),
    slug: z.string().min(1).optional(),
    industry: z.string().min(1).optional(),
    goal: goalSchema.optional(),
    theme: themeSchema,
    seo: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        keywords: z.array(z.string().min(1)),
      })
      .strict(),
    blocks: z.array(blockSchema).min(1),
  })
  .strict();

export type PageDataFromSchema = z.infer<typeof pageDataSchema>;
