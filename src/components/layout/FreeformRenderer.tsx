import type { CSSProperties, MouseEvent } from "react";

import { ElementRenderer } from "@/components/elements/ElementRenderer";
import { toCssStyle } from "@/components/elements/element-utils";
import type { ElementNode, ElementStyle, FreeformElementLayout } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

type FreeformRendererProps = {
  colors: ThemeColors;
  elements?: ElementNode[];
  layouts?: FreeformElementLayout[];
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
  style?: ElementStyle;
};

export function FreeformRenderer({
  colors,
  elements = [],
  layouts = [],
  onElementClick,
  radius,
  style,
}: FreeformRendererProps) {
  const baseStyle = toCssStyle(style);

  if (layouts.length === 0) {
    return (
      <div className="grid gap-4 md:relative md:min-h-96" style={baseStyle}>
        {elements.map((element) => (
          <ElementRenderer
            colors={colors}
            key={element.id}
            node={element}
            onElementClick={onElementClick}
            radius={radius}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={baseStyle}>
      <div className="grid gap-4 md:hidden">
        {elements.map((element) => (
          <ElementRenderer
            colors={colors}
            key={element.id}
            node={element}
            onElementClick={onElementClick}
            radius={radius}
          />
        ))}
      </div>
      <div className="hidden md:block">
        {elements.map((element) => {
          const layout = layouts.find(
            (item) => item.elementId === element.id && item.breakpoint === "desktop",
          );
          const layoutStyle: CSSProperties | undefined = layout
            ? {
                height: `${layout.h}px`,
                left: `${layout.x}px`,
                position: "absolute",
                top: `${layout.y}px`,
                width: `${layout.w}px`,
                zIndex: layout.zIndex,
              }
            : undefined;

          return (
            <div key={element.id} style={layoutStyle}>
              <ElementRenderer
                colors={colors}
                node={element}
                onElementClick={onElementClick}
                radius={radius}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
