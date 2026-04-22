import { Plus, Trash2 } from "lucide-react";

import { Field } from "@/components/editor/block-editors/EditorFields";
import { formFields, propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

export function FormElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};
  const fields = formFields(props.fields);

  return (
    <div className="grid gap-3">
      <Field label="Submit label">
        <Input
          onChange={(event) => updateProps({ label: event.target.value, submitLabel: event.target.value })}
          value={propString(props.submitLabel) || propString(props.label)}
        />
      </Field>

      {fields.map((field, index) => (
        <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3" key={index}>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              onChange={(event) =>
                updateProps({
                  fields: fields.map((value, fieldIndex) =>
                    fieldIndex === index ? { ...value, name: event.target.value } : value,
                  ),
                })
              }
              placeholder="name"
              value={field.name}
            />
            <Select
              onChange={(event) =>
                updateProps({
                  fields: fields.map((value, fieldIndex) =>
                    fieldIndex === index ? { ...value, type: event.target.value } : value,
                  ),
                })
              }
              value={field.type}
            >
              <option value="text">text</option>
              <option value="email">email</option>
              <option value="tel">tel</option>
            </Select>
            <Button
              onClick={() => updateProps({ fields: fields.filter((_, fieldIndex) => fieldIndex !== index) })}
              size="icon"
              variant="ghost"
            >
              <Trash2 size={14} />
            </Button>
          </div>
          <Input
            onChange={(event) =>
              updateProps({
                fields: fields.map((value, fieldIndex) =>
                  fieldIndex === index ? { ...value, placeholder: event.target.value } : value,
                ),
              })
            }
            placeholder="Placeholder"
            value={field.placeholder}
          />
        </div>
      ))}

      <Button
        onClick={() =>
          updateProps({
            fields: [...fields, { name: "field", placeholder: "입력", type: "text" }],
          })
        }
        variant="outline"
      >
        <Plus size={14} />
        필드 추가
      </Button>
    </div>
  );
}
