import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { FaqBlock as FaqBlockType } from "@/types/page";

export function FaqBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<FaqBlockType>) {
  return (
    <section className={styleSpacingClassName[spacing]}>
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>
        {block.props.title}
      </h2>
      <div className="mt-8 grid gap-3">
        {block.props.items.map((item) => (
          <article
            className={cn(radiusClassName[radius], styleShadowClassName[shadow], "border p-5")}
            key={item.question}
            style={{ backgroundColor: colors.surface, borderColor: `${colors.accent}80` }}
          >
            <h3 className="font-semibold" style={{ color: colors.text }}>
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6" style={{ color: colors.mutedText }}>
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
