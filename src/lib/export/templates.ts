import type { SiteData } from "@/types/page";

type ProjectTemplateInput = {
  projectName: string;
  site: SiteData;
};

export type ProjectFile = {
  content: string;
  path: string;
};

export function createReactProjectFiles({ projectName, site }: ProjectTemplateInput): ProjectFile[] {
  return [
    { path: "package.json", content: packageJsonTemplate(projectName) },
    { path: "index.html", content: indexHtmlTemplate(site.seo.title) },
    { path: "vite.config.ts", content: viteConfigTemplate },
    { path: "tsconfig.json", content: tsconfigTemplate },
    { path: "tsconfig.node.json", content: tsconfigNodeTemplate },
    { path: "tailwind.config.ts", content: tailwindConfigTemplate },
    { path: "postcss.config.js", content: postcssConfigTemplate },
    { path: "src/main.tsx", content: mainTemplate },
    { path: "src/App.tsx", content: appTemplate },
    { path: "src/data/site.json", content: `${JSON.stringify(site, null, 2)}\n` },
    { path: "src/types/site.ts", content: siteTypesTemplate },
    { path: "src/components/site/SiteRenderer.tsx", content: siteRendererTemplate },
    { path: "src/components/site/SiteHeader.tsx", content: siteHeaderTemplate },
    { path: "src/components/site/SiteFooter.tsx", content: siteFooterTemplate },
    { path: "src/components/elements/ElementRenderer.tsx", content: elementRendererTemplate },
    { path: "src/components/elements/LogoElement.tsx", content: `export { LogoElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/TextElement.tsx", content: `export { TextElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/HeadingElement.tsx", content: `export { HeadingElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/ButtonElement.tsx", content: `export { ButtonElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/ImageElement.tsx", content: `export { ImageElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/MenuElement.tsx", content: `export { MenuElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/LoginButtonElement.tsx", content: `export { LoginButtonElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/SocialLinksElement.tsx", content: `export { SocialLinksElement } from "./ElementRenderer";\n` },
    { path: "src/components/elements/FormElement.tsx", content: `export { FormElement } from "./ElementRenderer";\n` },
    { path: "src/components/layout/ContainerRenderer.tsx", content: containerRendererTemplate },
    { path: "src/components/layout/FreeformRenderer.tsx", content: freeformRendererTemplate },
    { path: "src/components/blocks/block-types.ts", content: blockTypesTemplate },
    { path: "src/components/blocks/BlockRenderer.tsx", content: blockRendererTemplate },
    { path: "src/components/blocks/HeroBlock.tsx", content: heroBlockTemplate },
    { path: "src/components/blocks/FeaturesBlock.tsx", content: featuresBlockTemplate },
    { path: "src/components/blocks/AboutBlock.tsx", content: aboutBlockTemplate },
    { path: "src/components/blocks/ServicesBlock.tsx", content: servicesBlockTemplate },
    { path: "src/components/blocks/PortfolioBlock.tsx", content: portfolioBlockTemplate },
    { path: "src/components/blocks/TestimonialsBlock.tsx", content: testimonialsBlockTemplate },
    { path: "src/components/blocks/PricingBlock.tsx", content: pricingBlockTemplate },
    { path: "src/components/blocks/FaqBlock.tsx", content: faqBlockTemplate },
    { path: "src/components/blocks/CtaBlock.tsx", content: ctaBlockTemplate },
    { path: "src/components/blocks/ContactBlock.tsx", content: contactBlockTemplate },
    { path: "src/components/blocks/FooterBlock.tsx", content: footerBlockTemplate },
    { path: "src/styles/globals.css", content: globalsCssTemplate },
    { path: "README.md", content: readmeTemplate(projectName) },
  ];
}

function packageJsonTemplate(projectName: string) {
  return `${JSON.stringify(
    {
      name: projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
        lint: "eslint .",
      },
      dependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        "react-router-dom": "^6.28.1",
      },
      devDependencies: {
        "@types/react": "^18.3.18",
        "@types/react-dom": "^18.3.5",
        autoprefixer: "^10.4.20",
        postcss: "^8.4.49",
        tailwindcss: "^3.4.17",
        typescript: "^5.7.2",
        vite: "^6.0.0",
      },
    },
    null,
    2,
  )}\n`;
}

function indexHtmlTemplate(title: string) {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

const viteConfigTemplate = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;

const tsconfigTemplate = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

const tsconfigNodeTemplate = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
`;

const tailwindConfigTemplate = `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
`;

const postcssConfigTemplate = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

const mainTemplate = `import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

const appTemplate = `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SiteRenderer } from "./components/site/SiteRenderer";
import siteJson from "./data/site.json";
import type { SiteData } from "./types/site";

const site = siteJson as SiteData;
const homePage = site.pages.find((page) => page.type === "home") ?? site.pages[0];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {site.pages.map((page) => (
          <Route
            element={<SiteRenderer currentPage={page} site={site} />}
            key={page.id}
            path={page.type === "home" ? "/" : \`/\${page.slug}\`}
          />
        ))}
        <Route element={<Navigate replace to={homePage.type === "home" ? "/" : \`/\${homePage.slug}\`} />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
`;

const siteTypesTemplate = `export type Radius = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Shadow = "none" | "soft" | "medium" | "bold" | "elevated";
export type Spacing = "compact" | "comfortable" | "spacious";
export type HeroAlign = "left" | "center";

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  border?: string;
};

export type SiteTheme = {
  paletteId?: string;
  stylePackId?: string;
  colors: ThemeColors;
  fontFamily: string;
  radius: Radius;
  shadow?: Shadow;
  spacing?: Spacing;
};

export type NavItem = {
  label: string;
  href: string;
};

export type ElementNodeType =
  | "logo"
  | "text"
  | "heading"
  | "button"
  | "image"
  | "icon"
  | "menu"
  | "link"
  | "badge"
  | "card"
  | "form"
  | "input"
  | "textarea"
  | "divider"
  | "spacer"
  | "socialLinks"
  | "loginButton"
  | "signupButton";

export type ContainerNodeType =
  | "stack"
  | "row"
  | "grid"
  | "columns"
  | "headerBar"
  | "cardGroup"
  | "freeform";

export type ElementPropValue =
  | string
  | number
  | boolean
  | null
  | ElementPropValue[]
  | { [key: string]: ElementPropValue };

export type ElementProps = Record<string, ElementPropValue>;

export type ElementStyle = {
  alignSelf?: string;
  backgroundColor?: string;
  borderRadius?: string;
  color?: string;
  display?: string;
  height?: string;
  justifySelf?: string;
  margin?: string;
  maxWidth?: string;
  padding?: string;
  textAlign?: "left" | "center" | "right";
  width?: string;
};

export type ElementNode = {
  id: string;
  props?: ElementProps;
  responsive?: Partial<Record<"desktop" | "tablet" | "mobile", ElementStyle>>;
  style?: ElementStyle;
  type: ElementNodeType;
};

export type ContainerNode = {
  children: ElementTreeNode[];
  id: string;
  layout?: {
    align?: string;
    columns?: number | string;
    direction?: "horizontal" | "vertical";
    gap?: string;
    justify?: string;
    wrap?: boolean;
  };
  responsive?: Partial<Record<"desktop" | "tablet" | "mobile", ElementStyle>>;
  style?: ElementStyle;
  type: ContainerNodeType;
};

export type ElementTreeNode = ElementNode | ContainerNode;
export type HeaderSlots = Partial<Record<"left" | "center" | "right" | "mobile", ElementNode[]>>;
export type FreeformElementLayout = {
  breakpoint: "desktop" | "tablet" | "mobile";
  elementId: string;
  h: number;
  w: number;
  x: number;
  y: number;
  zIndex?: number;
};

export type BlockElementContent = {
  containers?: ContainerNode[];
  elements?: ElementNode[];
};

export type SitePage = {
  id: string;
  title: string;
  slug: string;
  type: string;
  seo?: {
    title: string;
    description: string;
  };
  blocks: Block[];
};

export type SiteData = {
  id?: string;
  name: string;
  slug?: string;
  brand: {
    name: string;
    tagline?: string;
    logoText?: string;
  };
  theme: SiteTheme;
  navigation: {
    items: NavItem[];
    cta?: NavItem;
  };
  pages: SitePage[];
  globalSections?: {
    header?: {
      containers?: ContainerNode[];
      elements?: ElementNode[];
      enabled?: boolean;
      height?: "sm" | "md" | "lg";
      slots?: HeaderSlots;
      sticky?: boolean;
      transparent?: boolean;
      variant: "minimal" | "centered" | "cta-right" | "transparent" | "custom";
    };
    footer?: {
      containers?: ContainerNode[];
      elements?: ElementNode[];
      enabled?: boolean;
      variant: "simple" | "columns" | "brand-heavy" | "newsletter";
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

type BlockBase<TType extends string, TProps> = {
  containers?: ContainerNode[];
  elements?: ElementNode[];
  id: string;
  type: TType;
  variant?: string;
  props: TProps;
};

export type HeroBlock = BlockBase<"hero", {
  title: string;
  subtitle: string;
  buttonText: string;
  secondaryButtonText?: string;
  imagePrompt: string;
  align: HeroAlign;
}>;

export type FeaturesBlock = BlockBase<"features", {
  title: string;
  subtitle: string;
  items: Array<{ title: string; description: string; icon?: string }>;
}>;

export type AboutBlock = BlockBase<"about", {
  title: string;
  subtitle: string;
  body: string;
  imagePrompt?: string;
}>;

export type ServicesBlock = BlockBase<"services", {
  title: string;
  subtitle: string;
  items: Array<{ title: string; description: string; price?: string; duration?: string; buttonText?: string }>;
}>;

export type PortfolioBlock = BlockBase<"portfolio", {
  title: string;
  subtitle: string;
  projects: Array<{ title: string; description: string; category: string; imagePrompt?: string }>;
}>;

export type TestimonialsBlock = BlockBase<"testimonials", {
  title: string;
  subtitle: string;
  items: Array<{ quote: string; name: string; role: string }>;
}>;

export type PricingBlock = BlockBase<"pricing", {
  title: string;
  subtitle: string;
  plans: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    highlighted: boolean;
  }>;
}>;

export type FaqBlock = BlockBase<"faq", {
  title: string;
  items: Array<{ question: string; answer: string }>;
}>;

export type CtaBlock = BlockBase<"cta", {
  title: string;
  subtitle: string;
  buttonText: string;
}>;

export type ContactBlock = BlockBase<"contact", {
  title: string;
  subtitle: string;
  email?: string;
  phone?: string;
  kakao?: string;
  buttonText: string;
}>;

export type FooterBlock = BlockBase<"footer", {
  brandName: string;
  description: string;
  links: NavItem[];
  copyright: string;
}>;

export type ContainerSectionBlock = BlockBase<"customSection" | "containerSection" | "gridSection" | "columnsSection", {
  background?: string;
  padding?: string;
  subtitle?: string;
  title: string;
}>;

export type FreeformSectionBlock = BlockBase<"freeformSection", {
  background?: string;
  height: string;
  layouts: FreeformElementLayout[];
  subtitle?: string;
  title: string;
}>;

export type Block =
  | HeroBlock
  | FeaturesBlock
  | AboutBlock
  | ServicesBlock
  | PortfolioBlock
  | TestimonialsBlock
  | PricingBlock
  | FaqBlock
  | CtaBlock
  | ContactBlock
  | FooterBlock
  | ContainerSectionBlock
  | FreeformSectionBlock;
`;

const blockTypesTemplate = `import type { Block, Radius, Shadow, Spacing, ThemeColors } from "../../types/site";

export type BlockComponentProps<TBlock extends Block> = {
  block: TBlock;
  colors: ThemeColors;
  radius: Radius;
  shadow: Shadow;
  spacing: Spacing;
};

export const radiusClassName: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

export const shadowClassName: Record<Shadow, string> = {
  none: "shadow-none",
  soft: "shadow-sm",
  medium: "shadow-md",
  bold: "shadow-xl",
  elevated: "shadow-2xl",
};

export const spacingClassName: Record<Spacing, string> = {
  compact: "py-12 md:py-16",
  comfortable: "py-16 md:py-24",
  spacious: "py-20 md:py-32",
};
`;

const siteRendererTemplate = `import { BlockRenderer } from "../blocks/BlockRenderer";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import type { SiteData, SitePage, Shadow, Spacing } from "../../types/site";

type SiteRendererProps = {
  currentPage: SitePage;
  site: SiteData;
};

export function SiteRenderer({ currentPage, site }: SiteRendererProps) {
  const colors = site.theme.colors;
  const shadow = site.theme.shadow ?? "soft" satisfies Shadow;
  const spacing = site.theme.spacing ?? "comfortable" satisfies Spacing;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background, color: colors.text, fontFamily: site.theme.fontFamily }}
    >
      <SiteHeader site={site} />
      <main>
        {currentPage.blocks.filter((block) => block.type !== "footer").map((block) => (
          <BlockRenderer
            block={block}
            colors={colors}
            key={block.id}
            radius={site.theme.radius}
            shadow={shadow}
            spacing={spacing}
          />
        ))}
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
`;

const siteHeaderTemplate = `import { useState } from "react";

import { ElementRenderer } from "../elements/ElementRenderer";
import type { ElementNode, HeaderSlots, SiteData } from "../../types/site";

type SiteHeaderProps = {
  site: SiteData;
};

const heightClassName = {
  lg: "py-5",
  md: "py-4",
  sm: "py-3",
} as const;

export function SiteHeader({ site }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = site.theme.colors;
  const header = site.globalSections?.header;

  if (header?.enabled === false) {
    return null;
  }

  const slots = header?.slots ?? {};
  const isSticky = header?.sticky ?? true;
  const isTransparent = header?.transparent ?? header?.variant === "transparent";
  const headerHeight = header?.height ?? "md";

  return (
    <header className={\`\${isSticky ? "sticky top-0" : "relative"} z-30 border-b backdrop-blur \${isTransparent ? "bg-white/70" : "bg-white/95"}\`} style={{ borderColor: colors.border ?? colors.accent }}>
      <div className={\`mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 md:grid-cols-[1fr_auto_1fr] \${heightClassName[headerHeight]}\`}>
        <HeaderSlot elements={slots.left} site={site} />
        <HeaderSlot className="hidden justify-center md:flex" elements={slots.center} site={site} />
        <HeaderSlot className="hidden justify-end md:flex" elements={slots.right} site={site} />
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 justify-self-end text-sm font-semibold md:hidden" onClick={() => setIsOpen((value) => !value)} type="button">
          {isOpen ? "X" : "Menu"}
        </button>
      </div>
      {isOpen ? (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3">
            {mobileElements(slots).map((element) => (
              <ElementRenderer colors={colors} key={element.id} node={element} radius={site.theme.radius} />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeaderSlot({
  className = "flex",
  elements,
  site,
}: {
  className?: string;
  elements?: ElementNode[];
  site: SiteData;
}) {
  if (!elements || elements.length === 0) {
    return <div className={className} />;
  }

  return (
    <div className={\`\${className} min-w-0 flex-wrap items-center gap-5\`}>
      {elements.map((element) => (
        <ElementRenderer colors={site.theme.colors} key={element.id} node={element} radius={site.theme.radius} />
      ))}
    </div>
  );
}

function mobileElements(slots: HeaderSlots): ElementNode[] {
  const explicitMobile = slots.mobile ?? [];
  return explicitMobile.length > 0 ? explicitMobile : [...(slots.center ?? []), ...(slots.right ?? [])];
}
`;

const siteFooterTemplate = `import { Link } from "react-router-dom";

import { ElementRenderer } from "../elements/ElementRenderer";
import type { SiteData } from "../../types/site";

type SiteFooterProps = {
  site: SiteData;
};

export function SiteFooter({ site }: SiteFooterProps) {
  const colors = site.theme.colors;
  const footer = site.globalSections?.footer;

  if (footer?.enabled === false) {
    return null;
  }

  if ((footer?.elements?.length ?? 0) > 0 || (footer?.containers?.length ?? 0) > 0) {
    return (
      <footer className="border-t px-5 py-12" style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent, color: colors.text }}>
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
    <footer className="border-t px-5 py-12" style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent, color: colors.text }}>
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-start">
        <div className="max-w-sm">
          <p className="text-lg font-semibold">{site.brand.name}</p>
          {site.brand.tagline ? <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>{site.brand.tagline}</p> : null}
        </div>
        <nav className="flex flex-wrap gap-3 md:justify-end">
          {site.navigation.items.map((item) =>
            item.href.startsWith("#") || item.href.startsWith("http") ? (
              <a className="text-sm font-semibold" href={item.href} key={\`\${item.label}-\${item.href}\`} style={{ color: colors.mutedText }}>
                {item.label}
              </a>
            ) : (
              <Link className="text-sm font-semibold" key={\`\${item.label}-\${item.href}\`} style={{ color: colors.mutedText }} to={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-6xl text-xs" style={{ color: colors.mutedText }}>
        © {new Date().getFullYear()} {site.brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
`;

const elementRendererTemplate = `import { Link } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";

import { ContainerRenderer } from "../layout/ContainerRenderer";
import type { ContainerNode, ElementNode, ElementPropValue, ElementStyle, ElementTreeNode, Radius, ThemeColors } from "../../types/site";

type ElementRendererProps = {
  colors: ThemeColors;
  node: ElementTreeNode;
  radius: Radius;
};

type LeafProps = {
  colors: ThemeColors;
  node: ElementNode;
  radius: Radius;
};

const radiusClassName: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
  "2xl": "rounded-[1.75rem]",
};

export function ElementBlockRenderer({ colors, containers, elements, radius }: { colors: ThemeColors; containers?: ContainerNode[]; elements?: ElementNode[]; radius: Radius }) {
  const nodes: ElementTreeNode[] = (containers?.length ?? 0) > 0 ? [...(containers ?? [])] : [...(elements ?? [])];

  if (nodes.length === 0) return null;

  return (
    <section className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-6">
        {nodes.map((node) => <ElementRenderer colors={colors} key={node.id} node={node} radius={radius} />)}
      </div>
    </section>
  );
}

export function ElementRenderer({ colors, node, radius }: ElementRendererProps) {
  if ("children" in node) {
    return <ContainerRenderer colors={colors} node={node} radius={radius} />;
  }

  return <LeafElement colors={colors} node={node} radius={radius} />;
}

function LeafElement({ colors, node, radius }: LeafProps) {
  switch (node.type) {
    case "logo":
      return <LogoElement colors={colors} node={node} radius={radius} />;
    case "heading":
      return <HeadingElement colors={colors} node={node} radius={radius} />;
    case "text":
      return <TextElement colors={colors} node={node} radius={radius} />;
    case "button":
    case "signupButton":
      return <ButtonElement colors={colors} node={node} radius={radius} />;
    case "loginButton":
      return <LoginButtonElement colors={colors} node={node} radius={radius} />;
    case "link":
      return <ButtonElement colors={colors} node={{ ...node, props: { ...(node.props ?? {}), variant: "ghost" } }} radius={radius} />;
    case "badge":
      return <BadgeElement colors={colors} node={node} radius={radius} />;
    case "image":
      return <ImageElement colors={colors} node={node} radius={radius} />;
    case "menu":
      return <MenuElement colors={colors} node={node} radius={radius} />;
    case "socialLinks":
      return <SocialLinksElement colors={colors} node={node} radius={radius} />;
    case "card":
      return <CardElement colors={colors} node={node} radius={radius} />;
    case "form":
      return <FormElement colors={colors} node={node} radius={radius} />;
    case "input":
      return <input className="h-11 rounded-xl border px-3 text-sm outline-none" name={getString(node.props?.name)} placeholder={getString(node.props?.placeholder)} style={{ ...toCssStyle(node.style), borderColor: colors.border ?? colors.accent }} type={getString(node.props?.inputType) || "text"} />;
    case "textarea":
      return <textarea className="min-h-28 rounded-xl border px-3 py-3 text-sm outline-none" name={getString(node.props?.name)} placeholder={getString(node.props?.placeholder)} style={{ ...toCssStyle(node.style), borderColor: colors.border ?? colors.accent }} />;
    case "divider":
      return <hr className="w-full border-t" style={{ ...toCssStyle(node.style), borderColor: colors.border ?? colors.accent }} />;
    case "spacer":
      return <div style={{ height: getString(node.props?.height) || node.style?.height || "32px", ...toCssStyle(node.style) }} />;
    case "icon":
      return <span className={["inline-flex h-10 w-10 items-center justify-center text-sm font-semibold text-white", radiusClassName[radius]].join(" ")} style={{ ...toCssStyle(node.style), backgroundColor: node.style?.backgroundColor ?? colors.primary }}>{getString(node.props?.icon) || "*"}</span>;
  }
}

export function LogoElement({ colors, node }: LeafProps) {
  const label = getString(node.props?.label) || "Brand";
  const logoText = getString(node.props?.text) || label.slice(0, 2).toUpperCase();
  const imageUrl = getString(node.props?.imageUrl) || getString(node.props?.src);

  return (
    <SmartLink className="inline-flex w-fit items-center gap-3 text-sm font-semibold" href={getString(node.props?.href) || "/"} style={{ ...toCssStyle(node.style), color: node.style?.color ?? colors.text }}>
      {imageUrl ? <img alt={label} className="h-9 w-9 rounded-xl object-cover" src={imageUrl} /> : <span className="flex h-9 w-9 items-center justify-center rounded-2xl text-sm text-white" style={{ backgroundColor: colors.primary }}>{logoText}</span>}
      <span>{label}</span>
    </SmartLink>
  );
}

export function HeadingElement({ colors, node }: LeafProps) {
  const level = typeof node.props?.level === "number" ? node.props.level : 2;
  const content = getString(node.props?.text) || "Heading";
  const style = { ...toCssStyle(node.style), color: node.style?.color ?? colors.text };

  if (level === 1) return <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl" style={style}>{content}</h1>;
  if (level === 3) return <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl" style={style}>{content}</h3>;
  return <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl" style={style}>{content}</h2>;
}

export function TextElement({ colors, node }: LeafProps) {
  return <p className="text-base leading-7" style={{ ...toCssStyle(node.style), color: node.style?.color ?? colors.mutedText }}>{getString(node.props?.text) || "Text"}</p>;
}

export function ButtonElement({ colors, node, radius }: LeafProps) {
  const variant = getString(node.props?.variant) || (node.type === "loginButton" ? "ghost" : "primary");
  const isGhost = variant === "ghost" || variant === "secondary";

  return (
    <SmartLink className={["inline-flex min-h-11 w-fit items-center justify-center px-5 py-3 text-sm font-semibold transition hover:opacity-90", isGhost ? "border" : "text-white shadow-sm", radiusClassName[radius]].join(" ")} href={getString(node.props?.href) || "#"} style={{ ...toCssStyle(node.style), backgroundColor: node.style?.backgroundColor ?? (isGhost ? "transparent" : colors.primary), borderColor: colors.border ?? colors.accent, color: node.style?.color ?? (isGhost ? colors.text : "#ffffff") }}>
      {getString(node.props?.label) || getString(node.props?.text) || "Button"}
    </SmartLink>
  );
}

export function LoginButtonElement(props: LeafProps) {
  return <ButtonElement {...props} />;
}

export function BadgeElement({ colors, node }: LeafProps) {
  return <span className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ ...toCssStyle(node.style), backgroundColor: node.style?.backgroundColor ?? colors.primary + "14", color: node.style?.color ?? colors.primary }}>{getString(node.props?.text) || "Badge"}</span>;
}

export function ImageElement({ colors, node, radius }: LeafProps) {
  const src = getString(node.props?.src) || getString(node.props?.imageUrl);
  const alt = getString(node.props?.alt) || getString(node.props?.label) || "Image";

  if (src) return <img alt={alt} className={["min-h-32 w-full object-cover", radiusClassName[radius]].join(" ")} src={src} style={toCssStyle(node.style)} />;

  return <div aria-label={alt} className={["grid min-h-64 place-items-center border p-6 text-center text-sm", radiusClassName[radius]].join(" ")} role="img" style={{ ...toCssStyle(node.style), backgroundColor: node.style?.backgroundColor ?? colors.surface, borderColor: colors.border ?? colors.accent, color: node.style?.color ?? colors.mutedText }}>{getString(node.props?.label) || alt}</div>;
}

export function MenuElement({ colors, node }: LeafProps) {
  return (
    <nav className="flex flex-wrap items-center gap-4" style={toCssStyle(node.style)}>
      {getLinkItems(node.props?.items ?? node.props?.links).map((item) => (
        <SmartLink className="text-sm font-semibold transition hover:opacity-70" href={item.href} key={item.label + item.href} style={{ color: colors.mutedText }}>{item.label}</SmartLink>
      ))}
    </nav>
  );
}

export function SocialLinksElement(props: LeafProps) {
  return <MenuElement {...props} />;
}

export function CardElement({ colors, node, radius }: LeafProps) {
  return (
    <article className={["border p-6 shadow-sm", radiusClassName[radius]].join(" ")} style={{ ...toCssStyle(node.style), backgroundColor: node.style?.backgroundColor ?? colors.surface, borderColor: colors.border ?? colors.accent }}>
      <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{getString(node.props?.title) || "Card"}</h3>
      <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>{getString(node.props?.description)}</p>
    </article>
  );
}

export function FormElement({ colors, node, radius }: LeafProps) {
  const fields = getFormFields(node.props?.fields);

  return (
    <form className={["grid gap-3 border bg-white p-5 shadow-sm", radiusClassName[radius]].join(" ")} style={toCssStyle(node.style)}>
      {fields.map((field) => <input className="h-11 rounded-xl border px-3 text-sm outline-none" key={field.name} name={field.name} placeholder={field.placeholder} style={{ borderColor: colors.border ?? colors.accent }} type={field.type} />)}
      <button className={["px-5 py-3 text-sm font-semibold text-white", radiusClassName[radius]].join(" ")} style={{ backgroundColor: colors.primary }} type="button">{getString(node.props?.label) || "Submit"}</button>
    </form>
  );
}

function SmartLink({ children, className, href, style }: { children: ReactNode; className?: string; href: string; style?: CSSProperties }) {
  if (href.startsWith("/") && !href.startsWith("//")) return <Link className={className} style={style} to={href}>{children}</Link>;
  return <a className={className} href={href} style={style}>{children}</a>;
}

function toCssStyle(style: ElementStyle | undefined): CSSProperties {
  return {
    alignSelf: style?.alignSelf,
    backgroundColor: style?.backgroundColor,
    borderRadius: style?.borderRadius,
    color: style?.color,
    display: style?.display,
    height: style?.height,
    justifySelf: style?.justifySelf,
    margin: style?.margin,
    maxWidth: style?.maxWidth,
    padding: style?.padding,
    textAlign: style?.textAlign,
    width: style?.width,
  };
}

function getString(value: ElementPropValue | undefined): string {
  return typeof value === "string" ? value : "";
}

function getLinkItems(value: ElementPropValue | undefined): Array<{ href: string; label: string }> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const label = getString(item.label);
    const href = getString(item.href);
    return label && href ? [{ href, label }] : [];
  });
}

function getFormFields(value: ElementPropValue | undefined) {
  if (!Array.isArray(value)) return [{ name: "name", placeholder: "Name", type: "text" }, { name: "email", placeholder: "Email", type: "email" }];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const name = getString(item.name);
    return name ? [{ name, placeholder: getString(item.placeholder), type: getString(item.type) || "text" }] : [];
  });
}
`;

const containerRendererTemplate = `import type { CSSProperties } from "react";

import { ElementRenderer } from "../elements/ElementRenderer";
import { FreeformRenderer } from "./FreeformRenderer";
import type { ContainerNode, ElementNode, ElementTreeNode, Radius, ThemeColors } from "../../types/site";

type ContainerRendererProps = {
  colors: ThemeColors;
  node: ContainerNode;
  radius: Radius;
};

export function ContainerRenderer({ colors, node, radius }: ContainerRendererProps) {
  if (node.type === "freeform") {
    return <FreeformRenderer colors={colors} elements={node.children.filter(isElementNode)} layouts={[]} radius={radius} style={node.style} />;
  }

  const isGrid = node.type === "grid" || node.type === "columns" || node.type === "cardGroup";
  const isHorizontal = node.layout?.direction === "horizontal" || node.type === "row" || node.type === "headerBar";
  const style: CSSProperties = {
    alignItems: isGrid ? undefined : node.layout?.align,
    backgroundColor: node.style?.backgroundColor,
    borderRadius: node.style?.borderRadius,
    color: node.style?.color,
    gap: node.layout?.gap ?? node.style?.padding,
    height: node.style?.height,
    justifyContent: isGrid ? undefined : node.layout?.justify,
    margin: node.style?.margin,
    maxWidth: node.style?.maxWidth,
    padding: node.style?.padding,
    width: node.style?.width,
  };

  return (
    <div className={[isGrid ? "grid gap-4" : "flex flex-col gap-4", isGrid ? gridColumnClassName(node.layout?.columns ?? 3) : "", !isGrid && isHorizontal ? "md:flex-row" : "", node.layout?.wrap ? "flex-wrap" : ""].filter(Boolean).join(" ")} style={style}>
      {node.children.map((child) => <ElementRenderer colors={colors} key={child.id} node={child} radius={radius} />)}
    </div>
  );
}

function gridColumnClassName(columns: number | string) {
  if (typeof columns !== "number") return "";
  if (columns <= 2) return "grid-cols-1 md:grid-cols-2";
  if (columns === 3) return "grid-cols-1 md:grid-cols-3";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
}

function isElementNode(node: ElementTreeNode): node is ElementNode {
  return !("children" in node);
}
`;

const freeformRendererTemplate = `import type { CSSProperties } from "react";

import { ElementRenderer } from "../elements/ElementRenderer";
import type { ElementNode, ElementStyle, FreeformElementLayout, Radius, ThemeColors } from "../../types/site";

export function FreeformRenderer({ colors, elements = [], layouts = [], radius, style }: { colors: ThemeColors; elements?: ElementNode[]; layouts?: FreeformElementLayout[]; radius: Radius; style?: ElementStyle }) {
  const baseStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor,
    borderRadius: style?.borderRadius,
    height: style?.height,
    margin: style?.margin,
    maxWidth: style?.maxWidth,
    padding: style?.padding,
    width: style?.width,
  };

  if (layouts.length === 0) {
    return <div className="grid gap-4 md:relative md:min-h-96" style={baseStyle}>{elements.map((element) => <ElementRenderer colors={colors} key={element.id} node={element} radius={radius} />)}</div>;
  }

  return (
    <div className="relative overflow-hidden" style={baseStyle}>
      <div className="grid gap-4 md:hidden">{elements.map((element) => <ElementRenderer colors={colors} key={element.id} node={element} radius={radius} />)}</div>
      <div className="hidden md:block">
        {elements.map((element) => {
          const layout = layouts.find((item) => item.elementId === element.id && item.breakpoint === "desktop");
          const layoutStyle: CSSProperties | undefined = layout ? { height: layout.h, left: layout.x, position: "absolute", top: layout.y, width: layout.w, zIndex: layout.zIndex } : undefined;
          return <div key={element.id} style={layoutStyle}><ElementRenderer colors={colors} node={element} radius={radius} /></div>;
        })}
      </div>
    </div>
  );
}
`;

const blockRendererTemplate = `import { AboutBlock } from "./AboutBlock";
import { ContactBlock } from "./ContactBlock";
import { CtaBlock } from "./CtaBlock";
import { FaqBlock } from "./FaqBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { FooterBlock } from "./FooterBlock";
import { HeroBlock } from "./HeroBlock";
import { PortfolioBlock } from "./PortfolioBlock";
import { PricingBlock } from "./PricingBlock";
import { ServicesBlock } from "./ServicesBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { ElementBlockRenderer } from "../elements/ElementRenderer";
import { FreeformRenderer } from "../layout/FreeformRenderer";
import type { Block, Radius, Shadow, Spacing, ThemeColors } from "../../types/site";

type BlockRendererProps = {
  block: Block;
  colors: ThemeColors;
  radius: Radius;
  shadow: Shadow;
  spacing: Spacing;
};

export function BlockRenderer({ block, colors, radius, shadow, spacing }: BlockRendererProps) {
  if (block.type === "freeformSection") {
    return (
      <section className="px-6 py-16 md:px-10" style={{ backgroundColor: block.props.background }}>
        <div className="mx-auto max-w-6xl" style={{ minHeight: block.props.height }}>
          <FreeformRenderer colors={colors} elements={block.elements} layouts={block.props.layouts} radius={radius} style={{ height: block.props.height }} />
        </div>
      </section>
    );
  }

  if (shouldRenderElementTree(block)) {
    return <ElementBlockRenderer colors={colors} containers={block.containers} elements={block.elements} radius={radius} />;
  }

  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "features":
      return <FeaturesBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "about":
      return <AboutBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "services":
      return <ServicesBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "portfolio":
      return <PortfolioBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "testimonials":
      return <TestimonialsBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "pricing":
      return <PricingBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "faq":
      return <FaqBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "cta":
      return <CtaBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "contact":
      return <ContactBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    case "footer":
      return <FooterBlock block={block} colors={colors} radius={radius} shadow={shadow} spacing={spacing} />;
    default:
      return null;
  }
}

function shouldRenderElementTree(block: Block) {
  const hasElementTree = (block.elements?.length ?? 0) > 0 || (block.containers?.length ?? 0) > 0;
  const isLayoutBlock =
    block.type === "customSection" ||
    block.type === "containerSection" ||
    block.type === "gridSection" ||
    block.type === "columnsSection";

  return hasElementTree && (isLayoutBlock || block.variant === "element-tree");
}
`;

const heroBlockTemplate = `import { radiusClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { HeroBlock as HeroBlockType } from "../../types/site";

export function HeroBlock({ block, colors, radius, spacing }: BlockComponentProps<HeroBlockType>) {
  const isCentered = block.props.align === "center";

  return (
    <section className={\`\${spacingClassName[spacing]} px-5\`}>
      <div className={\`mx-auto grid max-w-6xl gap-10 \${isCentered ? "text-center" : "lg:grid-cols-[1.05fr_0.95fr] lg:items-center"}\`}>
        <div className={isCentered ? "mx-auto max-w-3xl" : "max-w-2xl"}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>Website</p>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl" style={{ color: colors.text }}>{block.props.title}</h1>
          <p className="mt-6 text-lg leading-8" style={{ color: colors.mutedText }}>{block.props.subtitle}</p>
          <div className={\`mt-8 flex flex-wrap gap-3 \${isCentered ? "justify-center" : ""}\`}>
            <a className={\`\${radiusClassName[radius]} inline-flex min-h-11 items-center px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90\`} href="#lead" style={{ backgroundColor: colors.primary }}>{block.props.buttonText}</a>
            {block.props.secondaryButtonText ? <a className={\`\${radiusClassName[radius]} inline-flex min-h-11 items-center border px-5 py-3 text-sm font-semibold transition hover:opacity-80\`} href="#features" style={{ borderColor: colors.border ?? colors.accent, color: colors.secondary }}>{block.props.secondaryButtonText}</a> : null}
          </div>
        </div>
        {!isCentered ? <div className={\`\${radiusClassName[radius]} min-h-80 border p-6 shadow-sm\`} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><div className="h-3 w-28 rounded-full" style={{ backgroundColor: colors.accent }} /><div className="mt-20 grid gap-3"><div className={\`\${radiusClassName[radius]} h-32\`} style={{ backgroundColor: colors.background }} /><p className="text-xs leading-5" style={{ color: colors.mutedText }}>{block.props.imagePrompt}</p></div></div> : null}
      </div>
    </section>
  );
}
`;

const featuresBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { FeaturesBlock as FeaturesBlockType } from "../../types/site";

export function FeaturesBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<FeaturesBlockType>) {
  return (
    <section className={\`\${spacingClassName[spacing]} px-5\`} id="features">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 leading-7" style={{ color: colors.mutedText }}>{block.props.subtitle}</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">{block.props.items.map((item) => <article className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} border p-6\`} key={item.title} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><div className={\`\${radiusClassName[radius]} mb-5 flex h-10 w-10 items-center justify-center text-sm font-semibold text-white\`} style={{ backgroundColor: colors.primary }}>{item.icon ?? item.title.slice(0, 1)}</div><h3 className="text-lg font-semibold" style={{ color: colors.text }}>{item.title}</h3><p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>{item.description}</p></article>)}</div>
      </div>
    </section>
  );
}
`;

const aboutBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { AboutBlock as AboutBlockType } from "../../types/site";

export function AboutBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<AboutBlockType>) {
  return (
    <section className={\`\${spacingClassName[spacing]} px-5\`}>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} min-h-72 border p-6\`} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><div className="h-3 w-24 rounded-full" style={{ backgroundColor: colors.accent }} /><p className="mt-24 text-xs leading-5" style={{ color: colors.mutedText }}>{block.props.imagePrompt}</p></div>
        <div><p className="mb-3 text-sm font-semibold" style={{ color: colors.primary }}>About</p><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 text-lg leading-8" style={{ color: colors.mutedText }}>{block.props.subtitle}</p><p className="mt-5 leading-7" style={{ color: colors.text }}>{block.props.body}</p></div>
      </div>
    </section>
  );
}
`;

const servicesBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { ServicesBlock as ServicesBlockType } from "../../types/site";

export function ServicesBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<ServicesBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`}><div className="mx-auto max-w-6xl"><div className="max-w-3xl"><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 leading-7" style={{ color: colors.mutedText }}>{block.props.subtitle}</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{block.props.items.map((item) => <article className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} border p-6\`} key={item.title} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><h3 className="text-lg font-semibold" style={{ color: colors.text }}>{item.title}</h3><p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>{item.description}</p><p className="mt-5 text-sm font-semibold" style={{ color: colors.primary }}>{item.price ?? item.duration}</p>{item.buttonText ? <a className={\`\${radiusClassName[radius]} mt-5 inline-flex px-4 py-2 text-sm font-semibold text-white\`} href="#lead" style={{ backgroundColor: colors.primary }}>{item.buttonText}</a> : null}</article>)}</div></div></section>;
}
`;

const portfolioBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { PortfolioBlock as PortfolioBlockType } from "../../types/site";

export function PortfolioBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<PortfolioBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`}><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 leading-7" style={{ color: colors.mutedText }}>{block.props.subtitle}</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{block.props.projects.map((project) => <article className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} overflow-hidden border\`} key={project.title} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><div className="h-40" style={{ backgroundColor: colors.background }} /><div className="p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: colors.primary }}>{project.category}</p><h3 className="mt-3 text-lg font-semibold" style={{ color: colors.text }}>{project.title}</h3><p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>{project.description}</p></div></article>)}</div></div></section>;
}
`;

const testimonialsBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { TestimonialsBlock as TestimonialsBlockType } from "../../types/site";

export function TestimonialsBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<TestimonialsBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`}><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 leading-7" style={{ color: colors.mutedText }}>{block.props.subtitle}</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{block.props.items.map((item) => <figure className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} border p-6\`} key={\`\${item.name}-\${item.quote}\`} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><blockquote className="leading-7" style={{ color: colors.text }}>&quot;{item.quote}&quot;</blockquote><figcaption className="mt-6 text-sm" style={{ color: colors.mutedText }}><strong style={{ color: colors.text }}>{item.name}</strong><span className="block">{item.role}</span></figcaption></figure>)}</div></div></section>;
}
`;

const pricingBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { PricingBlock as PricingBlockType } from "../../types/site";

export function PricingBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<PricingBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`}><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 leading-7" style={{ color: colors.mutedText }}>{block.props.subtitle}</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{block.props.plans.map((plan) => <article className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} border p-6\`} key={plan.name} style={{ backgroundColor: colors.surface, borderColor: plan.highlighted ? colors.primary : colors.border ?? colors.accent }}><h3 className="text-xl font-semibold" style={{ color: colors.text }}>{plan.name}</h3><p className="mt-4 text-4xl font-semibold" style={{ color: colors.text }}>{plan.price}</p><p className="mt-4 text-sm leading-6" style={{ color: colors.mutedText }}>{plan.description}</p><ul className="mt-6 grid gap-2 text-sm" style={{ color: colors.text }}>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a className={\`\${radiusClassName[radius]} mt-7 inline-flex min-h-11 items-center px-4 py-2 text-sm font-semibold text-white\`} href="#lead" style={{ backgroundColor: colors.primary }}>{plan.buttonText}</a></article>)}</div></div></section>;
}
`;

const faqBlockTemplate = `import { radiusClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { FaqBlock as FaqBlockType } from "../../types/site";

export function FaqBlock({ block, colors, radius, spacing }: BlockComponentProps<FaqBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`}><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><div className="mt-8 grid gap-3">{block.props.items.map((item) => <article className={\`\${radiusClassName[radius]} border p-5\`} key={item.question} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><h3 className="font-semibold" style={{ color: colors.text }}>{item.question}</h3><p className="mt-2 text-sm leading-6" style={{ color: colors.mutedText }}>{item.answer}</p></article>)}</div></div></section>;
}
`;

const ctaBlockTemplate = `import { radiusClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { CtaBlock as CtaBlockType } from "../../types/site";

export function CtaBlock({ block, colors, radius, spacing }: BlockComponentProps<CtaBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`} id="lead"><div className={\`\${radiusClassName[radius]} mx-auto max-w-6xl px-6 py-12 text-center md:px-10\`} style={{ backgroundColor: colors.secondary }}><h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{block.props.title}</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">{block.props.subtitle}</p><a className={\`\${radiusClassName[radius]} mt-8 inline-flex min-h-11 items-center px-5 py-3 text-sm font-semibold text-white\`} href="#lead" style={{ backgroundColor: colors.primary }}>{block.props.buttonText}</a></div></section>;
}
`;

const contactBlockTemplate = `import { radiusClassName, shadowClassName, spacingClassName, type BlockComponentProps } from "./block-types";
import type { ContactBlock as ContactBlockType } from "../../types/site";

export function ContactBlock({ block, colors, radius, shadow, spacing }: BlockComponentProps<ContactBlockType>) {
  return <section className={\`\${spacingClassName[spacing]} px-5\`} id="contact"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div><h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: colors.text }}>{block.props.title}</h2><p className="mt-4 leading-7" style={{ color: colors.mutedText }}>{block.props.subtitle}</p><div className="mt-6 grid gap-2 text-sm" style={{ color: colors.text }}>{block.props.email ? <p>{block.props.email}</p> : null}{block.props.phone ? <p>{block.props.phone}</p> : null}{block.props.kakao ? <p>{block.props.kakao}</p> : null}</div></div><form className={\`\${radiusClassName[radius]} \${shadowClassName[shadow]} grid gap-3 border p-6\`} style={{ backgroundColor: colors.surface, borderColor: colors.border ?? colors.accent }}><input className="rounded-xl border px-3 py-3 text-sm" placeholder="이름" style={{ borderColor: colors.border ?? colors.accent }} /><input className="rounded-xl border px-3 py-3 text-sm" placeholder="연락처" style={{ borderColor: colors.border ?? colors.accent }} /><textarea className="min-h-28 rounded-xl border px-3 py-3 text-sm" placeholder="문의 내용" style={{ borderColor: colors.border ?? colors.accent }} /><button className={\`\${radiusClassName[radius]} px-5 py-3 text-sm font-semibold text-white\`} style={{ backgroundColor: colors.primary }} type="button">{block.props.buttonText}</button></form></div></section>;
}
`;

const footerBlockTemplate = `import type { BlockComponentProps } from "./block-types";
import type { FooterBlock as FooterBlockType } from "../../types/site";

export function FooterBlock({ block, colors }: BlockComponentProps<FooterBlockType>) {
  return <footer className="border-t px-5 py-10" style={{ borderColor: colors.border ?? colors.accent }}><div className="mx-auto max-w-6xl"><p className="font-semibold" style={{ color: colors.text }}>{block.props.brandName}</p><p className="mt-2 text-sm" style={{ color: colors.mutedText }}>{block.props.description}</p><p className="mt-6 text-xs" style={{ color: colors.mutedText }}>{block.props.copyright}</p></div></footer>;
}
`;

const globalsCssTemplate = `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
}

* {
  box-sizing: border-box;
}
`;

function readmeTemplate(projectName: string) {
  return `# ${projectName}

Exported multi-page Vite React project.

## Install

\`\`\`bash
npm install
\`\`\`

## Run

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Edit content

- Edit \`src/data/site.json\` to change pages, navigation, blocks, copy, and style.
- Add a page by appending to \`site.pages\`; home routes to \`/\`, other pages route to \`/\${slug}\`.
- Update \`site.theme\` to change colors, radius, shadow, spacing, and font family.
- Header and footer are rendered from \`site.navigation\` and \`site.globalSections\`.
`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
