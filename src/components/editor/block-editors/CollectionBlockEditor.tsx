"use client";

import { defaultCollections } from "@/data/collections";
import { Field } from "@/components/editor/block-editors/EditorFields";
import { Input, Select } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import type { Block } from "@/types/page";

type CollectionBlock = Extract<Block, { type: "collectionList" | "collectionDetail" }>;

export function CollectionBlockEditor({ block }: { block: CollectionBlock }) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const collection = defaultCollections.find((item) => item.id === block.props.collectionId) ?? defaultCollections[0];
  const fieldValue = (block.props.showFields ?? collection.fields.slice(0, 4).map((field) => field.id)).join(", ");

  return (
    <div className="grid gap-4">
      <Field label="Title">
        <Input
          onChange={(event) => updateBlock(block.id, { title: event.target.value })}
          value={block.props.title}
        />
      </Field>
      <Field label="Subtitle">
        <Input
          onChange={(event) => updateBlock(block.id, { subtitle: event.target.value })}
          value={block.props.subtitle ?? ""}
        />
      </Field>
      <Field label="Collection">
        <Select
          onChange={(event) => updateBlock(block.id, { collectionId: event.target.value })}
          value={block.props.collectionId}
        >
          {defaultCollections.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Fields">
        <Input
          onChange={(event) =>
            updateBlock(block.id, {
              showFields: event.target.value
                .split(",")
                .map((field) => field.trim())
                .filter(Boolean),
            })
          }
          value={fieldValue}
        />
      </Field>
      {block.type === "collectionList" ? (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Item Limit">
            <Input
              min={1}
              onChange={(event) => updateBlock(block.id, { itemLimit: Number(event.target.value) || 1 })}
              type="number"
              value={block.props.itemLimit ?? 6}
            />
          </Field>
          <Field label="Detail Slug">
            <Input
              onChange={(event) => updateBlock(block.id, { detailSlug: event.target.value })}
              value={block.props.detailSlug ?? ""}
            />
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Item ID">
            <Input
              onChange={(event) => updateBlock(block.id, { itemId: event.target.value })}
              value={block.props.itemId ?? ""}
            />
          </Field>
          <Field label="Back Label">
            <Input
              onChange={(event) => updateBlock(block.id, { backLabel: event.target.value })}
              value={block.props.backLabel ?? ""}
            />
          </Field>
        </div>
      )}
      <p className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
        이 블록은 SiteData.collections의 sampleData를 사용합니다. 실제 DB 연동은 full-stack 단계에서
        collectionId를 기준으로 연결할 수 있게 준비되어 있습니다.
      </p>
    </div>
  );
}
