"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { PricingBlock, PricingBlockProps } from "@/types/page";

type PricingEditorProps = {
  block: PricingBlock;
};

type PricingPlan = PricingBlockProps["plans"][number];

export function PricingEditor({ block }: PricingEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<PricingBlockProps>({ values: block.props });
  const update = (props: Partial<PricingBlockProps>) => updateBlock(block.id, props);
  const updatePlan = (index: number, patch: Partial<PricingPlan>) => {
    update({
      plans: block.props.plans.map((plan, planIndex) =>
        planIndex === index ? { ...plan, ...patch } : plan,
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
          <h3 className="text-sm font-semibold text-slate-700">요금제</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                plans: [
                  ...block.props.plans,
                  {
                    name: "새 요금제",
                    price: "문의",
                    description: "요금제 설명을 입력하세요.",
                    features: ["주요 기능"],
                    buttonText: "문의하기",
                    highlighted: false,
                  },
                ],
              })
            }
            type="button"
          >
            추가
          </button>
        </div>

        {block.props.plans.map((plan, index) => (
          <article className="grid gap-2 rounded-md border border-slate-200 p-3" key={index}>
            <Field label="이름">
              <input
                className={inputClassName}
                {...register(`plans.${index}.name`, {
                  onChange: (event) => updatePlan(index, { name: event.target.value }),
                })}
              />
            </Field>
            <Field label="가격">
              <input
                className={inputClassName}
                {...register(`plans.${index}.price`, {
                  onChange: (event) => updatePlan(index, { price: event.target.value }),
                })}
              />
            </Field>
            <Field label="설명">
              <textarea
                className={textareaClassName}
                {...register(`plans.${index}.description`, {
                  onChange: (event) => updatePlan(index, { description: event.target.value }),
                })}
              />
            </Field>
            <Field label="기능 목록">
              <textarea
                className={textareaClassName}
                value={plan.features.join("\n")}
                onChange={(event) =>
                  updatePlan(index, {
                    features: event.target.value.split("\n").filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="버튼 텍스트">
              <input
                className={inputClassName}
                {...register(`plans.${index}.buttonText`, {
                  onChange: (event) => updatePlan(index, { buttonText: event.target.value }),
                })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                {...register(`plans.${index}.highlighted`, {
                  onChange: (event) => updatePlan(index, { highlighted: event.target.checked }),
                })}
              />
              추천 요금제
            </label>
            <button
              className={smallButtonClassName}
              disabled={block.props.plans.length <= 1}
              onClick={() =>
                update({ plans: block.props.plans.filter((_, planIndex) => planIndex !== index) })
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
