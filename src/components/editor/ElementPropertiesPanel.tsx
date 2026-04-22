"use client";

import { Trash2 } from "lucide-react";

import { ButtonElementEditor } from "@/components/editor/element-editors/ButtonElementEditor";
import { CardElementEditor } from "@/components/editor/element-editors/CardElementEditor";
import { FormElementEditor } from "@/components/editor/element-editors/FormElementEditor";
import { ImageElementEditor } from "@/components/editor/element-editors/ImageElementEditor";
import { LogoElementEditor } from "@/components/editor/element-editors/LogoElementEditor";
import { MenuElementEditor } from "@/components/editor/element-editors/MenuElementEditor";
import { SpacingEditor } from "@/components/editor/element-editors/SpacingEditor";
import { TextElementEditor } from "@/components/editor/element-editors/TextElementEditor";
import { VisibilityEditor } from "@/components/editor/element-editors/VisibilityEditor";
import { propString } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";
import { Field } from "@/components/editor/block-editors/EditorFields";
import { elementLabels } from "@/data/element-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editor-store";
import type {
  ContainerNode,
  ElementNode,
  ElementProps,
  ElementStyle,
  ElementTreeNode,
} from "@/types/elements";
import type { Block } from "@/types/page";

export function ElementPropertiesPanel() {
  const {
    currentPageId,
    removeElement,
    selectedElementId,
    site,
    updateBlock,
    updateElement,
  } = useEditorStore();

  if (!selectedElementId) {
    return null;
  }

  const found = findElement(site.globalSections?.header?.slots, site.pages.find((page) => page.id === currentPageId)?.blocks ?? [], selectedElementId);

  if (!found) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Element 선택 해제됨</CardTitle>
          <CardDescription>캔버스에서 다시 element를 선택하세요.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const editorProps: ElementEditorProps = {
    element: found.element,
    updateProps: (props: ElementProps) => updateElement(found.element.id, { props }),
    updateStyle: (style: ElementStyle) => updateElement(found.element.id, { style }),
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{elementLabels[found.element.type]}</CardTitle>
            <CardDescription>선택한 element의 콘텐츠와 스타일을 편집합니다.</CardDescription>
          </div>
          <Button onClick={() => removeElement(found.element.id)} size="icon" variant="ghost">
            <Trash2 size={15} />
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-5" value="content">
            <ElementTypeEditor {...editorProps} />
          </TabsContent>

          <TabsContent className="grid gap-5" value="design">
            <SpacingEditor {...editorProps} />
            <VisibilityEditor {...editorProps} />
            {found.block?.type === "freeformSection" ? (
              <FreeformLayoutEditor
                block={found.block}
                elementId={found.element.id}
                updateBlock={(props) => updateBlock(found.block?.id ?? "", props)}
              />
            ) : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ElementTypeEditor(props: ElementEditorProps) {
  switch (props.element.type) {
    case "logo":
      return <LogoElementEditor {...props} />;
    case "menu":
    case "socialLinks":
      return <MenuElementEditor {...props} />;
    case "button":
    case "loginButton":
    case "signupButton":
      return <ButtonElementEditor {...props} />;
    case "heading":
    case "text":
    case "link":
    case "badge":
      return <TextElementEditor {...props} />;
    case "image":
    case "icon":
      return <ImageElementEditor {...props} />;
    case "card":
      return <CardElementEditor {...props} />;
    case "form":
      return <FormElementEditor {...props} />;
    case "input":
    case "textarea":
      return <InputElementEditor {...props} />;
    case "divider":
    case "spacer":
      return <LayoutElementEditor {...props} />;
  }
}

function InputElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid gap-3">
      <Field label="Name">
        <Input
          onChange={(event) => updateProps({ name: event.target.value })}
          value={propString(props.name)}
        />
      </Field>
      <Field label="Placeholder">
        <Textarea
          onChange={(event) => updateProps({ placeholder: event.target.value })}
          value={propString(props.placeholder)}
        />
      </Field>
    </div>
  );
}

function LayoutElementEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  if (element.type === "spacer") {
    return (
      <Field label="Height">
        <Input
          onChange={(event) => updateProps({ height: event.target.value })}
          value={propString(props.height)}
        />
      </Field>
    );
  }

  return <p className="text-xs font-semibold text-slate-500">Divider는 스타일 패널에서 조정합니다.</p>;
}

function FreeformLayoutEditor({
  block,
  elementId,
  updateBlock,
}: {
  block: Extract<Block, { type: "freeformSection" }>;
  elementId: string;
  updateBlock: (props: Partial<Extract<Block, { type: "freeformSection" }>["props"]>) => void;
}) {
  const layout = block.props.layouts.find((item) => item.elementId === elementId && item.breakpoint === "desktop");

  if (!layout) {
    return null;
  }

  const updateLayout = (patch: Partial<typeof layout>) =>
    updateBlock({
      layouts: block.props.layouts.map((item) =>
        item.elementId === elementId && item.breakpoint === "desktop" ? { ...item, ...patch } : item,
      ),
    });

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-950">Freeform layout</p>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="X" onChange={(value) => updateLayout({ x: value })} value={layout.x} />
        <NumberField label="Y" onChange={(value) => updateLayout({ y: value })} value={layout.y} />
        <NumberField label="W" onChange={(value) => updateLayout({ w: value })} value={layout.w} />
        <NumberField label="H" onChange={(value) => updateLayout({ h: value })} value={layout.h} />
        <NumberField label="Z" onChange={(value) => updateLayout({ zIndex: value })} value={layout.zIndex ?? 1} />
      </div>
    </div>
  );
}

function NumberField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <Field label={label}>
      <Input
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </Field>
  );
}

type FoundElement = {
  block?: Block;
  element: ElementNode;
};

function findElement(
  slots: Record<string, ElementNode[] | undefined> | undefined,
  blocks: Block[],
  elementId: string,
): FoundElement | null {
  if (slots) {
    for (const slotElements of Object.values(slots)) {
      const element = slotElements?.find((item) => item.id === elementId);

      if (element) {
        return { element };
      }
    }
  }

  for (const block of blocks) {
    const rootElement = block.elements?.find((element) => element.id === elementId);

    if (rootElement) {
      return { block, element: rootElement };
    }

    const nestedElement = findElementInContainers(block.containers ?? [], elementId);

    if (nestedElement) {
      return { block, element: nestedElement };
    }
  }

  return null;
}

function findElementInContainers(containers: ContainerNode[], elementId: string): ElementNode | null {
  for (const container of containers) {
    const element = findElementInTree(container, elementId);

    if (element) {
      return element;
    }
  }

  return null;
}

function findElementInTree(node: ElementTreeNode, elementId: string): ElementNode | null {
  if (!("children" in node)) {
    return node.id === elementId ? node : null;
  }

  for (const child of node.children) {
    const element = findElementInTree(child, elementId);

    if (element) {
      return element;
    }
  }

  return null;
}
