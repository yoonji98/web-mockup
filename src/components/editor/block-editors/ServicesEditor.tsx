"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { ServicesBlock, ServicesBlockProps } from "@/types/page";

type ServicesEditorProps = {
  block: ServicesBlock;
};

type ServiceItem = ServicesBlockProps["items"][number];

export function ServicesEditor({ block }: ServicesEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<ServicesBlockProps>({ values: block.props });
  const update = (props: Partial<ServicesBlockProps>) => updateBlock(block.id, props);
  const updateItem = (index: number, patch: Partial<ServiceItem>) => {
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
          <h3 className="text-sm font-semibold text-slate-700">서비스</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                items: [
                  ...block.props.items,
                  {
                    title: "새 서비스",
                    description: "서비스의 핵심 가치를 입력하세요.",
                    buttonText: "문의하기",
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
          <article className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3" key={index}>
            <Field label="서비스명">
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
            <div className="grid grid-cols-2 gap-2">
              <Field label="가격">
                <input
                  className={inputClassName}
                  {...register(`items.${index}.price`, {
                    onChange: (event) => updateItem(index, { price: event.target.value }),
                  })}
                />
              </Field>
              <Field label="소요 시간">
                <input
                  className={inputClassName}
                  {...register(`items.${index}.duration`, {
                    onChange: (event) => updateItem(index, { duration: event.target.value }),
                  })}
                />
              </Field>
            </div>
            <Field label="버튼 텍스트">
              <input
                className={inputClassName}
                {...register(`items.${index}.buttonText`, {
                  onChange: (event) => updateItem(index, { buttonText: event.target.value }),
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
