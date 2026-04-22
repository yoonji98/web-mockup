"use client";

import { useForm } from "react-hook-form";
import { v4 as createId } from "uuid";

import { Button } from "@/components/common/button";
import { useEditorStore } from "@/store/editor-store";
import type { Palette, ThemeColors } from "@/types/page";

type PaletteFormValues = ThemeColors & {
  name: string;
};
type ColorField = Exclude<keyof ThemeColors, "border">;

const colorFields: ColorField[] = [
  "background",
  "surface",
  "primary",
  "secondary",
  "accent",
  "text",
  "mutedText",
];

const fieldLabels: Record<ColorField, string> = {
  background: "배경",
  surface: "표면",
  primary: "주요",
  secondary: "보조",
  accent: "강조",
  text: "본문",
  mutedText: "보조 텍스트",
};

export function PaletteForm() {
  const { page, setPalette } = useEditorStore();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<PaletteFormValues>({
    values: {
      name: "Custom Palette",
      ...page.theme.colors,
    },
  });

  const onSubmit = (values: PaletteFormValues) => {
    const { name, ...colors } = values;
    const palette: Palette = {
      id: createId(),
      name: name.trim() || "Custom Palette",
      description: "사용자가 직접 만든 커스텀 팔레트",
      moodTags: ["custom"],
      colors,
    };

    setPalette(palette);
    reset({
      name: palette.name,
      ...colors,
    });
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        팔레트 이름
        <input
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-600"
          {...register("name", { required: true })}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        {colorFields.map((field) => (
          <label className="grid gap-1 text-sm font-medium text-slate-700" key={field}>
            {fieldLabels[field]}
            <input
              className="h-10 w-full rounded-md border border-slate-300 bg-white p-1"
              type="color"
              {...register(field, { required: true })}
            />
          </label>
        ))}
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit" variant="secondary">
        커스텀 팔레트 저장
      </Button>
    </form>
  );
}
