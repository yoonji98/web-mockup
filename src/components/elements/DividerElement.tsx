import { toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function DividerElement({ colors, node }: ElementComponentProps) {
  return (
    <hr
      className="w-full border-t"
      style={{ ...toCssStyle(node.style), borderColor: colors.border ?? `${colors.accent}66` }}
    />
  );
}
