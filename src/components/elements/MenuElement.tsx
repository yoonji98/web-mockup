import { getLinkItems, SmartLink, toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function MenuElement({ colors, node }: ElementComponentProps) {
  const props = node.props ?? {};
  const items = getLinkItems(props.items ?? props.links);

  return (
    <nav className="flex flex-wrap items-center gap-4" style={toCssStyle(node.style)}>
      {items.map((item) => (
        <SmartLink
          className="text-sm font-semibold transition hover:opacity-70"
          href={item.href}
          key={`${item.label}-${item.href}`}
          style={{ color: colors.mutedText }}
        >
          {item.label}
        </SmartLink>
      ))}
    </nav>
  );
}
