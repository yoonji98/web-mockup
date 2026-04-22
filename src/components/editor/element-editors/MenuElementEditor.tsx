import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Field } from "@/components/editor/block-editors/EditorFields";
import { linkItems } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MenuElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};
  const key = element.type === "socialLinks" ? "links" : "items";
  const items = linkItems(props[key]);

  const setItems = (nextItems: typeof items) => updateProps({ [key]: nextItems });

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3" key={index}>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              onChange={(event) =>
                setItems(items.map((value, itemIndex) =>
                  itemIndex === index ? { ...value, label: event.target.value } : value,
                ))
              }
              placeholder="Label"
              value={item.label}
            />
            <Input
              onChange={(event) =>
                setItems(items.map((value, itemIndex) =>
                  itemIndex === index ? { ...value, href: event.target.value } : value,
                ))
              }
              placeholder="/about"
              value={item.href}
            />
            <Button
              onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}
              size="icon"
              variant="ghost"
            >
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="flex justify-end gap-1">
            <Button
              disabled={index === 0}
              onClick={() => setItems(move(items, index, index - 1))}
              size="sm"
              variant="outline"
            >
              <ArrowUp size={14} />
              위
            </Button>
            <Button
              disabled={index === items.length - 1}
              onClick={() => setItems(move(items, index, index + 1))}
              size="sm"
              variant="outline"
            >
              <ArrowDown size={14} />
              아래
            </Button>
          </div>
        </div>
      ))}

      <Field label="Item">
        <Button
          onClick={() => setItems([...items, { href: "/new", label: "New" }])}
          variant="outline"
        >
          <Plus size={14} />
          항목 추가
        </Button>
      </Field>
    </div>
  );
}

function move<TItem>(items: TItem[], fromIndex: number, toIndex: number): TItem[] {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);

  if (!item) {
    return items;
  }

  nextItems.splice(toIndex, 0, item);
  return nextItems;
}
