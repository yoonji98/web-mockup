import { Field } from "@/components/editor/block-editors/EditorFields";
import { propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Input } from "@/components/ui/input";

export function LogoElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid gap-3">
      <Field label="Logo label">
        <Input
          onChange={(event) => updateProps({ label: event.target.value })}
          value={propString(props.label)}
        />
      </Field>
      <Field label="Logo text">
        <Input
          onChange={(event) => updateProps({ text: event.target.value })}
          value={propString(props.text)}
        />
      </Field>
      <Field label="Image URL">
        <Input
          onChange={(event) => updateProps({ imageUrl: event.target.value })}
          placeholder="https://..."
          value={propString(props.imageUrl)}
        />
      </Field>
      <Field label="Href">
        <Input
          onChange={(event) => updateProps({ href: event.target.value })}
          value={propString(props.href)}
        />
      </Field>
    </div>
  );
}
