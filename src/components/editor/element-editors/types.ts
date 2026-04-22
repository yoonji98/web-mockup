import type { ElementNode, ElementProps, ElementStyle } from "@/types/elements";

export type ElementEditorProps = {
  element: ElementNode;
  updateProps: (props: ElementProps) => void;
  updateStyle: (style: ElementStyle) => void;
};
