import { cn } from "@/lib/utils";
import { getNumber, getString, toCssStyle } from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function HeadingElement({ colors, node }: ElementComponentProps) {
  const props = node.props ?? {};
  const level = getNumber(props.level) ?? 2;
  const content = getString(props.text) || "Heading";
  const style = { ...toCssStyle(node.style), color: node.style?.color ?? colors.text };
  const className = "text-balance font-semibold tracking-tight";

  if (level === 1) {
    return (
      <h1 className={cn(className, "text-4xl leading-tight md:text-6xl")} style={style}>
        {content}
      </h1>
    );
  }

  if (level === 3) {
    return (
      <h3 className={cn(className, "text-2xl leading-tight md:text-3xl")} style={style}>
        {content}
      </h3>
    );
  }

  return (
    <h2 className={cn(className, "text-3xl leading-tight md:text-4xl")} style={style}>
      {content}
    </h2>
  );
}
