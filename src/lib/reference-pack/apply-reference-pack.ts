import { createDefaultBlock } from "@/data/block-defaults";
import { findPageDefinition } from "@/data/page-catalog";
import { findReferencePack } from "@/data/reference-packs";
import { stylePacks } from "@/data/style-packs";
import {
  createDefaultSiteData,
  createSitePageFromDefinition,
  normalizeSiteData,
} from "@/lib/site-data";
import { applyStylePackToTheme } from "@/lib/style-pack";
import type { ElementNode, HeaderSlots } from "@/types/elements";
import type {
  AboutBlock,
  Block,
  CollectionListBlock,
  CollectionListBlockProps,
  CtaBlock,
  FeaturesBlockProps,
  FeaturesBlock,
  HeroBlock,
  NavItem,
  PortfolioBlock,
  ServicesBlock,
  SiteData,
  SitePage,
} from "@/types/page";
import type { SiteTheme, StylePack } from "@/types/style";
import type { ReferencePack, ReferencePackFooterVariant } from "@/types/reference-pack";

export type ApplyReferencePackOptions = {
  preserveStylePack?: boolean;
};

export function applyReferencePack(
  site: SiteData,
  packId: string,
  options: ApplyReferencePackOptions = {},
): SiteData {
  const pack = requireReferencePack(packId);
  const recommendedStylePack = resolveRecommendedStylePack(pack);
  const baseTheme =
    options.preserveStylePack || !recommendedStylePack
      ? site.theme
      : applyStylePackToTheme(site.theme, recommendedStylePack);
  const nextNavigation = {
    items: pack.navigationPreset.items.map((item) => ({ ...item })),
    cta: createReferencePackCta(pack),
  };
  const nextHeaderSlots = createReferencePackHeaderSlots(site, pack, nextNavigation.items);
  const pages = site.pages.map((page) =>
    page.type === "home" ? { ...page, blocks: buildReferencePackHomeBlocks(pack) } : page,
  );

  return normalizeSiteData({
    ...site,
    navigation: nextNavigation,
    pages,
    referencePack: structuredClone(pack),
    theme: applyReferencePackTheme(baseTheme, pack, recommendedStylePack, options),
    globalSections: {
      ...site.globalSections,
      header: {
        ...site.globalSections?.header,
        enabled: true,
        elements: flattenHeaderSlots(nextHeaderSlots),
        height: mapHeaderHeight(pack),
        slots: nextHeaderSlots,
        sticky: pack.headerPreset.sticky,
        transparent:
          pack.headerPreset.type === "minimal-corporate"
            ? site.globalSections?.header?.transparent ?? false
            : false,
        variant: "custom",
      },
      footer: {
        ...site.globalSections?.footer,
        enabled: true,
        variant: mapFooterVariant(pack.footerPreset.variant),
      },
    },
  });
}

export function createSiteFromReferencePack(
  packId: string,
  options: ApplyReferencePackOptions = {},
): SiteData {
  const pack = requireReferencePack(packId);
  const baseSite = createDefaultSiteData();
  const appliedSite = applyReferencePack(baseSite, packId, options);

  return normalizeSiteData({
    ...appliedSite,
    pages: appendRecommendedPages(appliedSite.pages, pack),
  });
}

function requireReferencePack(packId: string) {
  const pack = findReferencePack(packId);

  if (!pack) {
    throw new Error(`Unknown reference pack: ${packId}`);
  }

  return pack;
}

function resolveRecommendedStylePack(pack: ReferencePack): StylePack | null {
  const firstId = pack.recommendedStylePackIds[0];

  return stylePacks.find((stylePack) => stylePack.id === firstId) ?? null;
}

