import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { FeaturesBlock as FeaturesBlockType } from "@/types/page";

export function FeaturesBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<FeaturesBlockType>) {
  const variant = block.variant ?? "card-grid";
  const isBento = variant === "bento";
  const isAlternating = variant === "alternating";
  const isNumbered = variant === "numbered-list";

  return (
    <section className={styleSpacingClassName[spacing]} id="features">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>
          {block.props.title}
        </h2>
        <p className="mt-4 leading-7" style={{ color: colors.mutedText }}>
          {block.props.subtitle}
        </p>
      </div>
      <div
        className={cn(
          "mt-10 grid gap-4",
          isAlternating || isNumbered ? "md:grid-cols-1" : "md:grid-cols-3",
          isBento ? "md:grid-cols-6" : "",
        )}
      >
        {block.props.items.map((item, index) => (
          <article
            className={cn(
              radiusClassName[radius],
              styleShadowClassName[shadow],
              "border p-6 transition hover:-translate-y-0.5",
              isAlternating ? "grid gap-4 md:grid-cols-[auto_1fr] md:items-start" : "",
              isBento && index === 0 ? "md:col-span-3 md:row-span-2" : "",
              isBento && index !== 0 ? "md:col-span-3" : "",
            )}
            key={item.title}
            style={{ backgroundColor: colors.surface, borderColor: `${colors.accent}80` }}
          >
            <div
              className={`${radiusClassName[radius]} mb-5 flex h-10 w-10 items-center justify-center text-sm font-semibold text-white`}
              style={{ backgroundColor: colors.primary }}
            >
              {isNumbered ? index + 1 : item.icon ?? item.title.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
