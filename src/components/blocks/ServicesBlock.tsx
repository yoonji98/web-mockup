import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { ServicesBlock as ServicesBlockType } from "@/types/page";

export function ServicesBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<ServicesBlockType>) {
  const variant = block.variant ?? "service-cards";
  const isDetailed = variant === "detailed-list";

  return (
    <section className={styleSpacingClassName[spacing]}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
          Services
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl" style={{ color: colors.text }}>
          {block.props.title}
        </h2>
        <p className="mt-4 leading-7" style={{ color: colors.mutedText }}>
          {block.props.subtitle}
        </p>
      </div>
      <div className={cn("mt-10 grid gap-4", isDetailed ? "lg:grid-cols-1" : "md:grid-cols-3")}>
        {block.props.items.map((item, index) => (
          <article
            className={cn(
              radiusClassName[radius],
              styleShadowClassName[shadow],
              "border p-6",
              isDetailed ? "grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center" : "",
            )}
            key={item.title}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border ?? `${colors.accent}80`,
            }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {index + 1}
            </span>
            <div className={isDetailed ? "" : "mt-5"}>
              <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>
                {item.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold" style={{ color: colors.secondary }}>
                {item.price ? <span>{item.price}</span> : null}
                {item.duration ? <span>{item.duration}</span> : null}
              </div>
            </div>
            {item.buttonText ? (
              <a
                className={`${radiusClassName[radius]} mt-6 inline-flex min-h-10 items-center justify-center px-4 text-sm font-semibold text-white md:mt-0`}
                href="#contact"
                style={{ backgroundColor: colors.primary }}
              >
                {item.buttonText}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
