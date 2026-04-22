import { cn } from "@/lib/utils";
import {
  elementRadiusClassName,
  getString,
  SmartLink,
  toCssStyle,
} from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function ButtonElement({ colors, node, radius }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);
  const href = getString(props.href) || "#";
  const label = getString(props.label) || getString(props.text) || "Button";
  const variant = getString(props.variant) || (node.type === "loginButton" ? "ghost" : "primary");
  const isGhost = variant === "ghost" || variant === "secondary";

  return (
    <SmartLink
      className={cn(
        "inline-flex min-h-11 w-fit items-center justify-center px-5 py-3 text-sm font-semibold transition hover:opacity-90",
        isGhost ? "border" : "text-white shadow-sm",
        elementRadiusClassName[radius],
      )}
      href={href}
      style={{
        ...style,
        backgroundColor: style.backgroundColor ?? (isGhost ? "transparent" : colors.primary),
        borderColor: colors.border ?? colors.accent,
        color: style.color ?? (isGhost ? colors.text : "#ffffff"),
      }}
    >
      {label}
    </SmartLink>
  );
}
