import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import type { ElementPropValue, ElementStyle } from "@/types/elements";
import type { PageData } from "@/types/page";

export const elementRadiusClassName: Record<PageData["theme"]["radius"], string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
  "2xl": "rounded-[1.75rem]",
};

export function SmartLink({
  children,
  className,
  href,
  style,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  style?: CSSProperties;
}) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link className={className} href={href} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} style={style}>
      {children}
    </a>
  );
}

export function toCssStyle(style: ElementStyle | undefined): CSSProperties {
  return {
    alignSelf: style?.alignSelf,
    backgroundColor: style?.backgroundColor,
    borderRadius: style?.borderRadius,
    color: style?.color,
    display: style?.display,
    height: style?.height,
    justifySelf: style?.justifySelf,
    margin: style?.margin,
    maxWidth: style?.maxWidth,
    padding: style?.padding,
    textAlign: style?.textAlign,
    width: style?.width,
  };
}

export function getString(value: ElementPropValue | undefined): string {
  return typeof value === "string" ? value : "";
}

export function getNumber(value: ElementPropValue | undefined): number | null {
  return typeof value === "number" ? value : null;
}

export function getBoolean(value: ElementPropValue | undefined): boolean {
  return typeof value === "boolean" ? value : false;
}

export function getLinkItems(value: ElementPropValue | undefined): Array<{ href: string; label: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const label = getString(item.label);
    const href = getString(item.href);

    return label && href ? [{ href, label }] : [];
  });
}

export function getFormFields(value: ElementPropValue | undefined) {
  if (!Array.isArray(value)) {
    return [
      {
        name: "name",
        placeholder: "이름",
        type: "text",
      },
      {
        name: "email",
        placeholder: "이메일",
        type: "email",
      },
    ];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const name = getString(item.name);

    if (!name) {
      return [];
    }

    return [
      {
        name,
        placeholder: getString(item.placeholder),
        type: getString(item.type) || "text",
      },
    ];
  });
}
