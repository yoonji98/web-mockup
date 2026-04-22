"use client";

import { Paintbrush, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AIPaletteSuggestButton } from "@/components/editor/AIPaletteSuggestButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createStylePackFromPalette, stylePacks } from "@/data/style-packs";
import { useEditorStore } from "@/store/editor-store";
import type { Palette, StylePack, ThemeColors } from "@/types/page";

type PaletteFormValues = ThemeColors & {
  name: string;
};
type ColorField = Exclude<keyof ThemeColors, "border">;

const hexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const colorFields: ColorField[] = [
  "primary",
  "secondary",
  "background",
  "surface",
  "text",
  "mutedText",
  "accent",
];

const colorLabels: Record<ColorField, string> = {
  primary: "Primary",
  secondary: "Secondary",
  background: "Background",
  surface: "Surface",
  text: "Text",
  mutedText: "Muted",
  accent: "Accent",
};

export function PalettePanel() {
  const {
    createCustomPalette,
    customPalettes,
    loadCustomPalettes,
    page,
    removeCustomPalette,
    setStylePack,
  } = useEditorStore();
  const [isCreating, setIsCreating] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<PaletteFormValues>({
    defaultValues: {
      name: "Custom Style",
      ...page.theme.colors,
    },
  });

  useEffect(() => {
    loadCustomPalettes();
  }, [loadCustomPalettes]);

  const savePalette = (values: PaletteFormValues) => {
    const { name, ...colors } = values;

    createCustomPalette({
      name,
      colors,
    });
    reset({
      name: "Custom Style",
      ...colors,
    });
    setIsCreating(false);
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Paintbrush size={18} />
          </span>
          <div>
            <CardTitle>Style Pack</CardTitle>
            <CardDescription>색상, radius, spacing, shadow를 한 번에 적용합니다.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="packs">
          <TabsList>
            <TabsTrigger value="packs">Packs</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-3" value="packs">
            {stylePacks.map((stylePack) => (
              <StylePackCard
                currentStylePackId={page.theme.stylePackId}
                key={stylePack.id}
                onSelect={setStylePack}
                stylePack={stylePack}
              />
            ))}
          </TabsContent>

          <TabsContent value="custom">
            <AIPaletteSuggestButton />

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Custom style</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">직접 만든 색상 조합을 저장합니다.</p>
              </div>
              <Button onClick={() => setIsCreating((value) => !value)} size="sm" variant="outline">
                <Plus size={14} />
                {isCreating ? "닫기" : "생성"}
              </Button>
            </div>

            {isCreating ? (
              <form
                className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                onSubmit={handleSubmit(savePalette)}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  이름
                  <Input {...register("name", { required: "이름을 입력하세요." })} />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {colorFields.map((field) => (
                    <label className="grid gap-2 text-xs font-semibold text-slate-700" key={field}>
                      {colorLabels[field]}
                      <Input
                        className="p-1"
                        type="color"
                        {...register(field, {
                          required: "색상을 입력하세요.",
                          pattern: {
                            value: hexPattern,
                            message: "HEX 형식이어야 합니다.",
                          },
                        })}
                      />
                    </label>
                  ))}
                </div>

                {Object.values(errors)[0]?.message ? (
                  <p className="text-sm text-red-600">{Object.values(errors)[0]?.message}</p>
                ) : null}

                <Button className="w-full" type="submit" variant="secondary">
                  저장 후 적용
                </Button>
              </form>
            ) : null}

            <Separator className="my-4" />

            <div className="grid gap-3">
              {customPalettes.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                  저장된 커스텀 스타일이 없습니다.
                </p>
              ) : null}
              {customPalettes.map((palette) => (
                <PaletteCard
                  currentPaletteId={page.theme.paletteId}
                  key={palette.id}
                  onDelete={removeCustomPalette}
                  onSelect={(nextPalette) => setStylePack(createStylePackFromPalette(nextPalette))}
                  palette={palette}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

type StylePackCardProps = {
  currentStylePackId?: string;
  onSelect: (stylePack: StylePack) => void;
  stylePack: StylePack;
};

function StylePackCard({ currentStylePackId, onSelect, stylePack }: StylePackCardProps) {
  const isSelected = currentStylePackId === stylePack.id;

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md ${
        isSelected ? "border-blue-400 ring-4 ring-blue-500/10" : "border-slate-200"
      }`}
    >
      <button className="w-full text-left" onClick={() => onSelect(stylePack)} type="button">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">{stylePack.name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{stylePack.description}</p>
          </div>
          {isSelected ? <Badge variant="blue">Active</Badge> : null}
        </div>
        <ColorSwatches colors={stylePack.colors} />
        <div className="mt-3 flex flex-wrap gap-1">
          {stylePack.moodTags.map((tag) => (
            <Badge key={tag} variant="slate">
              {tag}
            </Badge>
          ))}
        </div>
      </button>
    </article>
  );
}

type PaletteCardProps = {
  currentPaletteId?: string;
  onDelete: (id: string) => void;
  onSelect: (palette: Palette) => void;
  palette: Palette;
};

function PaletteCard({ currentPaletteId, onDelete, onSelect, palette }: PaletteCardProps) {
  const isSelected = currentPaletteId === palette.id;

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:border-slate-300 ${
        isSelected ? "border-blue-400 ring-4 ring-blue-500/10" : "border-slate-200"
      }`}
    >
      <button className="w-full text-left" onClick={() => onSelect(palette)} type="button">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">{palette.name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{palette.description}</p>
          </div>
          {isSelected ? <Badge variant="blue">Active</Badge> : null}
        </div>
        <ColorSwatches colors={palette.colors} />
      </button>
      <div className="mt-3 flex justify-end">
        <Button onClick={() => onDelete(palette.id)} size="sm" variant="danger">
          <Trash2 size={14} />
          삭제
        </Button>
      </div>
    </article>
  );
}

function ColorSwatches({ colors }: { colors: ThemeColors }) {
  return (
    <span className="mt-4 grid grid-cols-7 overflow-hidden rounded-xl border border-slate-200">
      {Object.entries(colors).map(([name, color]) => (
        <span
          aria-label={name}
          className="h-7"
          key={name}
          style={{
            backgroundColor: color,
          }}
        />
      ))}
    </span>
  );
}
