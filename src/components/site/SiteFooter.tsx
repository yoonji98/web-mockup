import { ElementRenderer } from "@/components/elements/ElementRenderer";
import type { SiteData } from "@/types/page";

type SiteFooterProps = {
  site: SiteData;
};

export function SiteFooter({ site }: SiteFooterProps) {
  const colors = site.theme.colors;
  const footer = site.globalSections?.footer;

  if (footer?.enabled === false) {
    return null;
  }

  const isColumns = footer?.variant === "columns" || footer?.variant === "brand-heavy";
  const year = new Date().getFullYear();

  if ((footer?.elements?.length ?? 0) > 0 || (footer?.containers?.length ?? 0) > 0) {
    return (
      <footer
        className="border-t px-5 py-12"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border ?? colors.accent,
          color: colors.text,
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
          {footer?.containers?.map((container) => (
            <ElementRenderer colors={colors} key={container.id} node={container} radius={site.theme.radius} />
          ))}
          {footer?.elements?.map((element) => (
            <ElementRenderer colors={colors} key={element.id} node={element} radius={site.theme.radius} />
          ))}
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="border-t px-5 py-12"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border ?? colors.accent,
        color: colors.text,
      }}
    >
      <div
        className={`mx-auto max-w-6xl gap-8 ${
          isColumns ? "grid md:grid-cols-[1.2fr_0.8fr_0.8fr]" : "flex flex-col md:flex-row md:items-center md:justify-between"
        }`}
      >
        <div className="max-w-sm">
          <p className="text-lg font-semibold">{site.brand.name}</p>
          {site.brand.tagline ? (
            <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>
              {site.brand.tagline}
            </p>
          ) : null}
        </div>

        <nav className="flex flex-wrap gap-3 md:justify-end">
          {site.navigation.items.map((item) => (
            <a
              className="text-sm font-semibold transition hover:opacity-70"
              href={item.href}
              key={`${item.label}-${item.href}`}
              style={{ color: colors.mutedText }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {footer?.variant === "newsletter" ? (
          <form className="flex max-w-sm gap-2">
            <input
              className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
              placeholder="email@example.com"
              style={{ borderColor: colors.border ?? colors.accent }}
              type="email"
            />
            <button
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: colors.primary }}
              type="button"
            >
              구독
            </button>
          </form>
        ) : null}
      </div>
      <div className="mx-auto mt-8 max-w-6xl text-xs" style={{ color: colors.mutedText }}>
        © {year} {site.brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
