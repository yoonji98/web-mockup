import { cn } from "@/lib/utils";
import {
  elementRadiusClassName,
  getString,
  toCssStyle,
} from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function CardElement({ colors, node, radius }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);

  return (
    <article
      className={cn("border p-6 shadow-sm", elementRadiusClassName[radius])}
      style={{
        ...style,
        backgroundColor: style.backgroundColor ?? colors.surface,
        borderColor: colors.border ?? `${colors.accent}66`,
      }}
    >
      <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
        {getString(props.title) || getString(props.label) || "Card"}
      </h3>
      <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>
        {getString(props.description) || "카드 설명"}
      </p>
    </article>
  );
}
