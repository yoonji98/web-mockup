import { getString, toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function TextElement({ colors, node }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);

  return (
    <p className="text-base leading-7" style={{ ...style, color: style.color ?? colors.mutedText }}>
      {getString(props.text) || "본문 텍스트"}
    </p>
  );
}
