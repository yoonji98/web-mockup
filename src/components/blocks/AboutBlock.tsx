import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { AboutBlock as AboutBlockType } from "@/types/page";

export function AboutBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<AboutBlockType>) {
  return (
    <section
      className={cn(
        "grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center",
        styleSpacingClassName[spacing],
      )}
    >
      <div
        className={cn(radiusClassName[radius], styleShadowClassName[shadow], "min-h-72 border p-6")}
        style={{ backgroundColor: colors.surface, borderColor: `${colors.accent}80` }}
      >
        <div className="h-3 w-24 rounded-full" style={{ backgroundColor: colors.accent }} />
        <div className="mt-20 grid gap-3">
          <div className={`${radiusClassName[radius]} h-20`} style={{ backgroundColor: colors.background }} />
          <p className="text-xs leading-5" style={{ color: colors.mutedText }}>
            {block.props.imagePrompt}
          </p>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold" style={{ color: colors.primary }}>
          About
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>
          {block.props.title}
        </h2>
        <p className="mt-4 text-lg leading-8" style={{ color: colors.mutedText }}>
          {block.props.subtitle}
        </p>
        <p className="mt-5 leading-7" style={{ color: colors.text }}>
          {block.props.body}
        </p>
      </div>
    </section>
  );
}
