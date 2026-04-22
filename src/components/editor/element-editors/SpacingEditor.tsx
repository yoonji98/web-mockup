import { Field } from "@/components/editor/block-editors/EditorFields";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Input, Select } from "@/components/ui/input";

export function SpacingEditor({ element, updateStyle }: ElementEditorProps) {
  const style = element.style ?? {};

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Width">
          <Input
            onChange={(event) => updateStyle({ width: event.target.value })}
            placeholder="100%"
            value={style.width ?? ""}
          />
        </Field>
        <Field label="Max width">
          <Input
            onChange={(event) => updateStyle({ maxWidth: event.target.value })}
            placeholder="720px"
            value={style.maxWidth ?? ""}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Padding">
          <Input
            onChange={(event) => updateStyle({ padding: event.target.value })}
            placeholder="16px"
            value={style.padding ?? ""}
          />
        </Field>
        <Field label="Margin">
          <Input
            onChange={(event) => updateStyle({ margin: event.target.value })}
            placeholder="0 auto"
            value={style.margin ?? ""}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Text align">
          <Select
            onChange={(event) => updateStyle({ textAlign: event.target.value as "left" | "center" | "right" })}
            value={style.textAlign ?? ""}
          >
            <option value="">default</option>
            <option value="left">left</option>
            <option value="center">center</option>
            <option value="right">right</option>
          </Select>
        </Field>
        <Field label="Align self">
          <Select
            onChange={(event) => updateStyle({ alignSelf: event.target.value })}
            value={style.alignSelf ?? ""}
          >
            <option value="">default</option>
            <option value="flex-start">start</option>
            <option value="center">center</option>
            <option value="flex-end">end</option>
            <option value="stretch">stretch</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Color">
          <Input
            onChange={(event) => updateStyle({ color: event.target.value })}
            placeholder="#111827"
            value={style.color ?? ""}
          />
        </Field>
        <Field label="Background">
          <Input
            onChange={(event) => updateStyle({ backgroundColor: event.target.value })}
            placeholder="#ffffff"
            value={style.backgroundColor ?? ""}
          />
        </Field>
      </div>
    </div>
  );
}
