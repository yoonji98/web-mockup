import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { TestimonialsBlock as TestimonialsBlockType } from "@/types/page";

export function TestimonialsBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<TestimonialsBlockType>) {
  return (
    <section className={styleSpacingClassName[spacing]}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>
          {block.props.title}
        </h2>
        <p className="mt-4 leading-7" style={{ color: colors.mutedText }}>
          {block.props.subtitle}
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {block.props.items.map((item) => (
          <figure
            className={cn(radiusClassName[radius], styleShadowClassName[shadow], "border p-6")}
            key={`${item.name}-${item.quote}`}
            style={{ backgroundColor: colors.surface, borderColor: `${colors.accent}80` }}
          >
            <blockquote className="leading-7" style={{ color: colors.text }}>
              &quot;{item.quote}&quot;
            </blockquote>
            <figcaption className="mt-6 text-sm" style={{ color: colors.mutedText }}>
              <strong style={{ color: colors.text }}>{item.name}</strong>
              <span className="block">{item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
