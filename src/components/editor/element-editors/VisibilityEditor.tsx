import { propBoolean } from "@/components/editor/element-editors/editor-utils";
import type { ElementEditorProps } from "@/components/editor/element-editors/types";

export function VisibilityEditor({ element, updateProps }: ElementEditorProps) {
  const props = element.props ?? {};

  return (
    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
      <label className="flex items-center gap-2">
        <input
          checked={propBoolean(props.hideOnMobile)}
          onChange={(event) => updateProps({ hideOnMobile: event.target.checked })}
          type="checkbox"
        />
        Hide mobile
      </label>
      <label className="flex items-center gap-2">
        <input
          checked={propBoolean(props.hideOnDesktop)}
          onChange={(event) => updateProps({ hideOnDesktop: event.target.checked })}
          type="checkbox"
        />
        Hide desktop
      </label>
    </div>
  );
}
