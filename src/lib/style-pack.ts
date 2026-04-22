import type { SiteTheme, StylePack, StyleShadow, StyleSpacing } from "@/types/style";

export const defaultStyleShadow: StyleShadow = "soft";
export const defaultStyleSpacing: StyleSpacing = "comfortable";

export const styleShadowClassName: Record<StyleShadow, string> = {
  none: "shadow-none",
  soft: "shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
  medium: "shadow-[0_22px_70px_rgba(15,23,42,0.12)]",
  bold: "shadow-[0_28px_90px_rgba(15,23,42,0.18)]",
  elevated: "shadow-[0_24px_80px_rgba(15,23,42,0.14)]",
};

export const styleSpacingClassName: Record<StyleSpacing, string> = {
  compact: "px-6 py-12 md:px-10 md:py-14",
  comfortable: "px-6 py-16 md:px-10 md:py-20",
  spacious: "px-6 py-20 md:px-12 md:py-28",
};

export const styleInnerSpacingClassName: Record<StyleSpacing, string> = {
  compact: "gap-4",
  comfortable: "gap-5",
  spacious: "gap-6",
};

export const styleMaxWidthClassName: Record<NonNullable<SiteTheme["layout"]>["maxWidth"], string> = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function getThemeShadow(theme: SiteTheme): StyleShadow {
  return theme.effects?.shadow ?? theme.shadow ?? defaultStyleShadow;
}

export function getThemeSpacing(theme: SiteTheme): StyleSpacing {
  return theme.layout?.sectionPadding ?? theme.spacing ?? defaultStyleSpacing;
}

export function getThemeBorderColor(theme: SiteTheme) {
  return theme.colors.border ?? theme.colors.accent;
}

export function getThemeMaxWidthClassName(theme: SiteTheme) {
  return styleMaxWidthClassName[theme.layout?.maxWidth ?? "default"];
}

export function applyStylePackToTheme(theme: SiteTheme, stylePack: StylePack): SiteTheme {
  return {
    ...theme,
    button: stylePack.button,
    colors: stylePack.colors,
    effects: stylePack.effects,
    fontFamily: stylePack.typography.bodyFont,
    layout: stylePack.layout,
    paletteId: stylePack.id,
    radius: stylePack.shape.radius,
    shadow: stylePack.effects.shadow,
    shape: stylePack.shape,
    spacing: stylePack.layout.sectionPadding,
    stylePackId: stylePack.id,
    typography: stylePack.typography,
  };
}
