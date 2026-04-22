import type { MouseEvent, ReactNode } from "react";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getThemeShadow, getThemeSpacing } from "@/lib/style-pack";
import type { Block, SiteData, SitePage } from "@/types/page";

type SiteRendererProps = {
  currentPage: SitePage;
  onElementClick?: (block: Block, elementId: string, event: MouseEvent<HTMLElement>) => void;
  renderBlock?: (block: Block, renderedBlock: ReactNode, index: number) => ReactNode;
  site: SiteData;
};

export function SiteRenderer({ currentPage, onElementClick, renderBlock, site }: SiteRendererProps) {
  const colors = site.theme.colors;
  const shadow = getThemeShadow(site.theme);
  const spacing = getThemeSpacing(site.theme);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: site.theme.fontFamily,
      }}
    >
      <SiteHeader site={site} />
      <main>
        {currentPage.blocks
          .filter((block) => block.type !== "footer")
          .map((block, index) => {
            const renderedBlock = (
              <BlockRenderer
                block={block}
                colors={colors}
                radius={site.theme.radius}
                shadow={shadow}
                spacing={spacing}
                onElementClick={
                  onElementClick
                    ? (elementId, event) => onElementClick(block, elementId, event)
                    : undefined
                }
              />
            );

            return renderBlock ? renderBlock(block, renderedBlock, index) : <div key={block.id}>{renderedBlock}</div>;
          })}
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
