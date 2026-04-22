import { cn } from "@/lib/utils";
import { getString, SmartLink, toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function LogoElement({ colors, node }: ElementComponentProps) {
  const props = node.props ?? {};
  const href = getString(props.href) || "/";
  const label = getString(props.label) || "Brand";
  const logoText = getString(props.text) || label.slice(0, 2).toUpperCase();
  const imageUrl = getString(props.imageUrl) || getString(props.src);
  const style = toCssStyle(node.style);

  return (
    <SmartLink
      className="inline-flex w-fit items-center gap-3 text-sm font-semibold"
      href={href}
      style={{ ...style, color: style.color ?? colors.text }}
    >
      {imageUrl ? (
        <img
          alt={label}
          className="h-9 w-9 rounded-xl object-cover"
          src={imageUrl}
        />
      ) : (
        <span
          className={cn("flex h-9 w-9 items-center justify-center rounded-2xl text-sm text-white")}
          style={{ backgroundColor: colors.primary }}
        >
          {logoText}
        </span>
      )}
      <span>{label}</span>
    </SmartLink>
  );
}
