import type { PageDefinition, PageDefinitionCategory, PageKind } from "@/types/page-catalog";
import type { SitePageType } from "@/types/page";

type PageInput = Omit<
  PageDefinition,
  | "canBeFrontendScaffold"
  | "canBeFullStack"
  | "canBeStaticMockup"
  | "complexity"
  | "defaultBlocks"
  | "description"
  | "recommendedFor"
  | "routePattern"
> & {
  blocks?: string[];
  complexity?: PageDefinition["complexity"];
  description?: string;
  model?: string;
  recommendedFor?: string[];
  requires?: string[];
  route?: string;
};

const categoryDefaults: Record<PageDefinitionCategory, string[]> = {
  admin: ["admin", "dashboard"],
  commerce: ["shop", "ecommerce"],
  community: ["community", "social"],
  company: ["business", "agency", "company"],
  content: ["blog", "content", "media"],
  global: ["all"],
  government: ["government", "public"],
  portfolio: ["portfolio", "creator"],
  saas: ["saas", "app", "startup"],
};

const defaultBlocksByKind: Record<PageKind, string[]> = {
  auth: ["containerSection"],
  checkout: ["containerSection", "contact"],
  dashboard: ["containerSection", "gridSection"],
  detail: ["hero", "about", "cta"],
  error: ["cta"],
  form: ["contact", "faq"],
  list: ["hero", "gridSection", "cta"],
  settings: ["containerSection"],
  static: ["hero", "about", "cta"],
};

function page(input: PageInput): PageDefinition {
  const complexity = input.complexity ?? defaultComplexity(input.pageKind);
  const requires = input.requires;

  return {
    canBeFrontendScaffold: input.pageKind !== "checkout" || Boolean(requires?.includes("payment")),
    canBeFullStack: input.pageKind !== "static" || complexity >= 2,
    canBeStaticMockup: input.pageKind !== "settings" && input.pageKind !== "dashboard",
    category: input.category,
    complexity,
    dataModel: input.model,
    defaultBlocks: input.blocks ?? defaultBlocksByKind[input.pageKind],
    description: input.description ?? `${input.name} 페이지`,
    id: input.id,
    name: input.name,
    pageKind: input.pageKind,
    recommendedFor: input.recommendedFor ?? categoryDefaults[input.category],
    requires,
    routePattern: input.route ?? `/${input.id.replace(/^(global|commerce|portfolio|saas|content|community|company|government|admin)-/, "")}`,
  };
}

function defaultComplexity(kind: PageKind): PageDefinition["complexity"] {
  if (kind === "static" || kind === "error") {
    return 1;
  }

  if (kind === "list" || kind === "form" || kind === "auth") {
    return 2;
  }

  if (kind === "detail" || kind === "checkout" || kind === "settings") {
    return 3;
  }

  return 4;
}