function applyReferencePackTheme(
  theme: SiteTheme,
  pack: ReferencePack,
  recommendedStylePack: StylePack | null,
  options: ApplyReferencePackOptions,
): SiteTheme {
  return {
    ...theme,
    effects: {
      backgroundStyle: theme.effects?.backgroundStyle ?? "flat",
      borderStyle: mapBorderDensity(pack.densityPreset.borderDensity),
      shadow: mapShadowDensity(pack.densityPreset.shadowDensity),
    },
    fontFamily: pack.typographyPreset.bodyFont,
    layout: {
      contentDensity: mapContentDensity(pack.homepagePreset.contentDensity),
      maxWidth: mapMaxWidth(pack),
      sectionPadding: mapSpacing(pack.densityPreset.spacing),
    },
    shadow: mapShadowDensity(pack.densityPreset.shadowDensity),
    spacing: mapSpacing(pack.densityPreset.spacing),
    stylePackId:
      options.preserveStylePack || !recommendedStylePack
        ? theme.stylePackId
        : recommendedStylePack.id,
    typography: {
      bodyFont: pack.typographyPreset.bodyFont,
      bodySize: mapBodySize(pack.typographyPreset.scale),
      headingFont: pack.typographyPreset.headingFont,
      headingWeight: mapHeadingWeight(pack.typographyPreset.tone, pack.typographyPreset.scale),
    },
  };
}

function appendRecommendedPages(existingPages: SitePage[], pack: ReferencePack) {
  const nextPages = [...existingPages];
  const seenIds = new Set(nextPages.map((page) => page.id));
  const hasHome = nextPages.some((page) => page.type === "home");

  pack.recommendedPageIds.forEach((pageId) => {
    const definition = findPageDefinition(pageId);

    if (!definition) {
      return;
    }

    if (definition.routePattern === "/" && hasHome) {
      return;
    }

    if (seenIds.has(definition.id)) {
      return;
    }

    const page = createSitePageFromDefinition(definition, nextPages);
    nextPages.push(page);
    seenIds.add(page.id);
  });

  return nextPages;
}

