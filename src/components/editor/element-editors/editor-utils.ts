import type { ElementPropValue } from "@/types/elements";

export function propString(value: ElementPropValue | undefined) {
  return typeof value === "string" ? value : "";
}

export function propNumber(value: ElementPropValue | undefined) {
  return typeof value === "number" ? value : 0;
}

export function propBoolean(value: ElementPropValue | undefined) {
  return typeof value === "boolean" ? value : false;
}

export function linkItems(value: ElementPropValue | undefined): Array<{ href: string; label: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    return [{ href: propString(item.href), label: propString(item.label) }];
  });
}

export function formFields(
  value: ElementPropValue | undefined,
): Array<{ name: string; placeholder: string; type: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    return [
      {
        name: propString(item.name),
        placeholder: propString(item.placeholder),
        type: propString(item.type) || "text",
      },
    ];
  });
}