export const pageCatalog: PageDefinition[] = [
  page({ id: "global-home", name: "홈", category: "global", pageKind: "static", route: "/", blocks: ["hero", "features", "cta"] }),
  page({ id: "global-about", name: "소개", category: "global", pageKind: "static", route: "/about" }),
  page({ id: "global-contact", name: "문의", category: "global", pageKind: "form", route: "/contact", requires: ["contact-form"] }),
  page({ id: "global-terms", name: "이용약관", category: "global", pageKind: "static", route: "/terms", blocks: ["containerSection"] }),
  page({ id: "global-privacy", name: "개인정보처리방침", category: "global", pageKind: "static", route: "/privacy", blocks: ["containerSection"] }),
  page({ id: "global-404", name: "404", category: "global", pageKind: "error", route: "/404", blocks: ["cta"] }),

  page({ id: "commerce-category-list", name: "카테고리 리스트", category: "commerce", pageKind: "list", route: "/categories", model: "products", requires: ["product-catalog"] }),
  page({ id: "commerce-category-detail", name: "카테고리 상세", category: "commerce", pageKind: "detail", route: "/categories/:category", model: "products", requires: ["product-catalog"] }),
  page({ id: "commerce-search-results", name: "검색 결과", category: "commerce", pageKind: "list", route: "/search", model: "products", requires: ["search"] }),
  page({ id: "commerce-product-detail", name: "상품 상세", category: "commerce", pageKind: "detail", route: "/products/:id", model: "products", requires: ["product-catalog"] }),
  page({ id: "commerce-review-list", name: "리뷰 리스트", category: "commerce", pageKind: "list", route: "/reviews", model: "reviews", requires: ["reviews"] }),
  page({ id: "commerce-review-write", name: "리뷰 작성", category: "commerce", pageKind: "form", route: "/reviews/write", requires: ["reviews", "auth"] }),
  page({ id: "commerce-qna-list", name: "Q&A 리스트", category: "commerce", pageKind: "list", route: "/qna", requires: ["support"] }),
  page({ id: "commerce-cart", name: "장바구니", category: "commerce", pageKind: "checkout", route: "/cart", requires: ["cart"] }),
  page({ id: "commerce-checkout", name: "주문서 작성", category: "commerce", pageKind: "checkout", route: "/checkout", requires: ["cart", "payment"] }),
  page({ id: "commerce-payment-success", name: "결제 완료", category: "commerce", pageKind: "checkout", route: "/checkout/success", requires: ["payment"] }),
  page({ id: "commerce-payment-fail", name: "결제 실패", category: "commerce", pageKind: "checkout", route: "/checkout/fail", requires: ["payment"] }),
  page({ id: "commerce-my-page", name: "마이페이지", category: "commerce", pageKind: "dashboard", route: "/my", requires: ["auth"] }),
  page({ id: "commerce-orders", name: "주문 내역", category: "commerce", pageKind: "list", route: "/my/orders", requires: ["auth", "orders"] }),
  page({ id: "commerce-shipping", name: "배송 조회", category: "commerce", pageKind: "detail", route: "/my/shipping", requires: ["orders"] }),
  page({ id: "commerce-wishlist", name: "찜 목록", category: "commerce", pageKind: "list", route: "/wishlist", requires: ["auth", "wishlist"] }),
  page({ id: "commerce-events", name: "이벤트", category: "commerce", pageKind: "list", route: "/events" }),
  page({ id: "commerce-faq", name: "FAQ", category: "commerce", pageKind: "static", route: "/faq", blocks: ["faq"] }),
  page({ id: "commerce-inquiry", name: "1:1 문의", category: "commerce", pageKind: "form", route: "/inquiry", requires: ["support"] }),

  page({ id: "portfolio-home", name: "홈", category: "portfolio", pageKind: "static", route: "/", blocks: ["hero", "portfolio", "cta"] }),
  page({ id: "portfolio-about", name: "About", category: "portfolio", pageKind: "static", route: "/about" }),
  page({ id: "portfolio-skills", name: "Skills", category: "portfolio", pageKind: "static", route: "/skills", blocks: ["features"] }),
  page({ id: "portfolio-project-list", name: "프로젝트 리스트", category: "portfolio", pageKind: "list", route: "/projects", model: "projects" }),
  page({ id: "portfolio-project-detail", name: "프로젝트 상세", category: "portfolio", pageKind: "detail", route: "/projects/:id", model: "projects" }),
  page({ id: "portfolio-blog", name: "블로그", category: "portfolio", pageKind: "list", route: "/blog", model: "posts" }),
  page({ id: "portfolio-contact", name: "Contact", category: "portfolio", pageKind: "form", route: "/contact", requires: ["contact-form"] }),
  page({ id: "portfolio-resume", name: "이력서 다운로드", category: "portfolio", pageKind: "static", route: "/resume", requires: ["download"] }),

  page({ id: "saas-landing", name: "랜딩", category: "saas", pageKind: "static", route: "/", blocks: ["hero", "features", "pricing", "cta"] }),
  page({ id: "saas-features", name: "기능 소개", category: "saas", pageKind: "static", route: "/features", blocks: ["features"] }),
  page({ id: "saas-pricing", name: "가격", category: "saas", pageKind: "static", route: "/pricing", blocks: ["pricing"] }),
  page({ id: "saas-login", name: "로그인", category: "saas", pageKind: "auth", route: "/login", requires: ["auth"] }),
  page({ id: "saas-signup", name: "회원가입", category: "saas", pageKind: "auth", route: "/signup", requires: ["auth"] }),
  page({ id: "saas-onboarding", name: "온보딩", category: "saas", pageKind: "form", route: "/onboarding", requires: ["auth"] }),
  page({ id: "saas-dashboard", name: "대시보드", category: "saas", pageKind: "dashboard", route: "/dashboard", requires: ["auth", "dashboard"] }),
  page({ id: "saas-settings", name: "설정", category: "saas", pageKind: "settings", route: "/settings", requires: ["auth"] }),
  page({ id: "saas-subscription", name: "구독 관리", category: "saas", pageKind: "settings", route: "/billing", requires: ["auth", "payment"] }),
  page({ id: "saas-billing-history", name: "결제 내역", category: "saas", pageKind: "list", route: "/billing/history", requires: ["auth", "payment"] }),

  page({ id: "content-home", name: "홈", category: "content", pageKind: "static", route: "/", blocks: ["hero", "gridSection"] }),
  page({ id: "content-category", name: "카테고리", category: "content", pageKind: "list", route: "/category/:slug", model: "posts" }),
  page({ id: "content-tags", name: "태그", category: "content", pageKind: "list", route: "/tags", model: "posts" }),
  page({ id: "content-post-list", name: "게시글 리스트", category: "content", pageKind: "list", route: "/posts", model: "posts" }),
  page({ id: "content-post-detail", name: "게시글 상세", category: "content", pageKind: "detail", route: "/posts/:id", model: "posts" }),
  page({ id: "content-search", name: "검색", category: "content", pageKind: "list", route: "/search", model: "posts", requires: ["search"] }),
  page({ id: "content-comments", name: "댓글", category: "content", pageKind: "form", route: "/comments", requires: ["comments"] }),
  page({ id: "content-bookmarks", name: "북마크", category: "content", pageKind: "list", route: "/bookmarks", requires: ["auth", "bookmarks"] }),

  page({ id: "community-feed", name: "홈 피드", category: "community", pageKind: "list", route: "/", requires: ["feed"] }),
  page({ id: "community-post-detail", name: "게시글 상세", category: "community", pageKind: "detail", route: "/posts/:id", requires: ["posts"] }),
  page({ id: "community-post-write", name: "글 작성", category: "community", pageKind: "form", route: "/write", requires: ["auth", "posts"] }),
  page({ id: "community-comments", name: "댓글", category: "community", pageKind: "form", route: "/comments", requires: ["comments"] }),
  page({ id: "community-profile", name: "프로필", category: "community", pageKind: "detail", route: "/profile/:id", requires: ["auth"] }),
  page({ id: "community-follow", name: "팔로우", category: "community", pageKind: "list", route: "/follow", requires: ["auth", "follow"] }),
  page({ id: "community-notifications", name: "알림", category: "community", pageKind: "list", route: "/notifications", requires: ["auth"] }),
  page({ id: "community-messages", name: "메시지", category: "community", pageKind: "list", route: "/messages", requires: ["auth", "messages"] }),

  page({ id: "company-home", name: "홈", category: "company", pageKind: "static", route: "/", blocks: ["hero", "services", "cta"] }),
  page({ id: "company-about", name: "회사 소개", category: "company", pageKind: "static", route: "/about" }),
  page({ id: "company-vision", name: "비전/미션", category: "company", pageKind: "static", route: "/vision" }),
  page({ id: "company-services", name: "서비스 리스트", category: "company", pageKind: "list", route: "/services", model: "services" }),
  page({ id: "company-service-detail", name: "서비스 상세", category: "company", pageKind: "detail", route: "/services/:id", model: "services" }),
  page({ id: "company-portfolio", name: "포트폴리오", category: "company", pageKind: "list", route: "/portfolio", model: "projects" }),
  page({ id: "company-clients", name: "고객사", category: "company", pageKind: "static", route: "/clients" }),
  page({ id: "company-case-studies", name: "사례 연구", category: "company", pageKind: "list", route: "/case-studies", model: "projects" }),
  page({ id: "company-careers", name: "채용 공고", category: "company", pageKind: "list", route: "/careers", model: "jobs" }),
  page({ id: "company-apply", name: "지원하기", category: "company", pageKind: "form", route: "/careers/apply", requires: ["application-form"] }),
  page({ id: "company-news", name: "뉴스", category: "company", pageKind: "list", route: "/news", model: "posts" }),
  page({ id: "company-notices", name: "공지사항", category: "company", pageKind: "list", route: "/notices", model: "notices" }),
  page({ id: "company-contact", name: "문의", category: "company", pageKind: "form", route: "/contact", requires: ["contact-form"] }),

  page({ id: "government-about", name: "기관 소개", category: "government", pageKind: "static", route: "/about" }),
  page({ id: "government-org", name: "조직도", category: "government", pageKind: "static", route: "/organization" }),
  page({ id: "government-history", name: "연혁", category: "government", pageKind: "static", route: "/history" }),
  page({ id: "government-location", name: "위치", category: "government", pageKind: "static", route: "/location" }),
  page({ id: "government-policy", name: "정책 안내", category: "government", pageKind: "list", route: "/policy" }),
  page({ id: "government-laws", name: "법령/규정", category: "government", pageKind: "list", route: "/laws" }),
  page({ id: "government-press", name: "보도자료", category: "government", pageKind: "list", route: "/press", model: "posts" }),
  page({ id: "government-reports", name: "연구보고서", category: "government", pageKind: "list", route: "/reports", model: "notices" }),
  page({ id: "government-resources", name: "자료실", category: "government", pageKind: "list", route: "/resources", model: "notices" }),
  page({ id: "government-civil-apply", name: "민원 신청", category: "government", pageKind: "form", route: "/civil/apply", requires: ["civil-service"] }),
  page({ id: "government-civil-status", name: "민원 조회", category: "government", pageKind: "list", route: "/civil/status", requires: ["civil-service", "auth"] }),
  page({ id: "government-forms", name: "서식 다운로드", category: "government", pageKind: "list", route: "/forms", requires: ["download"] }),
  page({ id: "government-notices", name: "공지사항", category: "government", pageKind: "list", route: "/notices", model: "notices" }),
  page({ id: "government-info-request", name: "정보공개 청구", category: "government", pageKind: "form", route: "/info-request", requires: ["civil-service"] }),

  page({ id: "admin-dashboard", name: "대시보드", category: "admin", pageKind: "dashboard", route: "/admin", requires: ["admin", "auth"] }),
  page({ id: "admin-users", name: "사용자 목록", category: "admin", pageKind: "list", route: "/admin/users", requires: ["admin", "auth"] }),
  page({ id: "admin-user-detail", name: "사용자 상세", category: "admin", pageKind: "detail", route: "/admin/users/:id", requires: ["admin", "auth"] }),
  page({ id: "admin-roles", name: "권한 관리", category: "admin", pageKind: "settings", route: "/admin/roles", requires: ["admin", "auth"] }),
  page({ id: "admin-orders", name: "주문 목록", category: "admin", pageKind: "list", route: "/admin/orders", model: "products", requires: ["admin", "orders"] }),
  page({ id: "admin-products", name: "상품 목록", category: "admin", pageKind: "list", route: "/admin/products", model: "products", requires: ["admin", "product-catalog"] }),
  page({ id: "admin-product-edit", name: "상품 등록/수정", category: "admin", pageKind: "form", route: "/admin/products/edit", model: "products", requires: ["admin", "product-catalog"] }),
  page({ id: "admin-content", name: "콘텐츠 관리", category: "admin", pageKind: "list", route: "/admin/content", model: "posts", requires: ["admin"] }),
  page({ id: "admin-inquiries", name: "문의 관리", category: "admin", pageKind: "list", route: "/admin/inquiries", requires: ["admin", "support"] }),
  page({ id: "admin-faq", name: "FAQ 관리", category: "admin", pageKind: "list", route: "/admin/faq", requires: ["admin", "support"] }),
  page({ id: "admin-stats", name: "통계", category: "admin", pageKind: "dashboard", route: "/admin/stats", requires: ["admin", "analytics"] }),
  page({ id: "admin-settings", name: "설정", category: "admin", pageKind: "settings", route: "/admin/settings", requires: ["admin"] }),
  page({ id: "admin-logs", name: "로그", category: "admin", pageKind: "list", route: "/admin/logs", requires: ["admin", "logs"] }),
];

