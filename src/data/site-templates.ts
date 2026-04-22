import { blockDefaults } from "@/data/block-defaults";
import type { Block, BlockType, SitePage, SitePageType } from "@/types/page";
import type { SiteTemplate } from "@/types/template";

function block(type: BlockType, id: string): Block {
  return { id, ...structuredClone(blockDefaults[type]) } as Block;
}

function page(
  id: string,
  title: string,
  slug: string,
  type: SitePageType,
  blocks: Block[],
): SitePage {
  return {
    id,
    title,
    slug,
    type,
    seo: {
      title,
      description: `${title} 페이지`,
    },
    blocks,
  };
}

export const siteTemplates: SiteTemplate[] = [
  {
    id: "ai-saas-landing",
    name: "AI SaaS Landing",
    description: "제품 가치, 기능, 가격, CTA를 빠르게 검증하는 SaaS 랜딩페이지",
    siteType: "landing",
    moodTags: ["saas", "conversion", "clean"],
    recommendedStylePackIds: ["clean-saas", "soft-editorial"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
    ],
    pages: [
      page("tpl-saas-home", "Home", "home", "home", [
        block("hero", "tpl-saas-hero"),
        block("features", "tpl-saas-features"),
        block("testimonials", "tpl-saas-testimonials"),
        block("cta", "tpl-saas-cta"),
      ]),
      page("tpl-saas-pricing", "Pricing", "pricing", "pricing", [
        block("pricing", "tpl-saas-pricing-block"),
        block("faq", "tpl-saas-faq"),
      ]),
    ],
  },
  {
    id: "local-cafe",
    name: "Local Cafe Website",
    description: "메뉴, 매장 분위기, 예약/방문 CTA를 강조하는 로컬 카페 사이트",
    siteType: "cafe",
    moodTags: ["local", "warm", "store"],
    recommendedStylePackIds: ["warm-local", "soft-editorial"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    pages: [
      page("tpl-cafe-home", "Home", "home", "home", [
        block("hero", "tpl-cafe-hero"),
        block("about", "tpl-cafe-about"),
        block("services", "tpl-cafe-services"),
      ]),
      page("tpl-cafe-contact", "Contact", "contact", "contact", [
        block("contact", "tpl-cafe-contact-block"),
      ]),
    ],
  },
  {
    id: "beauty-clinic",
    name: "Beauty Clinic Website",
    description: "신뢰, 시술 안내, 상담 전환을 중심으로 구성한 클리닉 웹사이트",
    siteType: "clinic",
    moodTags: ["clinic", "premium", "trust"],
    recommendedStylePackIds: ["medical-clean", "luxury-minimal"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    pages: [
      page("tpl-beauty-home", "Home", "home", "home", [
        block("hero", "tpl-beauty-hero"),
        block("features", "tpl-beauty-features"),
        block("testimonials", "tpl-beauty-testimonials"),
      ]),
      page("tpl-beauty-services", "Services", "services", "services", [
        block("services", "tpl-beauty-services-block"),
        block("faq", "tpl-beauty-faq"),
      ]),
      page("tpl-beauty-contact", "Contact", "contact", "contact", [
        block("contact", "tpl-beauty-contact-block"),
      ]),
    ],
  },
  {
    id: "personal-portfolio",
    name: "Personal Portfolio",
    description: "소개, 대표 작업, 문의를 담은 개인 포트폴리오",
    siteType: "portfolio",
    moodTags: ["portfolio", "minimal", "case-study"],
    recommendedStylePackIds: ["mono-portfolio", "luxury-minimal"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
    pages: [
      page("tpl-portfolio-home", "Home", "home", "home", [
        block("hero", "tpl-portfolio-hero"),
        block("about", "tpl-portfolio-about"),
        block("portfolio", "tpl-portfolio-work"),
      ]),
      page("tpl-portfolio-contact", "Contact", "contact", "contact", [
        block("contact", "tpl-portfolio-contact"),
      ]),
    ],
  },
  {
    id: "coaching-course",
    name: "Coaching / Course Website",
    description: "강의 소개, 커리큘럼, 후기, 신청 CTA가 있는 교육 사이트",
    siteType: "education",
    moodTags: ["course", "coaching", "lead"],
    recommendedStylePackIds: ["bold-creator", "calm-wellness"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Course", href: "/services" },
      { label: "FAQ", href: "/faq" },
    ],
    pages: [
      page("tpl-course-home", "Home", "home", "home", [
        block("hero", "tpl-course-hero"),
        block("services", "tpl-course-services"),
        block("testimonials", "tpl-course-testimonials"),
        block("cta", "tpl-course-cta"),
      ]),
      page("tpl-course-faq", "FAQ", "faq", "custom", [block("faq", "tpl-course-faq-block")]),
    ],
  },
  {
    id: "small-business",
    name: "Small Business Homepage",
    description: "회사 소개, 서비스, 문의 페이지를 갖춘 소규모 비즈니스 홈페이지",
    siteType: "business",
    moodTags: ["business", "local", "trust"],
    recommendedStylePackIds: ["clean-saas", "warm-local"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    pages: [
      page("tpl-business-home", "Home", "home", "home", [
        block("hero", "tpl-business-hero"),
        block("features", "tpl-business-features"),
        block("services", "tpl-business-services"),
      ]),
      page("tpl-business-about", "About", "about", "about", [block("about", "tpl-business-about-block")]),
      page("tpl-business-contact", "Contact", "contact", "contact", [
        block("contact", "tpl-business-contact-block"),
      ]),
    ],
  },
  {
    id: "creative-agency",
    name: "Creative Agency Website",
    description: "작업 사례와 서비스 역량을 강조하는 에이전시 사이트",
    siteType: "agency",
    moodTags: ["agency", "creative", "bold"],
    recommendedStylePackIds: ["bold-creator", "dark-premium"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/portfolio" },
      { label: "Services", href: "/services" },
    ],
    pages: [
      page("tpl-agency-home", "Home", "home", "home", [
        block("hero", "tpl-agency-hero"),
        block("portfolio", "tpl-agency-work"),
        block("cta", "tpl-agency-cta"),
      ]),
      page("tpl-agency-services", "Services", "services", "services", [
        block("services", "tpl-agency-services-block"),
      ]),
    ],
  },
  {
    id: "product-showcase",
    name: "Product Showcase Website",
    description: "제품 장점, 사용 사례, 가격 CTA를 보여주는 제품 소개 사이트",
    siteType: "shop",
    moodTags: ["product", "showcase", "commerce"],
    recommendedStylePackIds: ["playful-pop", "clean-saas"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
    ],
    pages: [
      page("tpl-product-home", "Home", "home", "home", [
        block("hero", "tpl-product-hero"),
        block("features", "tpl-product-features"),
        block("portfolio", "tpl-product-gallery"),
      ]),
      page("tpl-product-pricing", "Pricing", "pricing", "pricing", [
        block("pricing", "tpl-product-pricing-block"),
      ]),
    ],
  },
  {
    id: "medical-consultation",
    name: "Medical / Consultation Website",
    description: "전문성, 상담 예약, FAQ를 중심으로 한 의료 상담 사이트",
    siteType: "clinic",
    moodTags: ["medical", "consultation", "clean"],
    recommendedStylePackIds: ["medical-clean", "calm-wellness"],
    navigation: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    pages: [
      page("tpl-medical-home", "Home", "home", "home", [
        block("hero", "tpl-medical-hero"),
        block("features", "tpl-medical-features"),
        block("faq", "tpl-medical-faq"),
      ]),
      page("tpl-medical-services", "Services", "services", "services", [
        block("services", "tpl-medical-services-block"),
      ]),
      page("tpl-medical-contact", "Contact", "contact", "contact", [
        block("contact", "tpl-medical-contact-block"),
      ]),
    ],
  },
];