function buildReferencePackHomeBlocks(pack: ReferencePack): Block[] {
  switch (pack.category) {
    case "portal":
      return [
        createHeroBlock({
          title: "민원과 공공정보를 한 번에 찾는 시민 포털",
          subtitle: "자주 찾는 서비스, 공지, 정책 자료를 빠르게 탐색할 수 있는 포털형 첫 화면입니다.",
          buttonText: "민원 신청",
          secondaryButtonText: "정책 안내 보기",
          imagePrompt: "공공기관 포털 대시보드와 서비스 보드",
          variant: "centered",
        }),
        createFeaturesBlock({
          title: "빠르게 찾는 핵심 서비스",
          subtitle: "민원, 공지, 보도자료, 자료실을 보드형으로 바로 접근합니다.",
          items: [
            { title: "민원 안내", description: "전자민원과 처리 절차를 한눈에 확인합니다." },
            { title: "정책/법령", description: "정책 안내와 법령 정보를 밀도 있게 제공합니다." },
            { title: "자료실", description: "보고서, 서식, 공지자료를 빠르게 다운로드합니다." },
          ],
          variant: "numbered-list",
        }),
        createCollectionListBlock({
          collectionId: "notices",
          title: "주요 공지사항",
          subtitle: "최근 업데이트된 공공 안내와 알림",
          itemLimit: 5,
          variant: "table",
        }),
        createCtaBlock("자주 찾는 민원 서비스를 바로 시작하세요", "민원 신청"),
      ];
    case "commerce-fashion":
      return [
        createHeroBlock({
          title: "이번 시즌 룩을 빠르게 탐색하는 패션 몰",
          subtitle: "카테고리 중심 탐색, 신상품, 베스트, 장바구니 흐름을 우선하는 커머스 홈입니다.",
          buttonText: "신상품 보기",
          secondaryButtonText: "카테고리 둘러보기",
          imagePrompt: "패션 이커머스 메인 비주얼과 상품 그리드",
          variant: "split-image",
        }),
        createCollectionListBlock({
          collectionId: "products",
          title: "이번 주 추천 상품",
          subtitle: "신상품과 베스트셀러를 카드형으로 보여줍니다.",
          itemLimit: 6,
          variant: "card-grid",
        }),
        createFeaturesBlock({
          title: "쇼핑 흐름을 더 빠르게",
          subtitle: "카테고리, 주문조회, 마이페이지, 장바구니 동선을 강화합니다.",
          items: [
            { title: "카테고리 탐색", description: "WOMEN, MEN, SHOES 같은 밀도 높은 내비게이션" },
            { title: "주문/배송 조회", description: "주문 상태와 배송 흐름을 빠르게 접근" },
            { title: "찜/리뷰 확장", description: "마이페이지 기반 커머스 기능 확장에 적합" },
          ],
          variant: "card-grid",
        }),
        createCtaBlock("회원 전용 혜택과 신규 컬렉션을 확인하세요", "회원가입"),
      ];
    case "commerce-brand":
      return [
        createHeroBlock({
          title: "브랜드 스토리와 프로모션이 함께 보이는 브랜드 몰",
          subtitle: "이벤트, 기프트, 베스트셀러를 강하게 노출하는 프로모션 중심 홈입니다.",
          buttonText: "기획전 보기",
          secondaryButtonText: "브랜드 스토리",
          imagePrompt: "브랜드 몰 프로모션 배너와 상품 모자이크",
          variant: "editorial",
        }),
        createCollectionListBlock({
          collectionId: "products",
          title: "베스트 셀렉션",
          subtitle: "브랜드 핵심 상품과 기프트 제안을 한 번에 보여줍니다.",
          itemLimit: 4,
          variant: "media-list",
        }),
        createAboutBlock(
          "브랜드의 메시지와 시즌 캠페인을 전면에 배치하세요",
          "프로모션 배너와 브랜드 스토리를 함께 배치하는 구조입니다.",
        ),
        createCtaBlock("이벤트와 기프트 구성을 지금 확인하세요", "이벤트 보기"),
      ];
    case "saas-ai":
      return [
        createHeroBlock({
          title: "AI 솔루션을 간결하게 설명하는 기업형 홈",
          subtitle: "짧은 hero, 솔루션 타일, 뉴스 레일, 기업형 CTA를 우선하는 구조입니다.",
          buttonText: "도입 문의",
          secondaryButtonText: "기능 소개",
          imagePrompt: "AI 기업 웹사이트 히어로와 솔루션 타일",
          variant: "minimal",
        }),
        createFeaturesBlock({
          title: "핵심 솔루션",
          subtitle: "도입 이유와 운영 효율을 빠르게 이해할 수 있게 구성합니다.",
          items: [
            { title: "업무 자동화", description: "운영 반복 작업을 AI로 줄입니다." },
            { title: "분석 인사이트", description: "대시보드와 리포트 흐름을 빠르게 만듭니다." },
            { title: "엔터프라이즈 보안", description: "기업 도입에 필요한 신뢰 요소를 강조합니다." },
          ],
          variant: "card-grid",
        }),
        createCollectionListBlock({
          collectionId: "posts",
          title: "Latest News",
          subtitle: "제품 업데이트와 도입 사례를 뉴스 레일로 보여줍니다.",
          itemLimit: 3,
          variant: "media-list",
        }),
        createCtaBlock("기업 환경에 맞는 AI 도입 상담을 시작하세요", "도입 문의"),
      ];
    case "company":
      return [
        createHeroBlock({
          title: "회사 소개와 서비스, 사례를 균형 있게 보여주는 홈",
          subtitle: "에이전시와 기업 사이트에 맞는 범용 전환 구조를 사용합니다.",
          buttonText: "상담 요청",
          secondaryButtonText: "사례 보기",
          imagePrompt: "회사 소개 웹사이트와 서비스 카드",
          variant: "split-image",
        }),
        createServicesBlock(),
        createPortfolioBlock("대표 프로젝트", "서비스와 사례를 연결해 신뢰를 높입니다."),
        createCtaBlock("프로젝트와 서비스 상담을 바로 시작하세요", "문의하기"),
      ];
    case "portfolio":
      return [
        createHeroBlock({
          title: "작품과 글을 큰 여백으로 보여주는 에디토리얼 포트폴리오",
          subtitle: "프로젝트, 저널, 소개를 서사적으로 연결하는 포트폴리오 홈입니다.",
          buttonText: "프로젝트 보기",
          secondaryButtonText: "소개 보기",
          imagePrompt: "에디토리얼 포트폴리오 사이트와 이미지 갤러리",
          variant: "editorial",
        }),
        createPortfolioBlock("Selected Work", "대표 작업을 에디토리얼 톤으로 큐레이션합니다."),
        createCollectionListBlock({
          collectionId: "posts",
          title: "Journal",
          subtitle: "프로세스와 인사이트를 함께 기록하는 글 섹션",
          itemLimit: 3,
          variant: "media-list",
        }),
        createCtaBlock("새 프로젝트 협업 문의를 남겨주세요", "프로젝트 문의"),
      ];
    case "blog-media":
      return [
        createHeroBlock({
          title: "리드 스토리와 카테고리 탐색이 먼저 보이는 미디어 홈",
          subtitle: "최신글, 주제별 분류, 검색과 구독 흐름을 기본으로 두는 콘텐츠 구조입니다.",
          buttonText: "최신글 보기",
          secondaryButtonText: "카테고리 탐색",
          imagePrompt: "디지털 미디어 홈 화면과 기사 레이아웃",
          variant: "editorial",
        }),
        createCollectionListBlock({
          collectionId: "posts",
          title: "주요 기사",
          subtitle: "최신 스토리를 에디토리얼 리스트로 제공합니다.",
          itemLimit: 4,
          variant: "media-list",
        }),
        createFeaturesBlock({
          title: "콘텐츠 탐색 구조",
          subtitle: "카테고리, 태그, 검색, 북마크 흐름을 중심으로 확장합니다.",
          items: [
            { title: "카테고리 탐색", description: "주제별로 빠르게 이동하는 상단 구조" },
            { title: "검색/태그", description: "콘텐츠 아카이브를 탐색하기 쉬운 검색 흐름" },
            { title: "구독 CTA", description: "뉴스레터나 멤버십 전환에 유리한 구조" },
          ],
          variant: "alternating",
        }),
        createCtaBlock("최신 발행 글과 주제별 아카이브를 둘러보세요", "콘텐츠 보기"),
      ];
    case "dashboard":
      return [
        createHeroBlock({
          title: "운영 현황과 관리 도구를 한 화면에서 보는 관리자 홈",
          subtitle: "지표, 테이블, 설정 흐름을 우선하는 대시보드형 구조입니다.",
          buttonText: "대시보드 이동",
          secondaryButtonText: "설정 보기",
          imagePrompt: "관리자 대시보드와 데이터 테이블",
          variant: "minimal",
        }),
        createFeaturesBlock({
          title: "관리 핵심 영역",
          subtitle: "사용자, 콘텐츠, 통계, 로그를 빠르게 전환할 수 있게 설계합니다.",
          items: [
            { title: "사용자 관리", description: "권한과 상태를 빠르게 점검합니다." },
            { title: "운영 통계", description: "핵심 지표를 밀도 높게 확인합니다." },
            { title: "로그/감사", description: "문제 추적과 운영 이력을 관리합니다." },
          ],
          variant: "bento",
        }),
        createCollectionListBlock({
          collectionId: "notices",
          title: "운영 알림",
          subtitle: "최근 시스템 공지와 작업 내역을 테이블로 확인합니다.",
          itemLimit: 5,
          variant: "table",
        }),
        createCtaBlock("관리 콘솔과 운영 설정으로 바로 이동하세요", "관리 콘솔"),
      ];
  }
}

