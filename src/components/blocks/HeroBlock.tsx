import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { HeroBlock as HeroBlockType } from "@/types/page";

export function HeroBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<HeroBlockType>) {
  const variant = block.variant ?? "split-image";
  const isCentered = block.props.align === "center" || variant === "centered" || variant === "minimal";
  const isGradient = variant === "saas-gradient" || variant === "luxury";
  const isEditorial = variant === "editorial";

  return (
    <section
      className={cn(
        "grid gap-12 overflow-hidden lg:grid-cols-[1.05fr_0.95fr] lg:items-center",
        styleSpacingClassName[spacing],
        isCentered ? "text-center lg:grid-cols-1" : "",
        isEditorial ? "lg:grid-cols-[0.8fr_1.2fr]" : "",
        isGradient ? "px-6 md:px-10" : "",
        isGradient ? radiusClassName[radius] : "",
      )}
      style={
        isGradient
          ? {
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
              color: "#fff",
            }
          : undefined
      }
    >
      <div className={isCentered ? "mx-auto max-w-3xl" : "max-w-2xl"}>
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-[0.16em]"
          style={{ color: isGradient ? "rgba(255,255,255,0.78)" : colors.primary }}
        >
          Landing Page Builder
        </p>
        <h1
          className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
          style={{ color: isGradient ? "#fff" : colors.text }}
        >
          {block.props.title}
        </h1>
        <p
          className="mt-6 text-lg leading-8"
          style={{ color: isGradient ? "rgba(255,255,255,0.78)" : colors.mutedText }}
        >
          {block.props.subtitle}
        </p>
        <div className={`mt-8 flex flex-wrap gap-3 ${isCentered ? "justify-center" : ""}`}>
          <a
            className={`${radiusClassName[radius]} inline-flex min-h-11 items-center px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90`}
            href="#lead"
            style={{ backgroundColor: isGradient ? colors.accent : colors.primary }}
          >
            {block.props.buttonText}
          </a>
          {block.props.secondaryButtonText ? (
            <a
              className={`${radiusClassName[radius]} inline-flex min-h-11 items-center border bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm transition hover:opacity-80`}
              href="#features"
              style={{
                borderColor: isGradient ? "rgba(255,255,255,0.5)" : colors.secondary,
                color: isGradient ? "#fff" : colors.secondary,
              }}
            >
              {block.props.secondaryButtonText}
            </a>
          ) : null}
        </div>
      </div>

      {!isCentered ? (
        <div
          className={cn(
            radiusClassName[radius],
            styleShadowClassName[shadow],
            "grid min-h-96 content-between border p-6",
          )}
          style={{
            backgroundColor: isGradient ? "rgba(255,255,255,0.12)" : colors.surface,
            borderColor: isGradient ? "rgba(255,255,255,0.24)" : `${colors.accent}80`,
          }}
        >
          <div className="h-3 w-28 rounded-full" style={{ backgroundColor: colors.accent }} />
          <div className="grid gap-3">
            <div className={radiusClassName[radius]} style={{ backgroundColor: colors.background }}>
              <div className="h-32" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className={`${radiusClassName[radius]} h-16`} style={{ backgroundColor: colors.primary }} />
              <div className={`${radiusClassName[radius]} h-16`} style={{ backgroundColor: colors.secondary }} />
              <div className={`${radiusClassName[radius]} h-16`} style={{ backgroundColor: colors.accent }} />
            </div>
          </div>
          <p className="text-xs leading-5" style={{ color: colors.mutedText }}>
            {block.props.imagePrompt}
          </p>
        </div>
      ) : null}
    </section>
  );
}
