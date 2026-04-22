import { Field } from "@/components/editor/block-editors/EditorFields";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import type { Block } from "@/types/page";
import type { ContainerLayout, ContainerNode, ElementStyle } from "@/types/elements";

type LayoutBlock = Extract<
  Block,
  { type: "customSection" | "containerSection" | "gridSection" | "columnsSection" }
>;

export function ContainerSectionEditor({ block }: { block: LayoutBlock }) {
  const { selectInsertionTarget, updateBlock, updateContainer } = useEditorStore();
  const container = block.containers?.[0] ?? null;

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
      <div className="grid grid-cols-2 gap-2">
        <Field label="Padding">
          <Input
            onChange={(event) => updateBlock(block.id, { padding: event.target.value })}
            value={block.props.padding ?? ""}
          />
        </Field>
        <Field label="Background">
          <Input
            onChange={(event) => updateBlock(block.id, { background: event.target.value })}
            value={block.props.background ?? ""}
          />
        </Field>
      </div>

      {container ? (
        <ContainerControls
          blockId={block.id}
          container={container}
          onSelect={() =>
            selectInsertionTarget({ blockId: block.id, containerId: container.id, kind: "block" })
          }
          updateContainer={updateContainer}
        />
      ) : (
        <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700">
          이 블록에는 아직 컨테이너가 없습니다.
        </p>
      )}
    </div>
  );
}

function ContainerControls({
  blockId,
  container,
  onSelect,
  updateContainer,
}: {
  blockId: string;
  container: ContainerNode;
  onSelect: () => void;
  updateContainer: (
    blockId: string,
    containerId: string,
    update: { layout?: Partial<ContainerLayout>; style?: ElementStyle },
  ) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-950">Container</p>
        <Button onClick={onSelect} size="sm" variant="outline">
          요소 추가 위치
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Direction">
          <Select
            onChange={(event) =>
              updateContainer(blockId, container.id, {
                layout: { direction: event.target.value as "horizontal" | "vertical" },
              })
            }
            value={container.layout?.direction ?? "vertical"}
          >
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </Select>
        </Field>
        <Field label="Columns">
          <Input
            onChange={(event) =>
              updateContainer(blockId, container.id, {
                layout: { columns: Number(event.target.value) || 1 },
              })
            }
            type="number"
            value={Number(container.layout?.columns ?? 1)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Gap">
          <Input
            onChange={(event) =>
              updateContainer(blockId, container.id, { layout: { gap: event.target.value } })
            }
            value={container.layout?.gap ?? ""}
          />
        </Field>
        <Field label="Padding">
          <Input
            onChange={(event) =>
              updateContainer(blockId, container.id, { style: { padding: event.target.value } })
            }
            value={container.style?.padding ?? ""}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Align">
          <Select
            onChange={(event) =>
              updateContainer(blockId, container.id, { layout: { align: event.target.value } })
            }
            value={container.layout?.align ?? ""}
          >
            <option value="">default</option>
            <option value="flex-start">start</option>
            <option value="center">center</option>
            <option value="flex-end">end</option>
            <option value="stretch">stretch</option>
          </Select>
        </Field>
        <Field label="Justify">
          <Select
            onChange={(event) =>
              updateContainer(blockId, container.id, { layout: { justify: event.target.value } })
            }
            value={container.layout?.justify ?? ""}
          >
            <option value="">default</option>
            <option value="flex-start">start</option>
            <option value="center">center</option>
            <option value="space-between">between</option>
            <option value="flex-end">end</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}
