"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { ElementRenderer } from "@/components/elements/ElementRenderer";
import { Button } from "@/components/ui/button";
import type { ElementNode, HeaderSlotType, HeaderSlots } from "@/types/elements";
import type { HeaderHeight, SiteData } from "@/types/page";

type SiteHeaderProps = {
  onCreateDefaultHeader?: () => void;
  site: SiteData;
};

const heightClassName: Record<HeaderHeight, string> = {
  lg: "py-5",
  md: "py-4",
  sm: "py-3",
};

export function SiteHeader({ onCreateDefaultHeader, site }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = site.theme.colors;
  const header = site.globalSections?.header;

  if (header?.enabled === false) {
    return null;
  }

  const slots = header?.slots ?? {};
  const isEmptyHeader = ["left", "center", "right"].every(
    (slot) => (slots[slot as HeaderSlotType] ?? []).length === 0,
  );
  const isTransparent = header?.transparent ?? header?.variant === "transparent";
  const isSticky = header?.sticky ?? true;
  const headerHeight = header?.height ?? "md";

  return (
    <header
      className={`${isSticky ? "sticky top-0" : "relative"} z-30 border-b backdrop-blur ${
        isTransparent ? "bg-white/70" : "bg-white/95"
      }`}
      style={{ borderColor: colors.border ?? colors.accent }}
    >
      <div
        className={`mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 md:grid-cols-[1fr_auto_1fr] ${heightClassName[headerHeight]}`}
      >
        {isEmptyHeader && onCreateDefaultHeader ? (
          <div className="col-span-full flex items-center justify-center">
            <Button onClick={onCreateDefaultHeader} size="sm" variant="outline">
              기본 Header 생성
            </Button>
          </div>
        ) : (
          <>
            <HeaderSlot elements={slots.left} site={site} slot="left" />
            <HeaderSlot
              className="hidden justify-center md:flex"
              elements={slots.center}
              site={site}
              slot="center"
            />
            <HeaderSlot
              className="hidden justify-end md:flex"
              elements={slots.right}
              site={site}
              slot="right"
            />
          </>
        )}
        {!isEmptyHeader ? (
          <Button
            className="justify-self-end md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            size="icon"
            variant="ghost"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        ) : null}
      </div>

      {isOpen ? (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3">
            {mobileElements(slots).map((element) => (
              <ElementRenderer
                colors={colors}
                key={element.id}
                node={element}
                radius={site.theme.radius}
              />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeaderSlot({
  className = "flex",
  elements,
  site,
}: {
  className?: string;
  elements?: ElementNode[];
  site: SiteData;
  slot: HeaderSlotType;
}) {
  if (!elements || elements.length === 0) {
    return <div className={className} />;
  }

  return (
    <div className={`${className} min-w-0 flex-wrap items-center gap-5`}>
      {elements.map((element) => (
        <ElementRenderer
          colors={site.theme.colors}
          key={element.id}
          node={element}
          radius={site.theme.radius}
        />
      ))}
    </div>
  );
}

function mobileElements(slots: HeaderSlots): ElementNode[] {
  const explicitMobile = slots.mobile ?? [];

  if (explicitMobile.length > 0) {
    return explicitMobile;
  }

  return [...(slots.center ?? []), ...(slots.right ?? [])];
}