function createReferencePackHeaderSlots(
  site: SiteData,
  pack: ReferencePack,
  navigationItems: NavItem[],
): HeaderSlots {
  const brandName = site.brand.name || site.name;
  const logoText = site.brand.logoText || brandName.slice(0, 2).toUpperCase();
  const quickLinks = (pack.headerPreset.quickLinks ?? []).map((label, index) =>
    createLinkElement(`header-quick-${index + 1}`, label, hrefFromQuickLink(label)),
  );
  const searchElement = createSearchElement(pack);
  const mobileSearchElement = createSearchElement(pack, "mobile");
  const languageElement = pack.headerPreset.languageSelector
    ? createLinkElement("header-language", "KR / EN", "#language")
    : null;
  const cartElement = pack.headerPreset.cartAction
    ? createButtonElement("header-cart", "장바구니", "/cart")
    : null;
  const mobileCartElement = pack.headerPreset.cartAction
    ? createButtonElement("header-cart-mobile", "장바구니", "/cart")
    : null;
  const accountElements = pack.headerPreset.accountActions
    ? [
        createLoginElement("header-login", "/login"),
        createSignupElement("header-account-primary", mapAccountCtaLabel(pack), mapAccountCtaHref(pack)),
      ]
    : [];

  const left: ElementNode[] = [
    {
      id: "header-logo",
      type: "logo",
      props: {
        href: "/",
        label: brandName,
        text: logoText,
      },
    },
  ];
  const center: ElementNode[] = [];
  const right: ElementNode[] = [];
  const mobile: ElementNode[] = [
    {
      id: "header-mobile-menu",
      type: "menu",
      props: {
        items: navigationItems,
      },
    },
  ];

  if (pack.headerPreset.utilityBar) {
    left.push(...quickLinks.slice(0, 2));
    right.push(...quickLinks.slice(2));
  }

  if (pack.headerPreset.type === "editorial-simple") {
    center.push(
      ...navigationItems
        .slice(0, 3)
        .map((item, index) => createLinkElement(`header-nav-link-${index + 1}`, item.label, item.href)),
    );
  } else {
    center.push({
      id: "header-menu",
      type: "menu",
      props: {
        items: navigationItems,
      },
    });
  }

  if (searchElement) {
    right.push(searchElement);
  }

  if (mobileSearchElement) {
    mobile.push(mobileSearchElement);
  }

  if (languageElement) {
    right.push(languageElement);
  }

  right.push(...accountElements);

  if (cartElement) {
    right.push(cartElement);
  }

  if (mobileCartElement) {
    mobile.push(mobileCartElement);
  }

  if (!pack.headerPreset.accountActions) {
    right.push(createSignupElement("header-primary-cta", createPrimaryCtaLabel(pack), createPrimaryCtaHref(pack)));
  }

  mobile.push(
    ...navigationItems
      .slice(0, 4)
      .map((item, index) => createLinkElement(`header-mobile-link-${index + 1}`, item.label, item.href)),
  );

  return { left, center, right, mobile };
}

