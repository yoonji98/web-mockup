import { Field } from "@/components/editor/block-editors/EditorFields";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store/editor-store";
import type { Block } from "@/types/page";

export function FreeformSectionEditor({
  block,
}: {
  block: Extract<Block, { type: "freeformSection" }>;
}) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const selectInsertionTarget = useEditorStore((state) => state.selectInsertionTarget);

  return (
    <div className="grid gap-3">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-center gap-2">
          <Badge variant="default">고급</Badge>
          <p className="text-sm font-semibold text-amber-950">Freeform Section</p>
        </div>
        <p className="mt-2 text-xs font-semibold text-amber-800">
          자유 배치는 반응형 조정이 필요합니다. 일반 사용자는 Stack/Row/Grid 섹션을 먼저 권장합니다.
        </p>
      </div>
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
        <Field label="Height">
          <Input
            onChange={(event) => updateBlock(block.id, { height: event.target.value })}
            value={block.props.height}
          />
        </Field>
        <Field label="Background">
          <Input
            onChange={(event) => updateBlock(block.id, { background: event.target.value })}
            value={block.props.background ?? ""}
          />
        </Field>
      </div>
      <button
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-600"
        onClick={() => selectInsertionTarget({ blockId: block.id, kind: "block" })}
        type="button"
      >
        자유 배치 요소 추가 위치로 선택
      </button>
    </div>
  );
}
