"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { FooterBlock, FooterBlockProps, NavLink } from "@/types/page";

type FooterEditorProps = {
  block: FooterBlock;
};

export function FooterEditor({ block }: FooterEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<FooterBlockProps>({ values: block.props });
  const update = (props: Partial<FooterBlockProps>) => updateBlock(block.id, props);
  const updateLink = (index: number, patch: Partial<NavLink>) => {
    update({
      links: block.props.links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...patch } : link,
      ),
    });
  };

  return (
    <div className="grid gap-4">
      <Field label="브랜드 이름">
        <input
          className={inputClassName}
          {...register("brandName", {
            onChange: (event) => update({ brandName: event.target.value }),
          })}
        />
      </Field>
      <Field label="설명">
        <textarea
          className={textareaClassName}
          {...register("description", {
            onChange: (event) => update({ description: event.target.value }),
          })}
        />
      </Field>
      <Field label="저작권">
        <input
          className={inputClassName}
          {...register("copyright", {
            onChange: (event) => update({ copyright: event.target.value }),
          })}
        />
      </Field>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-700">링크</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                links: [
                  ...block.props.links,
                  {
                    label: "새 링크",
                    href: "#",
                  },
                ],
              })
            }
            type="button"
          >
            추가
          </button>
        </div>
        {block.props.links.map((link, index) => (
          <article className="grid gap-2 rounded-md border border-slate-200 p-3" key={index}>
            <Field label="라벨">
              <input
                className={inputClassName}
                {...register(`links.${index}.label`, {
                  onChange: (event) => updateLink(index, { label: event.target.value }),
                })}
              />
            </Field>
            <Field label="URL">
              <input
                className={inputClassName}
                {...register(`links.${index}.href`, {
                  onChange: (event) => updateLink(index, { href: event.target.value }),
                })}
              />
            </Field>
            <button
              className={smallButtonClassName}
              disabled={block.props.links.length <= 1}
              onClick={() =>
                update({ links: block.props.links.filter((_, linkIndex) => linkIndex !== index) })
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
