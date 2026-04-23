import type {
  Block,
  FooterBlock,
  HeroBlock,
  NavItem,
} from "@/types/page";
import type { ContainerNode, ElementNode, HeaderSlots } from "@/types/elements";

export function createElementsFromBlock(block: Block): ElementNode[] {
  switch (block.type) {
    case "hero":
      return createHeroElements(block);
    case "footer":
      return createFooterElements(block);
    default:
      return [];
  }
}

export function createContainersFromBlock(block: Block): ContainerNode[] {
  const elements = createElementsFromBlock(block);

  if (elements.length === 0) {
    return [];
  }

  if (block.type === "hero") {
    return [
      {
        id: `${block.id}-hero-stack`,
        type: "stack",
        layout: {
          direction: "vertical",
          gap: "24px",
        },
        children: elements,
      },
    ];
  }

  return [
    {
      id: `${block.id}-footer-row`,
      type: "row",
      layout: {
        align: "center",
        direction: "horizontal",
        gap: "24px",
        justify: "space-between",
        wrap: true,
      },
      children: elements,
    },
  ];
}

export function withMigratedElementData<TBlock extends Block>(block: TBlock): TBlock {
  if ((block.elements?.length ?? 0) > 0 || (block.containers?.length ?? 0) > 0) {
    return block;
  }

  const elements = createElementsFromBlock(block);
  const containers = createContainersFromBlock(block);

  if (elements.length === 0 && containers.length === 0) {
    return block;
  }

  return {
    ...block,
    containers,
    elements,
  };
}

export function createHeaderElements(input: {
  brandName: string;
  cta?: NavItem;
  logoText?: string;
  navItems: NavItem[];
}): ElementNode[] {
  const slots = createHeaderSlots(input);

  return [
    ...(slots.left ?? []),
    ...(slots.center ?? []),
    ...(slots.right ?? []),
    ...(slots.mobile ?? []),
  ];
}

export function createHeaderSlots(input: {
  brandName: string;
  cta?: NavItem;
  logoText?: string;
  navItems: NavItem[];
}): HeaderSlots {
  return {
    left: [
      {
        id: "header-logo",
        type: "logo",
        props: {
          href: "/",
          label: input.brandName,
          text: input.logoText ?? input.brandName.slice(0, 2).toUpperCase(),
        },
      },
    ],
    center: [
      {
        id: "header-menu",
        type: "menu",
        props: {
          items: input.navItems,
        },
      },
    ],
    right: [
      {
        id: "header-login",
        type: "loginButton",
        props: {
          href: "/login",
          label: "로그인",
        },
      },
      ...(input.cta
        ? [
            {
              id: "header-cta",
              type: "signupButton" as const,
              props: {
                href: input.cta.href,
                label: input.cta.label,
              },
            },
          ]
        : []),
    ],
    mobile: [],
  };
}

export function createHeaderElementsLegacy(input: {
  brandName: string;
  cta?: NavItem;
  logoText?: string;
  navItems: NavItem[];
}): ElementNode[] {
  return [
    {
      id: "header-logo",
      type: "logo",
      props: {
        href: "/",
        label: input.brandName,
        text: input.logoText ?? input.brandName.slice(0, 2).toUpperCase(),
      },
    },
    {
      id: "header-menu",
      type: "menu",
      props: {
        items: input.navItems,
      },
    },
    ...(input.cta
      ? [
          {
            id: "header-cta",
            type: "signupButton" as const,
            props: {
              href: input.cta.href,
              label: input.cta.label,
            },
          },
        ]
      : []),
  ];
}

function createHeroElements(block: HeroBlock): ElementNode[] {
  const elements: ElementNode[] = [
    {
      id: `${block.id}-eyebrow`,
      type: "badge",
      props: {
        text: "Website Builder",
      },
    },
    {
      id: `${block.id}-heading`,
      type: "heading",
      props: {
        level: 1,
        text: block.props.title,
      },
    },
    {
      id: `${block.id}-subtitle`,
      type: "text",
      props: {
        text: block.props.subtitle,
      },
    },
    {
      id: `${block.id}-primary-button`,
      type: "button",
      props: {
        href: "#lead",
        label: block.props.buttonText,
      },
    },
  ];

  if (block.props.secondaryButtonText) {
    elements.push({
      id: `${block.id}-secondary-button`,
      type: "link",
      props: {
        href: "#features",
        label: block.props.secondaryButtonText,
      },
    });
  }

  elements.push({
    id: `${block.id}-image`,
    type: "image",
    props: {
      alt: block.props.imagePrompt,
      label: block.props.imagePrompt,
    },
  });

  return elements;
}

function createFooterElements(block: FooterBlock): ElementNode[] {
  return [
    {
      id: `${block.id}-logo`,
      type: "logo",
      props: {
        href: "/",
        label: block.props.brandName,
        text: block.props.brandName.slice(0, 2).toUpperCase(),
      },
    },
    {
      id: `${block.id}-description`,
      type: "text",
      props: {
        text: block.props.description,
      },
    },
    {
      id: `${block.id}-menu`,
      type: "menu",
      props: {
        items: block.props.links,
      },
    },
    {
      id: `${block.id}-copyright`,
      type: "text",
      props: {
        text: block.props.copyright,
      },
    },
  ];
}
