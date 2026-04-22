import { cn } from "@/lib/utils";
import {
  elementRadiusClassName,
  getFormFields,
  getString,
  toCssStyle,
} from "@/components/elements/element-utils";
import type { ElementComponentProps } from "@/components/elements/types";

export function FormElement({ colors, node, radius }: ElementComponentProps) {
  const props = node.props ?? {};
  const style = toCssStyle(node.style);

  return (
    <form className={cn("grid gap-3 border bg-white p-5 shadow-sm", elementRadiusClassName[radius])} style={style}>
      {getFormFields(props.fields).map((field) => (
        <input
          className="h-11 rounded-xl border px-3 text-sm outline-none"
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          style={{ borderColor: colors.border ?? `${colors.accent}66` }}
          type={field.type}
        />
      ))}
      <button
        className={cn("px-5 py-3 text-sm font-semibold text-white", elementRadiusClassName[radius])}
        style={{ backgroundColor: colors.primary }}
        type="button"
      >
        {getString(props.submitLabel) || getString(props.label) || "Submit"}
      </button>
    </form>
  );
}
