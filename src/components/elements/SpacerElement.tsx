import { getString, toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function SpacerElement({ node }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);

  return <div style={{ height: getString(props.height) || style.height || "32px", ...style }} />;
}
