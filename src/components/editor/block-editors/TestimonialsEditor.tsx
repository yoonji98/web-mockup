"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { TestimonialsBlock, TestimonialsBlockProps } from "@/types/page";

type TestimonialsEditorProps = {
  block: TestimonialsBlock;
};

type TestimonialItem = TestimonialsBlockProps["items"][number];

export function TestimonialsEditor({ block }: TestimonialsEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<TestimonialsBlockProps>({ values: block.props });
  const update = (props: Partial<TestimonialsBlockProps>) => updateBlock(block.id, props);
  const updateItem = (index: number, patch: Partial<TestimonialItem>) => {
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
          <h3 className="text-sm font-semibold text-slate-700">후기</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                items: [
                  ...block.props.items,
                  {
                    quote: "고객이 체감한 변화를 입력하세요.",
                    name: "고객 이름",
                    role: "직함",
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
            <Field label="인용문">
              <textarea
                className={textareaClassName}
                {...register(`items.${index}.quote`, {
                  onChange: (event) => updateItem(index, { quote: event.target.value }),
                })}
              />
            </Field>
            <Field label="이름">
              <input
                className={inputClassName}
                {...register(`items.${index}.name`, {
                  onChange: (event) => updateItem(index, { name: event.target.value }),
                })}
              />
            </Field>
            <Field label="역할">
              <input
                className={inputClassName}
                {...register(`items.${index}.role`, {
                  onChange: (event) => updateItem(index, { role: event.target.value }),
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
