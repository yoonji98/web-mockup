import type { MouseEvent, ReactNode } from "react";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { EditorSectionDndContext } from "@/components/editor/dnd-data";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getThemeShadow, getThemeSpacing } from "@/lib/style-pack";
import type { Block, SiteData, SitePage } from "@/types/page";

type SiteRendererProps = {
  currentPage: SitePage;
  editorDnd?: Pick<EditorSectionDndContext, "pageId">;
  onCreateDefaultHeader?: () => void;
  onElementClick?: (block: Block, elementId: string, event: MouseEvent<HTMLElement>) => void;
  renderBlock?: (block: Block, renderedBlock: ReactNode, index: number) => ReactNode;
  site: SiteData;
};

export function SiteRenderer({
  currentPage,
  editorDnd,
  onCreateDefaultHeader,
  onElementClick,
  renderBlock,
  site,
}: SiteRendererProps) {
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
      <SiteHeader onCreateDefaultHeader={onCreateDefaultHeader} site={site} />
      <main>
        {currentPage.blocks
          .filter((block) => block.type !== "footer")
          .map((block, index) => {
            const renderedBlock = (
              <BlockRenderer
                block={block}
                collections={site.collections}
                colors={colors}
                editorDnd={editorDnd ? { pageId: editorDnd.pageId, sectionId: block.id } : undefined}
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
