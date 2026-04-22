import type { ElementNode } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

export type ElementComponentProps = {
  colors: ThemeColors;
  node: ElementNode;
  radius: PageData["theme"]["radius"];
};
