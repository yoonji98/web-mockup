import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { PricingBlock as PricingBlockType } from "@/types/page";

export function PricingBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<PricingBlockType>) {
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
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {block.props.plans.map((plan) => (
          <article
            className={cn(
              radiusClassName[radius],
              plan.highlighted ? styleShadowClassName.elevated : styleShadowClassName[shadow],
              "border p-6",
            )}
            key={plan.name}
            style={{
              backgroundColor: colors.surface,
              borderColor: plan.highlighted ? colors.primary : colors.accent,
            }}
          >
            <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
              {plan.name}
            </h3>
            <p className="mt-4 text-4xl font-semibold" style={{ color: colors.text }}>
              {plan.price}
            </p>
            <p className="mt-4 text-sm leading-6" style={{ color: colors.mutedText }}>
              {plan.description}
            </p>
            <ul className="mt-6 grid gap-2 text-sm" style={{ color: colors.text }}>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a
              className={`${radiusClassName[radius]} mt-7 inline-flex min-h-11 items-center px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90`}
              href="#lead"
              style={{ backgroundColor: colors.primary }}
            >
              {plan.buttonText}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
