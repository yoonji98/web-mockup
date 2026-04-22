"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS as DndCSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, Copy, GripVertical, Palette, Sparkles, Trash2 } from "lucide-react";

import { SiteRenderer } from "@/components/site/SiteRenderer";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { canRemoveWatermark } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";
import { useEditorStore, type PreviewMode } from "@/store/editor-store";
import type { Block } from "@/types/page";

import {
  getPageDropId,
  getSectionDragId,
  getSectionInsertDropId,
} from "./dnd-data";

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
    selectBlock,
    selectElement,
    selectedBlockId,
    site,
  } = useEditorStore();
  const currentPage = site.pages.find((sitePage) => sitePage.id === currentPageId) ?? site.pages[0];
  const renderedBlocks = currentPage.blocks.filter((block) => block.type !== "footer");
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
          <SortableContext
            items={renderedBlocks.map((block) => getSectionDragId(block.id))}
            strategy={verticalListSortingStrategy}
          >
            <SiteRenderer
              currentPage={currentPage}
              editorDnd={{ pageId: currentPage.id }}
              onElementClick={(_block, elementId) => selectElement(elementId)}
              renderBlock={(block, renderedBlock, index) => {
                const isSelected = selectedBlockId === block.id;
                const selectedIndex = page.blocks.findIndex((item) => item.id === block.id);

                return (
                  <Fragment key={block.id}>
                    <SectionInsertDropZone index={index} pageId={currentPage.id} />
                    <SortableSectionWrapper
                      block={block}
                      isSelected={isSelected}
                      onSelect={() => selectBlock(block.id)}
                      pageId={currentPage.id}
                    >
                      {isSelected ? (
                        <div
                          className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-md border border-slate-200 bg-white/95 p-1 shadow-xl backdrop-blur"
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
                    </SortableSectionWrapper>
                    {index === renderedBlocks.length - 1 ? (
                      <SectionInsertDropZone index={index + 1} pageId={currentPage.id} />
                    ) : null}
                  </Fragment>
                );
              }}
              site={site}
            />
          </SortableContext>
          {renderedBlocks.length === 0 ? <EmptyPageDropZone pageId={currentPage.id} /> : null}
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

function SectionInsertDropZone({ index, pageId }: { index: number; pageId: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: getSectionInsertDropId(pageId, index),
    data: {
      dropType: "sectionInsert",
      index,
      pageId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "grid place-items-center transition-all",
        isOver ? "h-12 bg-blue-50/80" : "h-3 bg-transparent",
      )}
    >
      <div
        className={cn(
          "h-0.5 w-[92%] rounded-full transition",
          isOver ? "bg-blue-500 opacity-100" : "bg-transparent opacity-0",
        )}
      />
    </div>
  );
}

function EmptyPageDropZone({ pageId }: { pageId: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: getPageDropId(pageId),
    data: {
      dropType: "page",
      pageId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "mx-6 my-10 grid min-h-52 place-items-center rounded-md border border-dashed text-sm font-semibold transition",
        isOver ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-400",
      )}
    >
      요소를 여기에 놓으면 새 섹션이 생성됩니다.
    </div>
  );
}

function SortableSectionWrapper({
  block,
  children,
  isSelected,
  onSelect,
  pageId,
}: {
  block: Block;
  children: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  pageId: string;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: getSectionDragId(block.id),
    data: {
      blockId: block.id,
      dragType: "section",
      dropType: "section",
      pageId,
    },
  });
  const style: CSSProperties = {
    opacity: isDragging ? 0.55 : undefined,
    transform: DndCSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group relative cursor-pointer border border-transparent transition",
        isSelected
          ? "z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-white"
          : "hover:ring-2 hover:ring-blue-200 hover:ring-offset-2 hover:ring-offset-white",
      )}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect();
        }
      }}
      role="button"
      style={style}
      tabIndex={0}
    >
      <button
        aria-label="섹션 이동"
        className="absolute left-4 top-4 z-20 grid h-8 w-8 cursor-grab place-items-center rounded-md border border-slate-200 bg-white/95 text-slate-400 opacity-0 shadow-lg transition hover:text-slate-700 focus:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
        onClick={(event) => event.stopPropagation()}
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      {children}
    </div>
  );
}
