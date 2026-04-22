"use client";

import { useForm } from "react-hook-form";

import { Field, inputClassName, selectClassName, textareaClassName } from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { HeroBlock, HeroBlockProps } from "@/types/page";

type HeroEditorProps = {
  block: HeroBlock;
};

export function HeroEditor({ block }: HeroEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<HeroBlockProps>({ values: block.props });
  const update = (props: Partial<HeroBlockProps>) => updateBlock(block.id, props);

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
      <Field label="주요 버튼">
        <input
          className={inputClassName}
          {...register("buttonText", {
            onChange: (event) => update({ buttonText: event.target.value }),
          })}
        />
      </Field>
      <Field label="보조 버튼">
        <input
          className={inputClassName}
          {...register("secondaryButtonText", {
            onChange: (event) => update({ secondaryButtonText: event.target.value }),
          })}
        />
      </Field>
      <Field label="이미지 프롬프트">
        <textarea
          className={textareaClassName}
          {...register("imagePrompt", {
            onChange: (event) => update({ imagePrompt: event.target.value }),
          })}
        />
      </Field>
      <Field label="정렬">
        <select
          className={selectClassName}
          {...register("align", { onChange: (event) => update({ align: event.target.value }) })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
        </select>
      </Field>
    </div>
  );
}
