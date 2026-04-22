import { Field } from "@/components/editor/block-editors/EditorFields";
import { propBoolean, propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Input, Select } from "@/components/ui/input";

export function ButtonElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid gap-3">
      <Field label="Label">
        <Input
          onChange={(event) => updateProps({ label: event.target.value })}
          value={propString(props.label)}
        />
      </Field>
      <Field label="Href">
        <Input
          onChange={(event) => updateProps({ href: event.target.value })}
          value={propString(props.href)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Variant">
          <Select
            onChange={(event) => updateProps({ variant: event.target.value })}
            value={propString(props.variant) || "primary"}
          >
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="ghost">ghost</option>
          </Select>
        </Field>
        <Field label="Size">
          <Select
            onChange={(event) => updateProps({ size: event.target.value })}
            value={propString(props.size) || "md"}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </Select>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <input
          checked={propBoolean(props.openInNewTab)}
          onChange={(event) => updateProps({ openInNewTab: event.target.checked })}
          type="checkbox"
        />
        새 탭으로 열기
      </label>
    </div>
  );
}
