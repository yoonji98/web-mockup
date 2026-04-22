import {
  radiusClassName,
  styleShadowClassName,
  styleSpacingClassName,
  type BlockComponentProps,
} from "@/components/blocks/block-types";
import { cn } from "@/lib/utils";
import type { ContactBlock as ContactBlockType } from "@/types/page";

export function ContactBlock({
  block,
  colors,
  radius,
  shadow,
  spacing,
}: BlockComponentProps<ContactBlockType>) {
  const isBooking = block.variant === "booking-cta";

  return (
    <section className={styleSpacingClassName[spacing]} id="contact">
      <div className={cn("grid gap-6 lg:grid-cols-[0.9fr_1.1fr]", isBooking ? "lg:grid-cols-1" : "")}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl" style={{ color: colors.text }}>
            {block.props.title}
          </h2>
          <p className="mt-4 leading-7" style={{ color: colors.mutedText }}>
            {block.props.subtitle}
          </p>
          <div className="mt-8 grid gap-3 text-sm" style={{ color: colors.text }}>
            {block.props.email ? <p>Email: {block.props.email}</p> : null}
            {block.props.phone ? <p>Phone: {block.props.phone}</p> : null}
            {block.props.kakao ? <p>Kakao: {block.props.kakao}</p> : null}
          </div>
        </div>
        <form
          className={cn(radiusClassName[radius], styleShadowClassName[shadow], "grid gap-4 border p-6")}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border ?? `${colors.accent}80`,
          }}
        >
          <input className="h-11 rounded-xl border px-3 text-sm" placeholder="이름" style={{ borderColor: colors.border ?? colors.accent }} />
          <input className="h-11 rounded-xl border px-3 text-sm" placeholder="연락처" style={{ borderColor: colors.border ?? colors.accent }} />
          <textarea className="min-h-28 rounded-xl border px-3 py-2 text-sm" placeholder="문의 내용" style={{ borderColor: colors.border ?? colors.accent }} />
          <button
            className={`${radiusClassName[radius]} min-h-11 px-5 text-sm font-semibold text-white`}
            type="button"
            style={{ backgroundColor: colors.primary }}
          >
            {block.props.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}
