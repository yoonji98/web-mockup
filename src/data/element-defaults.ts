import { v4 as createId } from "uuid";

import type { ContainerNode, ElementNode, ElementNodeType } from "@/types/elements";

type ElementDefault = Omit<ElementNode, "id">;

export type ElementLibraryCategory = {
  items: ElementNodeType[];
  name: string;
};

export const elementLibraryCategories: ElementLibraryCategory[] = [
  { name: "Basic", items: ["heading", "text", "button", "image"] },
  { name: "Brand", items: ["logo", "menu", "loginButton", "signupButton"] },
  { name: "Content", items: ["card", "form", "divider", "spacer"] },
];

export const elementLabels: Record<ElementNodeType, string> = {
  badge: "Badge",
  button: "Button",
  card: "Card",
  divider: "Divider",
  form: "Form",
  heading: "Heading",
  icon: "Icon",
  image: "Image",
  input: "Input",
  link: "Link",
  loginButton: "Login Button",
  logo: "Logo",
  menu: "Menu",
  signupButton: "Signup Button",
  socialLinks: "Social Links",
  spacer: "Spacer",
  text: "Text",
  textarea: "Textarea",
};

export const elementDefaults: Record<ElementNodeType, ElementDefault> = {
  logo: {
    type: "logo",
    props: {
      href: "/",
      label: "브랜드",
      logoType: "text",
      text: "Brand",
    },
  },
  text: {
    type: "text",
    props: {
      text: "여기에 설명 문구를 입력하세요.",
    },
  },
  heading: {
    type: "heading",
    props: {
      level: 2,
      text: "새로운 제목",
    },
  },
  button: {
    type: "button",
    props: {
      href: "#",
      label: "버튼",
      size: "md",
      variant: "primary",
    },
  },
  image: {
    type: "image",
    props: {
      alt: "이미지",
      label: "이미지 영역",
      placeholderText: "이미지 영역",
      src: "",
    },
  },
  icon: {
    type: "icon",
    props: {
      icon: "★",
    },
  },
  menu: {
    type: "menu",
    props: {
      items: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },
  link: {
    type: "link",
    props: {
      href: "#",
      label: "링크",
    },
  },
  badge: {
    type: "badge",
    props: {
      text: "Badge",
    },
  },
  card: {
    type: "card",
    props: {
      buttonLabel: "자세히 보기",
      description: "카드 설명을 입력하세요.",
      title: "카드 제목",
    },
  },
  form: {
    type: "form",
    props: {
      label: "문의 보내기",
      submitLabel: "문의 보내기",
      fields: [
        { name: "name", placeholder: "이름", type: "text" },
        { name: "email", placeholder: "이메일", type: "email" },
      ],
    },
  },
  input: {
    type: "input",
    props: {
      inputType: "text",
      name: "name",
      placeholder: "입력",
    },
  },
  textarea: {
    type: "textarea",
    props: {
      name: "message",
      placeholder: "내용",
    },
  },
  divider: {
    type: "divider",
    props: {},
  },
  spacer: {
    type: "spacer",
    props: {
      height: "32px",
    },
  },
  socialLinks: {
    type: "socialLinks",
    props: {
      links: [
        { label: "Instagram", href: "https://instagram.com" },
        { label: "YouTube", href: "https://youtube.com" },
      ],
    },
  },
  loginButton: {
    type: "loginButton",
    props: {
      href: "/login",
      label: "로그인",
      variant: "ghost",
    },
  },
  signupButton: {
    type: "signupButton",
    props: {
      href: "/contact",
      label: "문의하기",
      variant: "primary",
    },
  },
};

export function createDefaultElement(type: ElementNodeType): ElementNode {
  return {
    id: createId(),
    ...structuredClone(elementDefaults[type]),
  };
}

export function createDefaultContainer(type: ContainerNode["type"] = "stack"): ContainerNode {
  return {
    id: createId(),
    type,
    layout: {
      align: type === "row" || type === "headerBar" ? "center" : undefined,
      columns: type === "grid" || type === "columns" || type === "cardGroup" ? 3 : undefined,
      direction: type === "row" || type === "headerBar" ? "horizontal" : "vertical",
      gap: "16px",
      justify: type === "headerBar" ? "space-between" : undefined,
      wrap: type === "row" || type === "headerBar",
    },
    style: {
      maxWidth: "1120px",
      margin: "0 auto",
    },
    children: [],
  };
}
