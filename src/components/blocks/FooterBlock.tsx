import type { BlockComponentProps } from "@/components/blocks/block-types";
import type { FooterBlock as FooterBlockType } from "@/types/page";

export function FooterBlock({ block, colors, spacing }: BlockComponentProps<FooterBlockType>) {
  return (
    <footer
      className={spacing === "spacious" ? "border-t px-6 py-14 md:px-12" : "border-t px-6 py-10 md:px-10"}
      style={{ borderColor: `${colors.accent}80` }}
    >
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
        <div className="max-w-sm">
          <p className="text-lg font-semibold" style={{ color: colors.text }}>
            {block.props.brandName}
          </p>
          <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>
            {block.props.description}
          </p>
          <p className="mt-5 text-xs" style={{ color: colors.mutedText }}>
            {block.props.copyright}
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-semibold">
          {block.props.links.map((link) => (
            <a href={link.href} key={link.href} style={{ color: colors.secondary }}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
