"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { FaqBlock, FaqBlockProps } from "@/types/page";

type FaqEditorProps = {
  block: FaqBlock;
};

type FaqItem = FaqBlockProps["items"][number];

export function FaqEditor({ block }: FaqEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<FaqBlockProps>({ values: block.props });
  const update = (props: Partial<FaqBlockProps>) => updateBlock(block.id, props);
  const updateItem = (index: number, patch: Partial<FaqItem>) => {
    update({
      items: block.props.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  };

  return (
    <div className="grid gap-4">
      <Field label="제목">
        <input
          className={inputClassName}
          {...register("title", { onChange: (event) => update({ title: event.target.value }) })}
        />
      </Field>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-700">질문</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                items: [
                  ...block.props.items,
                  {
                    question: "새 질문",
                    answer: "답변을 입력하세요.",
                  },
                ],
              })
            }
            type="button"
          >
            추가
          </button>
        </div>

        {block.props.items.map((item, index) => (
          <article className="grid gap-2 rounded-md border border-slate-200 p-3" key={index}>
            <Field label="질문">
              <input
                className={inputClassName}
                {...register(`items.${index}.question`, {
                  onChange: (event) => updateItem(index, { question: event.target.value }),
                })}
              />
            </Field>
            <Field label="답변">
              <textarea
                className={textareaClassName}
                {...register(`items.${index}.answer`, {
                  onChange: (event) => updateItem(index, { answer: event.target.value }),
                })}
              />
            </Field>
            <button
              className={smallButtonClassName}
              disabled={block.props.items.length <= 1}
              onClick={() =>
                update({ items: block.props.items.filter((_, itemIndex) => itemIndex !== index) })
              }
              type="button"
            >
              삭제
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
