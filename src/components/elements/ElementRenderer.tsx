import type { MouseEvent, ReactNode } from "react";

import { BadgeElement } from "@/components/elements/BadgeElement";
import { ButtonElement } from "@/components/elements/ButtonElement";
import { CardElement } from "@/components/elements/CardElement";
import { DividerElement } from "@/components/elements/DividerElement";
import { FormElement } from "@/components/elements/FormElement";
import { HeadingElement } from "@/components/elements/HeadingElement";
import { ImageElement } from "@/components/elements/ImageElement";
import { LoginButtonElement } from "@/components/elements/LoginButtonElement";
import { LogoElement } from "@/components/elements/LogoElement";
import { MenuElement } from "@/components/elements/MenuElement";
import { SocialLinksElement } from "@/components/elements/SocialLinksElement";
import { SpacerElement } from "@/components/elements/SpacerElement";
import { TextElement } from "@/components/elements/TextElement";
import {
  elementRadiusClassName,
  getString,
  toCssStyle,
} from "@/components/elements/element-utils";
import { ContainerRenderer } from "@/components/layout/ContainerRenderer";
import { cn } from "@/lib/utils";
import type { ContainerNode, ElementNode, ElementTreeNode } from "@/types/elements";
import type { PageData, ThemeColors } from "@/types/page";

type ElementBlockRendererProps = {
  colors: ThemeColors;
  containers?: ContainerNode[];
  elements?: ElementNode[];
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
};

export type ElementRendererProps = {
  colors: ThemeColors;
  node: ElementTreeNode;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
  radius: PageData["theme"]["radius"];
};

export function ElementBlockRenderer({
  colors,
  containers,
  elements,
  onElementClick,
  radius,
}: ElementBlockRendererProps) {
  const nodes: ElementTreeNode[] =
    (containers?.length ?? 0) > 0 ? [...(containers ?? [])] : [...(elements ?? [])];

  if (nodes.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-6">
        {nodes.map((node) => (
          <ElementRenderer
            colors={colors}
            key={node.id}
            node={node}
            onElementClick={onElementClick}
            radius={radius}
          />
        ))}
      </div>
    </section>
  );
}

export function ElementRenderer({ colors, node, onElementClick, radius }: ElementRendererProps) {
  if (isContainerNode(node)) {
    return (
      <ContainerRenderer
        colors={colors}
        node={node}
        onElementClick={onElementClick}
        radius={radius}
      />
    );
  }

  return (
    <ElementFrame node={node} onElementClick={onElementClick}>
      <LeafElement colors={colors} node={node} radius={radius} />
    </ElementFrame>
  );
}

function ElementFrame({
  children,
  node,
  onElementClick,
}: {
  children: ReactNode;
  node: ElementNode;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
}) {
  const props = node.props ?? {};
  const className = cn(
    getBooleanClass(props.hideOnMobile, "max-md:hidden"),
    getBooleanClass(props.hideOnDesktop, "md:hidden"),
  );

  if (!onElementClick) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <div
      className={cn("min-w-0 cursor-pointer rounded-xl outline-none transition hover:ring-2 hover:ring-blue-200", className)}
      data-element-id={node.id}
      onClick={(event) => {
        event.stopPropagation();
        onElementClick(node.id, event);
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function LeafElement({ colors, node, radius }: { colors: ThemeColors; node: ElementNode; radius: PageData["theme"]["radius"] }) {
  const props = node.props ?? {};

  switch (node.type) {
    case "logo":
      return <LogoElement colors={colors} node={node} radius={radius} />;
    case "heading":
      return <HeadingElement colors={colors} node={node} radius={radius} />;
    case "text":
      return <TextElement colors={colors} node={node} radius={radius} />;
    case "button":
    case "signupButton":
      return <ButtonElement colors={colors} node={node} radius={radius} />;
    case "loginButton":
      return <LoginButtonElement colors={colors} node={node} radius={radius} />;
    case "link":
      return (
        <ButtonElement
          colors={colors}
          node={{
            ...node,
            props: {
              ...props,
              label: getString(props.label) || getString(props.text) || "Link",
              variant: "ghost",
            },
          }}
          radius={radius}
        />
      );
    case "badge":
      return <BadgeElement colors={colors} node={node} radius={radius} />;
    case "image":
      return <ImageElement colors={colors} node={node} radius={radius} />;
    case "icon":
      return (
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center text-sm font-semibold text-white",
            elementRadiusClassName[radius],
          )}
          style={{ ...toCssStyle(node.style), backgroundColor: node.style?.backgroundColor ?? colors.primary }}
        >
          {getString(props.icon) || getString(props.text) || "*"}
        </span>
      );
    case "menu":
      return <MenuElement colors={colors} node={node} radius={radius} />;
    case "socialLinks":
      return <SocialLinksElement colors={colors} node={node} radius={radius} />;
    case "card":
      return <CardElement colors={colors} node={node} radius={radius} />;
    case "form":
      return <FormElement colors={colors} node={node} radius={radius} />;
    case "input":
      return (
        <input
          className="h-11 rounded-xl border px-3 text-sm outline-none"
          name={getString(props.name)}
          placeholder={getString(props.placeholder)}
          style={{ ...toCssStyle(node.style), borderColor: colors.border ?? `${colors.accent}66` }}
          type={getString(props.inputType) || "text"}
        />
      );
    case "textarea":
      return (
        <textarea
          className="min-h-28 rounded-xl border px-3 py-3 text-sm outline-none"
          name={getString(props.name)}
          placeholder={getString(props.placeholder)}
          style={{ ...toCssStyle(node.style), borderColor: colors.border ?? `${colors.accent}66` }}
        />
      );
    case "divider":
      return <DividerElement colors={colors} node={node} radius={radius} />;
    case "spacer":
      return <SpacerElement colors={colors} node={node} radius={radius} />;
  }
}

function isContainerNode(node: ElementTreeNode): node is ContainerNode {
  return "children" in node;
}

function getBooleanClass(value: unknown, className: string) {
  return value === true ? className : "";
}
