import { Field } from "@/components/editor/block-editors/EditorFields";
import { propNumber, propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Input, Select, Textarea } from "@/components/ui/input";

export function TextElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid gap-3">
      {element.type === "heading" ? (
        <Field label="Level">
          <Select
            onChange={(event) => updateProps({ level: Number(event.target.value) })}
            value={String(propNumber(props.level) || 2)}
          >
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
          </Select>
        </Field>
      ) : null}
      <Field label={element.type === "badge" ? "Badge text" : "Text"}>
        <Textarea
          onChange={(event) => updateProps({ text: event.target.value })}
          value={propString(props.text)}
        />
      </Field>
      {element.type === "link" ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}
