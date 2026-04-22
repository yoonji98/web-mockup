export const styleRadiusTypes = ["none", "sm", "md", "lg", "xl", "2xl"] as const;
export const styleShadowTypes = ["none", "soft", "medium", "bold", "elevated"] as const;
export const styleSpacingTypes = ["compact", "comfortable", "spacious"] as const;
export const headingWeightTypes = ["medium", "semibold", "bold", "extrabold"] as const;
export const bodySizeTypes = ["sm", "base", "lg"] as const;
export const maxWidthTypes = ["narrow", "default", "wide"] as const;
export const contentDensityTypes = ["compact", "normal", "airy"] as const;
export const borderStyleTypes = ["none", "subtle", "strong"] as const;
export const backgroundStyleTypes = ["flat", "gradient", "pattern", "mesh"] as const;
export const buttonStyleTypes = ["solid", "outline", "soft", "gradient"] as const;
export const buttonSizeTypes = ["sm", "md", "lg"] as const;

export type StyleRadius = (typeof styleRadiusTypes)[number];
export type StyleShadow = (typeof styleShadowTypes)[number];
export type StyleSpacing = (typeof styleSpacingTypes)[number];
export type HeadingWeight = (typeof headingWeightTypes)[number];
export type BodySize = (typeof bodySizeTypes)[number];
export type MaxWidth = (typeof maxWidthTypes)[number];
export type ContentDensity = (typeof contentDensityTypes)[number];
export type BorderStyle = (typeof borderStyleTypes)[number];
export type BackgroundStyle = (typeof backgroundStyleTypes)[number];
export type StyleButtonStyle = (typeof buttonStyleTypes)[number];
export type StyleButtonSize = (typeof buttonSizeTypes)[number];

export type StyleColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  border: string;
};

export type StyleTypography = {
  headingFont: string;
  bodyFont: string;
  headingWeight: HeadingWeight;
  bodySize: BodySize;
};

export type StyleLayout = {
  maxWidth: MaxWidth;
  sectionPadding: StyleSpacing;
  contentDensity: ContentDensity;
};

export type StyleShape = {
  radius: StyleRadius;
  cardRadius: string;
  buttonRadius: string;
};

export type StyleEffects = {
  shadow: StyleShadow;
  borderStyle: BorderStyle;
  backgroundStyle: BackgroundStyle;
};

export type StyleButton = {
  style: StyleButtonStyle;
  size: StyleButtonSize;
};

export type StylePack = {
  id: string;
  name: string;
  description: string;
  moodTags: string[];
  recommendedFor: string[];
  colors: StyleColors;
  typography: StyleTypography;
  layout: StyleLayout;
  shape: StyleShape;
  effects: StyleEffects;
  button: StyleButton;
};

export type SiteTheme = {
  stylePackId?: string;
  paletteId?: string;
  colors: Partial<StyleColors> & Omit<StyleColors, "border">;
  typography?: StyleTypography;
  layout?: StyleLayout;
  shape?: StyleShape;
  effects?: StyleEffects;
  button?: StyleButton;
  fontFamily: string;
  radius: StyleRadius;
  shadow?: StyleShadow;
  spacing?: StyleSpacing;
};
