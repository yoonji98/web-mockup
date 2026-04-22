"use client";

import { useForm } from "react-hook-form";

import {
  Field,
  inputClassName,
  smallButtonClassName,
  textareaClassName,
} from "@/components/editor/block-editors/EditorFields";
import { useEditorStore } from "@/store/editor-store";
import type { PortfolioBlock, PortfolioBlockProps } from "@/types/page";

type PortfolioEditorProps = {
  block: PortfolioBlock;
};

type PortfolioProject = PortfolioBlockProps["projects"][number];

export function PortfolioEditor({ block }: PortfolioEditorProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const { register } = useForm<PortfolioBlockProps>({ values: block.props });
  const update = (props: Partial<PortfolioBlockProps>) => updateBlock(block.id, props);
  const updateProject = (index: number, patch: Partial<PortfolioProject>) => {
    update({
      projects: block.props.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, ...patch } : project,
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
          <h3 className="text-sm font-semibold text-slate-700">프로젝트</h3>
          <button
            className={smallButtonClassName}
            onClick={() =>
              update({
                projects: [
                  ...block.props.projects,
                  {
                    title: "새 프로젝트",
                    description: "대표 작업의 성과와 맥락을 입력하세요.",
                    category: "Case Study",
                  },
                ],
              })
            }
            type="button"
          >
            추가
          </button>
        </div>

        {block.props.projects.map((project, index) => (
          <article className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3" key={index}>
            <Field label="프로젝트명">
              <input
                className={inputClassName}
                {...register(`projects.${index}.title`, {
                  onChange: (event) => updateProject(index, { title: event.target.value }),
                })}
              />
            </Field>
            <Field label="카테고리">
              <input
                className={inputClassName}
                {...register(`projects.${index}.category`, {
                  onChange: (event) => updateProject(index, { category: event.target.value }),
                })}
              />
            </Field>
            <Field label="설명">
              <textarea
                className={textareaClassName}
                {...register(`projects.${index}.description`, {
                  onChange: (event) => updateProject(index, { description: event.target.value }),
                })}
              />
            </Field>
            <Field label="이미지 프롬프트">
              <textarea
                className={textareaClassName}
                {...register(`projects.${index}.imagePrompt`, {
                  onChange: (event) => updateProject(index, { imagePrompt: event.target.value }),
                })}
              />
            </Field>
            <button
              className={smallButtonClassName}
              disabled={block.props.projects.length <= 1}
              onClick={() =>
                update({
                  projects: block.props.projects.filter(
                    (_, projectIndex) => projectIndex !== index,
                  ),
                })
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
