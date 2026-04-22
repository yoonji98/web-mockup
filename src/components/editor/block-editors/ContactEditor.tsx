"use client";

import { useForm } from "react-hook-form";

import { Field, inputClassName, textareaClassName } from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { ContactBlock, ContactBlockProps } from "@/types/page";

type ContactEditorProps = {
  block: ContactBlock;
};

export function ContactEditor({ block }: ContactEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<ContactBlockProps>({ values: block.props });
  const update = (props: Partial<ContactBlockProps>) => updateBlock(block.id, props);

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
      <Field label="이메일">
        <input
          className={inputClassName}
          {...register("email", { onChange: (event) => update({ email: event.target.value }) })}
        />
      </Field>
      <Field label="전화번호">
        <input
          className={inputClassName}
          {...register("phone", { onChange: (event) => update({ phone: event.target.value }) })}
        />
      </Field>
      <Field label="카카오/채널">
        <input
          className={inputClassName}
          {...register("kakao", { onChange: (event) => update({ kakao: event.target.value }) })}
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
