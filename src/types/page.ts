import type {
  SiteTheme,
  StyleRadius,
} from "@/types/style";
import type { BlockElementContent, FreeformElementLayout, HeaderSlots } from "@/types/elements";
export {
  backgroundStyleTypes,
  bodySizeTypes,
  borderStyleTypes,
  buttonSizeTypes,
  buttonStyleTypes,
  contentDensityTypes,
  headingWeightTypes,
  maxWidthTypes,
  styleRadiusTypes,
  styleShadowTypes,
  styleSpacingTypes,
} from "@/types/style";
export type { SiteTheme, StylePack, StyleShadow, StyleSpacing } from "@/types/style";

export const goalTypes = [
  "reservation",
  "lead",
  "purchase",
  "signup",
  "download",
] as const;

export const radiusTypes = ["none", "sm", "md", "lg", "xl", "2xl"] as const;

export const blockTypes = [
  "hero",
  "features",
  "about",
  "services",
  "portfolio",
  "testimonials",
  "pricing",
  "faq",
  "cta",
  "contact",
  "footer",
  "customSection",
  "containerSection",
  "gridSection",
  "columnsSection",
  "freeformSection",
] as const;

export const heroAlignments = ["left", "center"] as const;
export const sitePageTypes = [
  "home",
  "landing",
  "about",
  "services",
  "portfolio",
  "pricing",
  "contact",
  "blog",
  "product",
  "custom",
] as const;
export const siteTypes = [
  "landing",
  "business",
  "portfolio",
  "cafe",
  "clinic",
  "education",
  "agency",
  "shop",
  "creator",
] as const;
export const headerVariants = ["minimal", "centered", "cta-right", "transparent", "custom"] as const;
export const footerVariants = ["simple", "columns", "brand-heavy", "newsletter"] as const;
export const headerHeightTypes = ["sm", "md", "lg"] as const;

export const blockVariantOptions = {
  hero: ["centered", "split-image", "editorial", "saas-gradient", "minimal", "luxury"],
  features: ["icon-grid", "card-grid", "bento", "alternating", "numbered-list"],
  about: ["story", "image-left", "image-right", "stats-focused", "timeline"],
  services: ["service-cards", "detailed-list", "category-grid"],
  portfolio: ["project-grid", "masonry", "case-study"],
  testimonials: ["quote-cards", "wall", "featured"],
  pricing: ["simple-cards", "comparison", "highlighted-plan"],
  faq: ["accordion", "two-column", "minimal-list"],
  cta: ["centered", "split", "banner", "gradient"],
  contact: ["simple-form", "split-info", "booking-cta"],
  footer: ["simple", "columns", "brand-heavy", "newsletter"],
  customSection: ["blank", "content-stack", "media-split"],
  containerSection: ["stack", "row", "card"],
  gridSection: ["two-column", "three-column", "bento"],
  columnsSection: ["two-column", "three-column", "four-column"],
  freeformSection: ["desktop-canvas", "hero-canvas", "poster"],
} as const;

export type Goal = (typeof goalTypes)[number];
export type Radius = StyleRadius;
export type BlockType = (typeof blockTypes)[number];
export type HeroAlign = (typeof heroAlignments)[number];
export type SitePageType = (typeof sitePageTypes)[number];
export type SiteType = (typeof siteTypes)[number];
export type HeaderVariant = (typeof headerVariants)[number];
export type FooterVariant = (typeof footerVariants)[number];
export type HeaderHeight = (typeof headerHeightTypes)[number];
export type BlockVariant<TType extends BlockType = BlockType> =
  | (typeof blockVariantOptions)[TType][number]
  | string;

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  border?: string;
};

export type Palette = {
  id: string;
  name: string;
  description: string;
  moodTags: string[];
  colors: ThemeColors;
  isCustom?: boolean;
};

export type Theme = SiteTheme;

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = NavLink;

export type HeroBlockProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  secondaryButtonText?: string;
  imagePrompt: string;
  align: HeroAlign;
};

export type FeaturesBlockProps = {
  title: string;
  subtitle: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
};

export type AboutBlockProps = {
  title: string;
  subtitle: string;
  body: string;
  imagePrompt?: string;
};

export type TestimonialsBlockProps = {
  title: string;
  subtitle: string;
  items: Array<{
    quote: string;
    name: string;
    role: string;
  }>;
};

export type PricingBlockProps = {
  title: string;
  subtitle: string;
  plans: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    highlighted: boolean;
  }>;
};