export const pageCatalogById = Object.fromEntries(pageCatalog.map((definition) => [definition.id, definition])) as Record<string, PageDefinition>;

export function findPageDefinition(id: string) {
  return pageCatalogById[id] ?? null;
}

export function routePatternToSlug(routePattern: string) {
  const clean = routePattern
    .replace(/^\/+/, "")
    .replace(/:\w+/g, "detail")
    .replace(/[^a-zA-Z0-9가-힣/.-]+/g, "-")
    .replace(/\//g, "-")
    .replace(/^-+|-+$/g, "");

  return clean || "home";
}

export function pageDefinitionToSitePageType(definition: PageDefinition): SitePageType {
  if (definition.routePattern === "/" || definition.id.endsWith("-home") || definition.id === "global-home") {
    return "home";
  }

  if (definition.category === "portfolio") {
    return definition.pageKind === "list" || definition.pageKind === "detail" ? "portfolio" : "custom";
  }

  if (definition.category === "content" || definition.id.includes("blog") || definition.dataModel === "posts") {
    return "blog";
  }

  if (definition.category === "commerce" || definition.dataModel === "products") {
    return "product";
  }

  if (definition.id.includes("contact") || definition.name.includes("문의")) {
    return "contact";
  }

  if (definition.id.includes("service")) {
    return "services";
  }

  if (definition.id.includes("about") || definition.name.includes("소개")) {
    return "about";
  }

  if (definition.id.includes("pricing") || definition.name.includes("가격")) {
    return "pricing";
  }

  return "custom";
}
