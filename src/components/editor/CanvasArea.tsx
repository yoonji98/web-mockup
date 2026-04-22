"use client";

import { ArrowDown, ArrowUp, Copy, Palette, Sparkles, Trash2 } from "lucide-react";

import { SiteRenderer } from "@/components/site/SiteRenderer";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { canRemoveWatermark } from "@/lib/billing/entitlements";
import { useEditorStore, type PreviewMode } from "@/store/editor-store";

const canvasWidthClassName: Record<PreviewMode, string> = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[390px]",
};

export function CanvasArea() {
  const {
    duplicateBlock,
    currentPageId,
    moveBlock,
    page,
    paymentStatus,
    previewMode,
    removeBlock,
    reorderBlocks,
    selectBlock,
    selectElement,
    selectedBlockId,
    site,
  } = useEditorStore();
  const currentPage = site.pages.find((sitePage) => sitePage.id === currentPageId) ?? site.pages[0];
  const showWatermark = !canRemoveWatermark(paymentStatus);

  return (
    <main className="min-w-0 overflow-auto bg-slate-100 p-8">
      <div
        className={`mx-auto max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] ${canvasWidthClassName[previewMode]}`}
      >
        <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <p className="truncate text-xs font-semibold text-slate-400">Preview frame</p>
        </div>
        <div
          className="relative min-h-[calc(100vh-160px)] overflow-hidden"
        >
          <SiteRenderer
            currentPage={currentPage}
            onElementClick={(block, elementId) =>
              selectElement({ blockId: block.id, elementId, kind: "block" })
            }
            renderBlock={(block, renderedBlock) => {
              const isSelected = selectedBlockId === block.id;
              const selectedIndex = page.blocks.findIndex((item) => item.id === block.id);

              return (
                <div
                  className={`group relative cursor-pointer border border-transparent transition ${
                    isSelected
                      ? "z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-white"
                      : "hover:ring-2 hover:ring-blue-200 hover:ring-offset-2 hover:ring-offset-white"
                  }`}
                  key={block.id}
                  draggable
                  onClick={() => selectBlock(block.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", block.id);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const activeId = event.dataTransfer.getData("text/plain");

                    if (activeId && activeId !== block.id) {
                      reorderBlocks(activeId, block.id);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      selectBlock(block.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {isSelected ? (
                    <div
                      className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-xl backdrop-blur"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Tooltip content="위로 이동">
                        <Button
                          disabled={selectedIndex <= 0}
                          onClick={() => moveBlock(block.id, "up")}
                          size="icon"
                          variant="ghost"
                        >
                          <ArrowUp size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="아래로 이동">
                        <Button
                          disabled={selectedIndex === page.blocks.length - 1}
                          onClick={() => moveBlock(block.id, "down")}
                          size="icon"
                          variant="ghost"
                        >
                          <ArrowDown size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="복제">
                        <Button onClick={() => duplicateBlock(block.id)} size="icon" variant="ghost">
                          <Copy size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Variant 변경">
                        <Button onClick={() => selectBlock(block.id)} size="icon" variant="ghost">
                          <Palette size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="AI 수정">
                        <Button onClick={() => selectBlock(block.id)} size="icon" variant="ghost">
                          <Sparkles size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="삭제">
                        <Button onClick={() => removeBlock(block.id)} size="icon" variant="ghost">
                          <Trash2 size={15} />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : null}
                  {renderedBlock}
                </div>
              );
            }}
            site={site}
          />
          {showWatermark ? (
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-xl bg-slate-950/85 px-3 py-2 text-xs font-semibold text-white shadow-lg">
              Built with Landing Studio
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
