"use client";

import { useForm } from "react-hook-form";

import { Field, inputClassName, textareaClassName } from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { CtaBlock, CtaBlockProps } from "@/types/page";

type CtaEditorProps = {
  block: CtaBlock;
};

export function CtaEditor({ block }: CtaEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<CtaBlockProps>({ values: block.props });
  const update = (props: Partial<CtaBlockProps>) => updateBlock(block.id, props);

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
      <Field label="버튼 텍스트">
        <input
          className={inputClassName}
          {...register("buttonText", {
            onChange: (event) => update({ buttonText: event.target.value }),
          })}
        />
      </Field>
    </div>
  );
}