function flattenHeaderSlots(slots: HeaderSlots): ElementNode[] {
  return [...(slots.left ?? []), ...(slots.center ?? []), ...(slots.right ?? []), ...(slots.mobile ?? [])];
}

function createHeroBlock(input: {
  buttonText: string;
  imagePrompt: string;
  secondaryButtonText?: string;
  subtitle: string;
  title: string;
  variant: string;
}) {
  const block = createDefaultBlock("hero") as HeroBlock;

  return {
    ...block,
    variant: input.variant,
    props: {
      ...block.props,
      buttonText: input.buttonText,
      imagePrompt: input.imagePrompt,
      secondaryButtonText: input.secondaryButtonText,
      subtitle: input.subtitle,
      title: input.title,
    },
  };
}

function createFeaturesBlock(input: {
  items: FeaturesBlockProps["items"];
  subtitle: string;
  title: string;
  variant: string;
}) {
  const block = createDefaultBlock("features") as FeaturesBlock;

  return {
    ...block,
    variant: input.variant,
    props: {
      ...block.props,
      items: input.items,
      subtitle: input.subtitle,
      title: input.title,
    },
  };
}

function createCollectionListBlock(input: {
  collectionId: string;
  itemLimit?: number;
  subtitle: string;
  title: string;
  variant: string;
}) {
  const block = createDefaultBlock("collectionList") as CollectionListBlock;

  return {
    ...block,
    variant: input.variant,
    props: {
      ...block.props,
      collectionId: input.collectionId,
      itemLimit: input.itemLimit,
      subtitle: input.subtitle,
      title: input.title,
    } satisfies CollectionListBlockProps,
  };
}

