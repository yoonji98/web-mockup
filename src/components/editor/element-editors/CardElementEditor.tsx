import { Field } from "@/components/editor/block-editors/EditorFields";
import { propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Input, Textarea } from "@/components/ui/input";

export function CardElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid gap-3">
      <Field label="Title">
        <Input
          onChange={(event) => updateProps({ title: event.target.value })}
          value={propString(props.title)}
        />
      </Field>
      <Field label="Description">
        <Textarea
          onChange={(event) => updateProps({ description: event.target.value })}
          value={propString(props.description)}
        />
      </Field>
    </div>
  );
}
