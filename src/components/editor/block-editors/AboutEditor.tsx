"use client";

import { useForm } from "react-hook-form";

import { Field, inputClassName, textareaClassName } from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { AboutBlock, AboutBlockProps } from "@/types/page";

type AboutEditorProps = {
  block: AboutBlock;
};

export function AboutEditor({ block }: AboutEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<AboutBlockProps>({ values: block.props });
  const update = (props: Partial<AboutBlockProps>) => updateBlock(block.id, props);

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
      <Field label="본문">
        <textarea
          className="min-h-36 resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-600"
          {...register("body", { onChange: (event) => update({ body: event.target.value }) })}
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
    </div>
  );
}
