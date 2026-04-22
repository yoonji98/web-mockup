import type { MouseEvent } from "react";

import { AboutBlock } from "@/components/blocks/AboutBlock";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { FaqBlock } from "@/components/blocks/FaqBlock";
import { FeaturesBlock } from "@/components/blocks/FeaturesBlock";
import { FooterBlock } from "@/components/blocks/FooterBlock";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { PortfolioBlock } from "@/components/blocks/PortfolioBlock";
import { PricingBlock } from "@/components/blocks/PricingBlock";
import { ServicesBlock } from "@/components/blocks/ServicesBlock";
import { TestimonialsBlock } from "@/components/blocks/TestimonialsBlock";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { ElementBlockRenderer } from "@/components/elements/ElementRenderer";
import { FreeformRenderer } from "@/components/layout/FreeformRenderer";
import type { Block, PageData, StyleShadow, StyleSpacing, ThemeColors } from "@/types/page";

type BlockRendererProps = {
  block: Block;
  colors: ThemeColors;
  radius: PageData["theme"]["radius"];
  shadow: StyleShadow;
  spacing: StyleSpacing;
  onElementClick?: (elementId: string, event: MouseEvent<HTMLElement>) => void;
};

export function BlockRenderer({ block, colors, onElementClick, radius, shadow, spacing }: BlockRendererProps) {
  if (block.type === "freeformSection") {
    return (
      <section
        className="px-6 py-16 md:px-10"
        style={{
          backgroundColor: block.props.background,
        }}
      >
        <div
          className="mx-auto max-w-6xl"
          style={{
            minHeight: block.props.height,
          }}
        >
          <FreeformRenderer
            colors={colors}
            elements={block.elements}
            layouts={block.props.layouts}
            onElementClick={onElementClick}
            radius={radius}
            style={{
              height: block.props.height,
            }}
          />
        </div>
      </section>
    );
  }

  if (shouldRenderElementTree(block)) {
    return (
      <ElementBlockRenderer
        colors={colors}
        containers={block.containers}
        elements={block.elements}
        onElementClick={onElementClick}
        radius={radius}
      />
    );
  }

  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "features":
      return <FeaturesBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "about":
      return <AboutBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "services":
      return <ServicesBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "portfolio":
      return <PortfolioBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "testimonials":
      return (
        <TestimonialsBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />
      );
    case "pricing":
      return <PricingBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "faq":
      return <FaqBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "cta":
      return <CtaBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "contact":
      return <ContactBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "footer":
      return <FooterBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    default:
      return null;
  }
}

function shouldRenderElementTree(block: Block) {
  const hasElementTree = (block.elements?.length ?? 0) > 0 || (block.containers?.length ?? 0) > 0;
  const isLayoutBlock =
    block.type === "customSection" ||
    block.type === "containerSection" ||
    block.type === "gridSection" ||
    block.type === "columnsSection";

  return hasElementTree && (isLayoutBlock || block.variant === "element-tree");
}