function createAboutBlock(title: string, subtitle: string) {
  const block = createDefaultBlock("about") as AboutBlock;

  return {
    ...block,
    variant: "story",
    props: {
      ...block.props,
      subtitle,
      title,
    },
  };
}

function createPortfolioBlock(title: string, subtitle: string) {
  const block = createDefaultBlock("portfolio") as PortfolioBlock;

  return {
    ...block,
    variant: "project-grid",
    props: {
      ...block.props,
      subtitle,
      title,
    },
  };
}

function createServicesBlock() {
  const block = createDefaultBlock("services") as ServicesBlock;

  return {
    ...block,
    variant: "service-cards",
    props: {
      ...block.props,
      subtitle: "서비스 구조를 명확하게 보여주는 카드형 섹션입니다.",
      title: "핵심 서비스",
    },
  };
}

function createCtaBlock(title: string, buttonText: string) {
  const block = createDefaultBlock("cta") as CtaBlock;

  return {
    ...block,
    props: {
      ...block.props,
      buttonText,
      subtitle: "Reference Pack 구조에 맞춘 기본 CTA 섹션입니다.",
      title,
    },
  };
}

function createLinkElement(id: string, label: string, href: string): ElementNode {
  return {
    id,
    type: "link",
    props: {
      href,
      label,
    },
  };
}

function createButtonElement(id: string, label: string, href: string): ElementNode {
  return {
    id,
    type: "button",
    props: {
      href,
      label,
    },
  };
}

function createLoginElement(id: string, href: string): ElementNode {
  return {
    id,
    type: "loginButton",
    props: {
      href,
      label: "로그인",
    },
  };
}

function createSignupElement(id: string, label: string, href: string): ElementNode {
  return {
    id,
    type: "signupButton",
    props: {
      href,
      label,
    },
  };
}

function createSearchElement(pack: ReferencePack, suffix = "desktop"): ElementNode | null {
  switch (pack.headerPreset.searchMode) {
    case "none":
      return null;
    case "icon":
      return createLinkElement(`header-search-${suffix}`, "검색", "/search");
    case "inline":
      return createButtonElement(`header-search-${suffix}`, "검색", "/search");
    case "prominent":
      return createSignupElement(`header-search-${suffix}`, "통합 검색", "/search");
  }
}

function createReferencePackCta(pack: ReferencePack) {
  return {
    href: createPrimaryCtaHref(pack),
    label: createPrimaryCtaLabel(pack),
  };
}

function createPrimaryCtaHref(pack: ReferencePack) {
  switch (pack.category) {
    case "portal":
      return "/civil/apply";
    case "commerce-fashion":
    case "commerce-brand":
      return "/categories";
    case "saas-ai":
    case "company":
      return "/contact";
    case "portfolio":
      return "/contact";
    case "blog-media":
      return "/posts";
    case "dashboard":
      return "/admin";
  }
}

function createPrimaryCtaLabel(pack: ReferencePack) {
  switch (pack.category) {
    case "portal":
      return "민원 신청";
    case "commerce-fashion":
      return "신상품 보기";
    case "commerce-brand":
      return "기획전 보기";
    case "saas-ai":
      return "도입 문의";
    case "company":
      return "상담 요청";
    case "portfolio":
      return "프로젝트 문의";
    case "blog-media":
      return "최신글 보기";
    case "dashboard":
      return "관리 콘솔";
  }
}