export type FaqBlockProps = {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export type CtaBlockProps = {
  title: string;
  subtitle: string;
  buttonText: string;
};

export type FooterBlockProps = {
  brandName: string;
  description: string;
  links: NavLink[];
  copyright: string;
};

export type ServicesBlockProps = {
  title: string;
  subtitle: string;
  items: Array<{
    title: string;
    description: string;
    price?: string;
    duration?: string;
    buttonText?: string;
  }>;
};

export type PortfolioBlockProps = {
  title: string;
  subtitle: string;
  projects: Array<{
    title: string;
    description: string;
    category: string;
    imagePrompt?: string;
  }>;
};

export type ContactBlockProps = {
  title: string;
  subtitle: string;
  email?: string;
  phone?: string;
  kakao?: string;
  buttonText: string;
};

export type ContainerSectionBlockProps = {
  background?: string;
  padding?: string;
  subtitle?: string;
  title: string;
};

export type FreeformSectionBlockProps = {
  background?: string;
  height: string;
  layouts: FreeformElementLayout[];
  subtitle?: string;
  title: string;
};

export type HeroBlock = BlockElementContent & {
  id: string;
  type: "hero";
  variant?: BlockVariant<"hero">;
  props: HeroBlockProps;
};

export type FeaturesBlock = BlockElementContent & {
  id: string;
  type: "features";
  variant?: BlockVariant<"features">;
  props: FeaturesBlockProps;
};

export type AboutBlock = BlockElementContent & {
  id: string;
  type: "about";
  variant?: BlockVariant<"about">;
  props: AboutBlockProps;
};

export type ServicesBlock = BlockElementContent & {
  id: string;
  type: "services";
  variant?: BlockVariant<"services">;
  props: ServicesBlockProps;
};

export type PortfolioBlock = BlockElementContent & {
  id: string;
  type: "portfolio";
  variant?: BlockVariant<"portfolio">;
  props: PortfolioBlockProps;
};

export type TestimonialsBlock = BlockElementContent & {
  id: string;
  type: "testimonials";
  variant?: BlockVariant<"testimonials">;
  props: TestimonialsBlockProps;
};

export type PricingBlock = BlockElementContent & {
  id: string;
  type: "pricing";
  variant?: BlockVariant<"pricing">;
  props: PricingBlockProps;
};

export type FaqBlock = BlockElementContent & {
  id: string;
  type: "faq";
  variant?: BlockVariant<"faq">;
  props: FaqBlockProps;
};

export type CtaBlock = BlockElementContent & {
  id: string;
  type: "cta";
  variant?: BlockVariant<"cta">;
  props: CtaBlockProps;
};

export type ContactBlock = BlockElementContent & {
  id: string;
  type: "contact";
  variant?: BlockVariant<"contact">;
  props: ContactBlockProps;
};

export type FooterBlock = BlockElementContent & {
  id: string;
  type: "footer";
  variant?: BlockVariant<"footer">;
  props: FooterBlockProps;
};

export type CustomSectionBlock = BlockElementContent & {
  id: string;
  type: "customSection";
  variant?: BlockVariant<"customSection">;
  props: ContainerSectionBlockProps;
};

export type ContainerSectionBlock = BlockElementContent & {
  id: string;
  type: "containerSection";
  variant?: BlockVariant<"containerSection">;
  props: ContainerSectionBlockProps;
};

export type GridSectionBlock = BlockElementContent & {
  id: string;
  type: "gridSection";
  variant?: BlockVariant<"gridSection">;
  props: ContainerSectionBlockProps;
};

export type ColumnsSectionBlock = BlockElementContent & {
  id: string;
  type: "columnsSection";
  variant?: BlockVariant<"columnsSection">;
  props: ContainerSectionBlockProps;
};

export type FreeformSectionBlock = BlockElementContent & {
  id: string;
  type: "freeformSection";
  variant?: BlockVariant<"freeformSection">;
  props: FreeformSectionBlockProps;
};

export type Block =
  | HeroBlock
  | FeaturesBlock
  | AboutBlock
  | ServicesBlock
  | PortfolioBlock
  | TestimonialsBlock
  | PricingBlock
  | FaqBlock
  | CtaBlock
  | ContactBlock
  | FooterBlock
  | CustomSectionBlock
  | ContainerSectionBlock
  | GridSectionBlock
  | ColumnsSectionBlock
  | FreeformSectionBlock;

export type PageData = {
  id?: string;
  title: string;
  slug?: string;
  industry?: string;
  goal?: Goal;
  theme: Theme;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  blocks: Block[];
};

export type HeaderConfig = BlockElementContent & {
  enabled?: boolean;
  height?: HeaderHeight;
  slots?: HeaderSlots;
  sticky?: boolean;
  transparent?: boolean;
  variant: HeaderVariant;
};

export type FooterConfig = BlockElementContent & {
  enabled?: boolean;
  variant: FooterVariant;
};

export type SitePage = {
  id: string;
  title: string;
  slug: string;
  type: SitePageType;
  seo?: {
    title: string;
    description: string;
  };
  blocks: Block[];
};

export type SiteData = {
  id?: string;
  name: string;
  slug?: string;
  brand: {
    name: string;
    tagline?: string;
    logoText?: string;
  };
  theme: SiteTheme;
  navigation: {
    items: NavItem[];
    cta?: {
      label: string;
      href: string;
    };
  };
  pages: SitePage[];
  globalSections?: {
    header?: HeaderConfig;
    footer?: FooterConfig;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};
