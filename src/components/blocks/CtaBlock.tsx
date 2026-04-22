import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { CtaBlock as CtaBlockType } from "@/types/page";

export function CtaBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<CtaBlockType>) {
  const variant = block.variant ?? "centered";
  const isSplit = variant === "split";
  const isBanner = variant === "banner";
  const isGradient = variant === "gradient";

  return (
    <section className={styleSpacingClassName[spacing]} id="lead">
      <div
        className={cn(
          radiusClassName[radius],
          styleShadowClassName[shadow],
          "px-6 py-12 md:px-10",
          isSplit ? "grid gap-8 text-left md:grid-cols-[1fr_auto] md:items-center" : "text-center",
          isBanner ? "py-8" : "",
        )}
        style={{
          background: isGradient
            ? `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`
            : colors.secondary,
        }}
      >
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {block.props.title}
          </h2>
          <p className={cn("mt-4 max-w-2xl leading-7 text-white/75", !isSplit ? "mx-auto" : "")}>
            {block.props.subtitle}
          </p>
        </div>
        <a
          className={`${radiusClassName[radius]} ${isSplit ? "" : "mt-8"} inline-flex min-h-11 items-center justify-center px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90`}
          href="/editor"
          style={{ backgroundColor: isGradient ? colors.accent : colors.primary }}
        >
          {block.props.buttonText}
        </a>
      </div>
    </section>
  );
}
