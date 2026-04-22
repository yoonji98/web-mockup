import {
  styleInnerSpacingClassName,
  styleShadowClassName,
  styleSpacingClassName,
} from "@/lib/style-pack";
import type { Block, PageData, StyleShadow, StyleSpacing, ThemeColors } from "@/types/page";

export type BlockComponentProps<TBlock extends Block> = {
  block: TBlock;
  colors: ThemeColors;
  radius: PageData["theme"]["radius"];
  shadow: StyleShadow;
  spacing: StyleSpacing;
};

export const radiusClassName: Record<PageData["theme"]["radius"], string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
  "2xl": "rounded-[1.75rem]",
};

export { styleInnerSpacingClassName, styleShadowClassName, styleSpacingClassName };
