import { Field } from "@/components/editor/block-editors/EditorFields";
import { propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Input } from "@/components/ui/input";

export function ImageElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid gap-3">
      <Field label="Image URL">
        <Input
          onChange={(event) => updateProps({ src: event.target.value })}
          placeholder="https://..."
          value={propString(props.src)}
        />
      </Field>
      <Field label="Alt">
        <Input
          onChange={(event) => updateProps({ alt: event.target.value })}
          value={propString(props.alt)}
        />
      </Field>
      <Field label="Placeholder label">
        <Input
          onChange={(event) => updateProps({ label: event.target.value })}
          value={propString(props.label)}
        />
      </Field>
    </div>
  );
}
