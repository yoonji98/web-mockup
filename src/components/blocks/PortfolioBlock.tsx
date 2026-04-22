import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { PortfolioBlock as PortfolioBlockType } from "@/types/page";

export function PortfolioBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<PortfolioBlockType>) {
  const isMasonry = block.variant === "masonry";

  return (
    <section className={styleSpacingClassName[spacing]}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
            Portfolio
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl" style={{ color: colors.text }}>
            {block.props.title}
          </h2>
          <p className="mt-4 leading-7" style={{ color: colors.mutedText }}>
            {block.props.subtitle}
          </p>
        </div>
      </div>
      <div className={cn("mt-10 grid gap-4 md:grid-cols-3", isMasonry ? "md:auto-rows-[120px]" : "")}>
        {block.props.projects.map((project, index) => (
          <article
            className={cn(
              radiusClassName[radius],
              styleShadowClassName[shadow],
              "border p-4",
              isMasonry && index === 0 ? "md:row-span-2" : "",
            )}
            key={project.title}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border ?? `${colors.accent}80`,
            }}
          >
            <div
              className={`${radiusClassName[radius]} grid min-h-40 place-items-center text-xs font-semibold`}
              style={{
                backgroundColor: colors.background,
                color: colors.mutedText,
              }}
            >
              {project.imagePrompt ?? project.category}
            </div>
            <p className="mt-5 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white" style={{ backgroundColor: colors.primary }}>
              {project.category}
            </p>
            <h3 className="mt-4 text-lg font-semibold" style={{ color: colors.text }}>
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-6" style={{ color: colors.mutedText }}>
              {project.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