function mapAccountCtaHref(pack: ReferencePack) {
  return pack.category === "dashboard" ? "/admin/settings" : "/my";
}

function mapAccountCtaLabel(pack: ReferencePack) {
  return pack.category === "dashboard" ? "설정" : "마이페이지";
}

function hrefFromQuickLink(label: string) {
  if (label.includes("민원")) return "/civil/apply";
  if (label.includes("정보공개")) return "/info-request";
  if (label.includes("사이트맵")) return "/about";
  if (label.includes("로그인")) return "/login";
  if (label.includes("회원가입")) return "/signup";
  if (label.includes("주문")) return "/my/orders";
  if (label.includes("마이페이지")) return "/my";
  if (label.includes("이벤트")) return "/events";
  if (label.includes("기프트")) return "/events";
  if (label.includes("베스트")) return "/events";
  if (label.includes("스토리")) return "/about";
  if (label.includes("Docs")) return "/features";
  if (label.includes("Pricing")) return "/pricing";
  if (label.includes("News")) return "/news";
  if (label.includes("Case")) return "/case-studies";
  if (label.includes("Careers")) return "/careers";
  if (label.includes("Selected")) return "/projects";
  if (label.includes("Journal")) return "/blog";
  if (label.includes("최신글")) return "/posts";
  if (label.includes("카테고리")) return "/category/news";
  if (label.includes("구독")) return "/posts";
  if (label.includes("통계")) return "/admin/stats";
  if (label.includes("로그")) return "/admin/logs";
  if (label.includes("설정")) return "/admin/settings";

  return "/";
}

function mapHeaderHeight(pack: ReferencePack) {
  switch (pack.densityPreset.spacing) {
    case "compact":
      return "sm" as const;
    case "balanced":
      return "md" as const;
    case "spacious":
      return "lg" as const;
  }
}

function mapFooterVariant(variant: ReferencePackFooterVariant) {
  return variant;
}

function mapSpacing(spacing: ReferencePack["densityPreset"]["spacing"]) {
  switch (spacing) {
    case "compact":
      return "compact" as const;
    case "balanced":
      return "comfortable" as const;
    case "spacious":
      return "spacious" as const;
  }
}

function mapContentDensity(density: ReferencePack["homepagePreset"]["contentDensity"]) {
  switch (density) {
    case "airy":
      return "airy" as const;
    case "balanced":
      return "normal" as const;
    case "dense":
      return "compact" as const;
  }
}

function mapHeadingWeight(
  tone: ReferencePack["typographyPreset"]["tone"],
  scale: ReferencePack["typographyPreset"]["scale"],
) {
  if (scale === "display") {
    return tone === "luxury" ? ("medium" as const) : ("extrabold" as const);
  }

  if (tone === "editorial" || tone === "luxury") {
    return "medium" as const;
  }

  if (tone === "portal") {
    return "semibold" as const;
  }

  return "bold" as const;
}

function mapBodySize(scale: ReferencePack["typographyPreset"]["scale"]) {
  switch (scale) {
    case "compact":
      return "sm" as const;
    case "balanced":
      return "base" as const;
    case "display":
      return "lg" as const;
  }
}

function mapBorderDensity(borderDensity: ReferencePack["densityPreset"]["borderDensity"]) {
  switch (borderDensity) {
    case "none":
      return "none" as const;
    case "subtle":
      return "subtle" as const;
    case "medium":
      return "strong" as const;
  }
}

function mapShadowDensity(shadowDensity: ReferencePack["densityPreset"]["shadowDensity"]) {
  switch (shadowDensity) {
    case "none":
      return "none" as const;
    case "soft":
      return "soft" as const;
    case "medium":
      return "medium" as const;
  }
}

function mapMaxWidth(pack: ReferencePack) {
  if (pack.category === "portfolio") {
    return "narrow" as const;
  }

  if (pack.category === "portal" || pack.category === "dashboard" || pack.category === "saas-ai") {
    return "wide" as const;
  }

  return "default" as const;
}
