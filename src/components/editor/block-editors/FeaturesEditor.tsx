"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { FeaturesBlock, FeaturesBlockProps } from "@/types/page";

type FeaturesEditorProps = {
  block: FeaturesBlock;
};

type FeatureItem = FeaturesBlockProps["items"][number];

export function FeaturesEditor({ block }: FeaturesEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<FeaturesBlockProps>({ values: block.props });
  const update = (props: Partial<FeaturesBlockProps>) => updateBlock(block.id, props);
  const updateItem = (index: number, patch: Partial<FeatureItem>) => {
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
      <Field label="부제목">
        <textarea
          className={textareaClassName}
          {...register("subtitle", {
            onChange: (event) => update({ subtitle: event.target.value }),
          })}
        />
      </Field>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-700">아이템</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                items: [
                  ...block.props.items,
                  {
                    title: "새 기능",
                    description: "고객에게 전달할 핵심 장점을 입력하세요.",
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
            <Field label="아이콘">
              <input
                className={inputClassName}
                {...register(`items.${index}.icon`, {
                  onChange: (event) => updateItem(index, { icon: event.target.value }),
                })}
              />
            </Field>
            <Field label="제목">
              <input
                className={inputClassName}
                {...register(`items.${index}.title`, {
                  onChange: (event) => updateItem(index, { title: event.target.value }),
                })}
              />
            </Field>
            <Field label="설명">
              <textarea
                className={textareaClassName}
                {...register(`items.${index}.description`, {
                  onChange: (event) => updateItem(index, { description: event.target.value }),
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
