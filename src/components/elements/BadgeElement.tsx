import { getString, toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function BadgeElement({ colors, node }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);

  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        ...style,
        backgroundColor: style.backgroundColor ?? `${colors.primary}14`,
        color: style.color ?? colors.primary,
      }}
    >
      {getString(props.text) || getString(props.label) || "Badge"}
    </span>
  );
}
