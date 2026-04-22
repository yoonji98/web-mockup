import { cn } from "@/lib/utils";
import {
  elementRadiusClassName,
  getString,
  toCssStyle,
} from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function ImageElement({ colors, node, radius }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);
  const src = getString(props.src) || getString(props.imageUrl);
  const alt = getString(props.alt) || getString(props.label) || "Image";

  if (src) {
    return (
      <img
        alt={alt}
        className={cn("min-h-32 w-full object-cover", elementRadiusClassName[radius])}
        src={src}
        style={style}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={cn("grid min-h-64 place-items-center border p-6 text-center text-sm", elementRadiusClassName[radius])}
      role="img"
      style={{
        ...style,
        backgroundColor: style.backgroundColor ?? colors.surface,
        borderColor: colors.border ?? `${colors.accent}66`,
        color: style.color ?? colors.mutedText,
      }}
    >
      {getString(props.label) || alt}
    </div>
  );
}
