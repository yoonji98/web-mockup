import { createDefaultBlock } from "@/data/block-defaults";
import { createDefaultContainer, createDefaultElement } from "@/data/element-defaults";
import type {
  CollectionListBlock,
  ContainerSectionBlock,
  FeaturesBlock,
  GridSectionBlock,
  HeroBlock,
  TestimonialsBlock,
  ColumnsSectionBlock,
} from "@/types/page";
import type { ContainerNode, ElementNode, ElementTreeNode } from "@/types/elements";
import type { PatternDefinition, PatternInsertResult } from "@/types/pattern-library";

function pattern(definition: PatternDefinition): PatternDefinition {
  return definition;
}

function heading(text: string, level = 2): ElementNode {
  const element = createDefaultElement("heading");
  return {
    ...element,
    props: {
      ...element.props,
      level,
      text,
    },
  };
}

function text(content: string): ElementNode {
  const element = createDefaultElement("text");
  return {
    ...element,
    props: {
      ...element.props,
      text: content,
    },
  };
}

function badge(content: string): ElementNode {
  const element = createDefaultElement("badge");
  return {
    ...element,
    props: {
      ...element.props,
      text: content,
    },
  };
}

function button(label: string, href = "#", variant: "primary" | "ghost" | "secondary" = "primary"): ElementNode {
  const element = createDefaultElement("button");
  return {
    ...element,
    props: {
      ...element.props,
      href,
      label,
      variant,
    },
  };
}

function link(label: string, href = "#"): ElementNode {
  const element = createDefaultElement("link");
  return {
    ...element,
    props: {
      ...element.props,
      href,
      label,
    },
  };
}

function card(title: string, description: string): ElementNode {
  const element = createDefaultElement("card");
  return {
    ...element,
    props: {
      ...element.props,
      description,
      title,
    },
  };
}

function logo(label: string): ElementNode {
  const element = createDefaultElement("logo");
  return {
    ...element,
    props: {
      ...element.props,
      label,
      text: label.slice(0, 2).toUpperCase(),
    },
  };
}

function input(placeholder: string): ElementNode {
  const element = createDefaultElement("input");
  return {
    ...element,
    props: {
      ...element.props,
      placeholder,
    },
  };
}

function stack(children: ElementTreeNode[], maxWidth = "1120px"): ContainerNode {
  const container = createDefaultContainer("stack");
  return {
    ...container,
    layout: {
      ...container.layout,
      gap: "16px",
    },
    style: {
      ...container.style,
      margin: "0 auto",
      maxWidth,
    },
    children,
  };
}

function row(children: ElementTreeNode[], maxWidth = "1120px"): ContainerNode {
  const container = createDefaultContainer("row");
  return {
    ...container,
    layout: {
      ...container.layout,
      align: "center",
      direction: "horizontal",
      gap: "12px",
      justify: "space-between",
      wrap: true,
    },
    style: {
      ...container.style,
      margin: "0 auto",
      maxWidth,
    },
    children,
  };
}

function grid(children: ElementTreeNode[], columns = 3, maxWidth = "1120px"): ContainerNode {
  const container = createDefaultContainer("grid");
  return {
    ...container,
    layout: {
      ...container.layout,
      columns,
      gap: "16px",
    },
    style: {
      ...container.style,
      margin: "0 auto",
      maxWidth,
    },
    children,
  };
}

function columns(children: ElementTreeNode[], count = 2, maxWidth = "1120px"): ContainerNode {
  const container = createDefaultContainer("columns");
  return {
    ...container,
    layout: {
      ...container.layout,
      columns: count,
      gap: "24px",
    },
    style: {
      ...container.style,
      margin: "0 auto",
      maxWidth,
    },
    children,
  };
}

function containerSection(
  title: string,
  subtitle: string,
  containerNode: ContainerNode,
  variant: string = "stack",
): ContainerSectionBlock {
  const block = createDefaultBlock("containerSection") as ContainerSectionBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      subtitle,
      title,
    },
    containers: [containerNode],
  };
}

function gridSection(
  title: string,
  subtitle: string,
  containerNode: ContainerNode,
  variant: string = "three-column",
): GridSectionBlock {
  const block = createDefaultBlock("gridSection") as GridSectionBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      subtitle,
      title,
    },
    containers: [containerNode],
  };
}

function columnsSection(
  title: string,
  subtitle: string,
  containerNode: ContainerNode,
  variant: string = "two-column",
): ColumnsSectionBlock {
  const block = createDefaultBlock("columnsSection") as ColumnsSectionBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      subtitle,
      title,
    },
    containers: [containerNode],
  };
}

function heroPattern(
  title: string,
  subtitle: string,
  buttonText: string,
  secondaryButtonText: string,
  imagePrompt: string,
  variant: string,
): HeroBlock {
  const block = createDefaultBlock("hero") as HeroBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      buttonText,
      imagePrompt,
      secondaryButtonText,
      subtitle,
      title,
    },
  };
}

function featuresPattern(
  title: string,
  subtitle: string,
  items: Array<{ title: string; description: string }>,
  variant: string,
): FeaturesBlock {
  const block = createDefaultBlock("features") as FeaturesBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      items,
      subtitle,
      title,
    },
  };
}

function collectionPattern(
  title: string,
  subtitle: string,
  collectionId: string,
  variant: string,
  itemLimit: number,
): CollectionListBlock {
  const block = createDefaultBlock("collectionList") as CollectionListBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      collectionId,
      itemLimit,
      subtitle,
      title,
    },
  };
}

function testimonialsPattern(
  title: string,
  subtitle: string,
  items: Array<{ quote: string; name: string; role: string }>,
  variant: string,
): TestimonialsBlock {
  const block = createDefaultBlock("testimonials") as TestimonialsBlock;
  return {
    ...block,
    variant,
    props: {
      ...block.props,
      items,
      subtitle,
      title,
    },
  };
}

function result(...blocks: PatternInsertResult["blocks"]): PatternInsertResult {
  return { blocks };
}

export const patternLibrary: PatternDefinition[] = [
  pattern({
    id: "portal-utility-bar",
    name: "Utility Bar",
    description: "기관형 상단 보조 링크 스트립",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "section",
    previewTags: ["Portal", "Top Links"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "빠른 접근 링크",
          "민원, 정보공개, 전자민원 링크를 한 줄로 제공합니다.",
          row(
            [
              badge("정부24 연계"),
              link("민원안내", "/civil/apply"),
              link("정보공개", "/info-request"),
              link("전자민원", "/civil/status"),
              link("사이트맵", "/about"),
              button("통합 검색", "/search", "secondary"),
            ],
            "1200px",
          ),
          "row",
        ),
      ),
  }),
  pattern({
    id: "portal-quick-links-board",
    name: "Quick Links Board",
    description: "주요 서비스 바로가기 보드",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "section",
    previewTags: ["Portal", "Board"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "자주 찾는 서비스",
          "대표 서비스에 바로 접근하는 빠른 링크 보드입니다.",
          grid(
            [
              card("민원 신청", "온라인 민원을 바로 접수합니다."),
              card("민원 조회", "처리 상태를 빠르게 확인합니다."),
              card("정책 안내", "기관 정책과 사업을 확인합니다."),
              card("자료실", "보고서와 서식을 내려받습니다."),
              card("보도자료", "최신 언론 공개 자료를 봅니다."),
              card("조직 안내", "부서와 담당 업무를 확인합니다."),
            ],
            3,
          ),
        ),
      ),
  }),
  pattern({
    id: "portal-notice-board",
    name: "Notice Board",
    description: "공지/알림 테이블",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "section",
    previewTags: ["Notices", "Dense"],
    createBlocksOrContainers: () =>
      result(collectionPattern("공지사항", "최신 행정 알림을 표 형태로 제공합니다.", "notices", "table", 6)),
  }),
  pattern({
    id: "portal-news-press-board",
    name: "News / Press Board",
    description: "보도자료와 뉴스 레일",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "section",
    previewTags: ["Press", "News"],
    createBlocksOrContainers: () =>
      result(collectionPattern("보도자료", "기관 소식과 뉴스 업데이트를 카드형으로 노출합니다.", "posts", "media-list", 4)),
  }),
  pattern({
    id: "portal-service-shortcut-grid",
    name: "Service Shortcut Grid",
    description: "서비스 단축 아이콘/카드 그리드",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "section",
    previewTags: ["Service Grid", "Shortcut"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "서비스 바로가기",
          "서비스 성격별로 분류된 단축 카드입니다.",
          grid(
            [
              card("복지/지원", "지원 제도와 신청 방법을 확인합니다."),
              card("교육/행사", "교육 일정과 행사 정보를 제공합니다."),
              card("건축/허가", "허가 절차와 서류를 안내합니다."),
              card("기업지원", "사업자 대상 지원 프로그램을 봅니다."),
            ],
            4,
          ),
          "bento",
        ),
      ),
  }),
  pattern({
    id: "portal-side-navigation-layout",
    name: "Side Navigation Layout",
    description: "좌측 사이드 네비게이션 + 본문 레이아웃",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "layout-preset",
    previewTags: ["Side Nav", "Institution"],
    createBlocksOrContainers: () =>
      result(
        columnsSection(
          "기관 안내 레이아웃",
          "사이드 내비게이션과 본문 설명을 나란히 배치합니다.",
          columns(
            [
              stack([
                heading("안내 메뉴", 3),
                link("기관 소개", "/about"),
                link("정책 안내", "/policy"),
                link("자료실", "/resources"),
                link("민원 신청", "/civil/apply"),
              ]),
              stack([
                heading("기관 소개", 2),
                text("이 영역은 상세 안내, 문서 설명, 배너를 안정적으로 배치하기 위한 본문 영역입니다."),
                button("상세 안내 보기", "/about"),
              ]),
            ],
            2,
          ),
        ),
      ),
  }),
  pattern({
    id: "portal-document-search-strip",
    name: "Document Search Strip",
    description: "문서/서식 검색 스트립",
    category: "portal-government",
    archetypes: ["portal"],
    layoutType: "section",
    previewTags: ["Search", "Documents"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "문서와 서식을 검색하세요",
          "행정 문서, 자료실, 보고서를 빠르게 찾는 검색 스트립입니다.",
          row([heading("자료 검색", 3), input("문서명, 키워드, 부서명"), button("검색", "/search")]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "commerce-benefit-strip",
    name: "Benefit Strip",
    description: "회원 혜택/배송/쿠폰 스트립",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Commerce", "Benefits"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "쇼핑 혜택",
          "신규 회원, 무료배송, 쿠폰 혜택을 빠르게 전달합니다.",
          row([badge("회원가입 10%"), badge("무료배송"), badge("당일출고"), badge("리뷰 적립")]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "commerce-category-strip",
    name: "Category Strip",
    description: "상단 카테고리 탐색 스트립",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Categories", "Navigation"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "주요 카테고리",
          "상위 카테고리를 한 줄로 보여주는 패턴입니다.",
          row([
            link("NEW", "/categories"),
            link("WOMEN", "/categories/women"),
            link("MEN", "/categories/men"),
            link("SHOES", "/categories/shoes"),
            link("BAG", "/categories/bag"),
            link("SALE", "/events"),
          ]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "commerce-mega-menu-section",
    name: "Mega Menu Section",
    description: "브랜드/상품군을 넓게 보여주는 섹션",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Mega Menu", "Categories"],
    createBlocksOrContainers: () =>
      result(
        columnsSection(
          "카테고리 가이드",
          "브랜드, 카테고리, 기획전을 넓게 보여주는 섹션입니다.",
          columns(
            [
              stack([heading("Women", 3), link("Outer"), link("Dress"), link("Top"), link("Bottom")]),
              stack([heading("Men", 3), link("Outer"), link("Top"), link("Bottom"), link("Set-up")]),
              stack([heading("Shoes / Bag", 3), link("Sneakers"), link("Loafers"), link("Bag"), link("Wallet")]),
              stack([heading("Event", 3), link("New Arrival"), link("Best"), link("Gift"), link("Sale")]),
            ],
            4,
          ),
          "four-column",
        ),
      ),
  }),
  pattern({
    id: "commerce-promo-hero-banner",
    name: "Promo Hero Banner",
    description: "프로모션 중심 상단 hero",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Hero", "Promo"],
    createBlocksOrContainers: () =>
      result(
        heroPattern(
          "신규 컬렉션과 기획전을 바로 보여주는 프로모션 히어로",
          "신상품, 시즌 컬렉션, 혜택 정보를 상단에서 강하게 전달합니다.",
          "기획전 보기",
          "신상품 보기",
          "패션 브랜드 프로모션 배너와 룩북",
          "editorial",
        ),
      ),
  }),
  pattern({
    id: "commerce-promo-mosaic",
    name: "Promo Mosaic",
    description: "이벤트/기프트/베스트 모자이크",
    category: "fashion-brand",
    archetypes: ["commerce-brand"],
    layoutType: "section",
    previewTags: ["Mosaic", "Campaign"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "프로모션 모자이크",
          "이벤트, 선물 제안, 베스트 상품을 모자이크 카드로 노출합니다.",
          grid(
            [
              card("Best Seller", "이번 주 가장 많이 본 상품"),
              card("Gift Guide", "선물하기 좋은 추천 조합"),
              card("Season Event", "시즌 할인과 한정 프로모션"),
              card("Brand Story", "컬렉션 배경과 스토리"),
            ],
            2,
          ),
          "bento",
        ),
      ),
  }),
  pattern({
    id: "commerce-product-rail",
    name: "Product Rail",
    description: "가로형 상품 레일",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Products", "Rail"],
    createBlocksOrContainers: () =>
      result(collectionPattern("신상품 레일", "상품 탐색을 빠르게 시작하는 상품 리스트", "products", "media-list", 5)),
  }),
  pattern({
    id: "commerce-best-item-grid",
    name: "Best Item Grid",
    description: "베스트셀러 그리드",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Best", "Grid"],
    createBlocksOrContainers: () =>
      result(collectionPattern("베스트 아이템", "판매량과 관심도가 높은 상품을 격자로 배치합니다.", "products", "card-grid", 6)),
  }),
  pattern({
    id: "commerce-review-wall",
    name: "Review Wall",
    description: "리뷰 월 / 후기 카드",
    category: "fashion-brand",
    archetypes: ["commerce-fashion", "commerce-brand"],
    layoutType: "section",
    previewTags: ["Reviews", "Wall"],
    createBlocksOrContainers: () =>
      result(
        testimonialsPattern(
          "고객 리뷰",
          "구매 후기를 월 형태로 배치해 신뢰를 높입니다.",
          [
            { quote: "핏과 소재가 기대 이상이었어요.", name: "김서연", role: "구매 고객" },
            { quote: "배송도 빠르고 재구매 의사가 있습니다.", name: "박민지", role: "구매 고객" },
            { quote: "선물용으로도 만족도가 높았습니다.", name: "이유진", role: "구매 고객" },
          ],
          "wall",
        ),
      ),
  }),
  pattern({
    id: "commerce-event-banner-stack",
    name: "Event Banner Stack",
    description: "이벤트 배너 스택",
    category: "fashion-brand",
    archetypes: ["commerce-brand"],
    layoutType: "section",
    previewTags: ["Events", "Banners"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "이벤트 배너",
          "진행 중인 캠페인과 행사 정보를 세로로 노출합니다.",
          stack([
            card("SPRING EVENT", "시즌 세일과 사은품 이벤트를 함께 안내합니다."),
            card("VIP BENEFIT", "등급별 혜택과 선구매 오픈 알림"),
            card("GIFT WEEK", "선물 포장 및 추천 상품 기획전"),
          ]),
        ),
      ),
  }),
  pattern({
    id: "company-concise-hero",
    name: "Concise Hero",
    description: "짧고 강한 기업형 hero",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["Hero", "Concise"],
    createBlocksOrContainers: () =>
      result(
        heroPattern(
          "한 문장으로 제안을 전달하는 기업형 히어로",
          "B2B 서비스, 에이전시, AI 솔루션에 적합한 간결한 상단 구조입니다.",
          "도입 문의",
          "사례 보기",
          "기업 웹사이트와 서비스 소개 화면",
          "minimal",
        ),
      ),
  }),
  pattern({
    id: "company-solution-tiles",
    name: "Solution Tiles",
    description: "솔루션 타일 / 기능 카드",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["Solutions", "Tiles"],
    createBlocksOrContainers: () =>
      result(
        featuresPattern(
          "핵심 솔루션",
          "제품과 서비스를 타일 구조로 빠르게 비교합니다.",
          [
            { title: "업무 자동화", description: "운영 흐름을 단축하는 핵심 기능" },
            { title: "대시보드 인사이트", description: "데이터 흐름과 리포트 집중" },
            { title: "고객 지원 자동화", description: "서비스 응답 속도를 높이는 구조" },
          ],
          "card-grid",
        ),
      ),
  }),
  pattern({
    id: "company-proof-strip",
    name: "Proof Strip",
    description: "수치/성과/신뢰 스트립",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["Proof", "Metrics"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "핵심 지표",
          "성과와 신뢰 요소를 짧은 스트립으로 배치합니다.",
          row([badge("95% 재계약"), badge("120+ 고객사"), badge("24시간 지원"), badge("평균 38% 효율 향상")]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "company-customer-logo-wall",
    name: "Customer Logo Wall",
    description: "고객사 로고 월",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["Logo Wall", "Trust"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "함께하는 고객사",
          "고객사 로고와 이름을 균형 있게 보여주는 로고 월입니다.",
          grid([logo("Nova"), logo("Orbit"), logo("Atlas"), logo("Pulse"), logo("Vertex"), logo("Motion")], 3),
        ),
      ),
  }),
  pattern({
    id: "company-case-study-cards",
    name: "Case Study Cards",
    description: "사례 연구 카드",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["Case Study", "Cards"],
    createBlocksOrContainers: () =>
      result(collectionPattern("고객 사례", "도입 효과와 프로젝트 결과를 카드로 배치합니다.", "projects", "card-grid", 4)),
  }),
  pattern({
    id: "company-news-rail",
    name: "News Rail",
    description: "회사 뉴스 레일",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["News", "Rail"],
    createBlocksOrContainers: () =>
      result(collectionPattern("뉴스와 인사이트", "업데이트, 공지, 인사이트를 리스트형으로 배치합니다.", "posts", "media-list", 4)),
  }),
  pattern({
    id: "company-cta-band",
    name: "CTA Band",
    description: "전환 중심 CTA 밴드",
    category: "ai-company",
    archetypes: ["saas-ai", "company"],
    layoutType: "section",
    previewTags: ["CTA", "Band"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "도입 상담을 바로 시작하세요",
          "밴드형 CTA는 페이지 중간이나 하단에 자연스럽게 배치하기 좋습니다.",
          row([heading("맞춤 제안 받기", 3), button("상담 요청", "/contact"), link("자료 다운로드", "/resources")]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "editorial-hero",
    name: "Editorial Hero",
    description: "매거진형 상단 히어로",
    category: "editorial-blog",
    archetypes: ["portfolio", "blog-media"],
    layoutType: "section",
    previewTags: ["Editorial", "Hero"],
    createBlocksOrContainers: () =>
      result(
        heroPattern(
          "에디토리얼 톤으로 첫 화면을 열어주는 히어로",
          "리드 스토리, 프로젝트 인트로, 매거진형 인상을 주는 상단 패턴입니다.",
          "대표 글 보기",
          "아카이브 보기",
          "에디토리얼 웹사이트와 리드 스토리 이미지",
          "editorial",
        ),
      ),
  }),
  pattern({
    id: "editorial-featured-story-split",
    name: "Featured Story Split",
    description: "대표 스토리 좌우 분할",
    category: "editorial-blog",
    archetypes: ["portfolio", "blog-media"],
    layoutType: "section",
    previewTags: ["Featured", "Split"],
    createBlocksOrContainers: () =>
      result(
        columnsSection(
          "대표 스토리",
          "대표 콘텐츠를 소개하는 좌우 분할 패턴입니다.",
          columns(
            [
              stack([
                badge("Featured"),
                heading("이번 주 대표 스토리", 2),
                text("핵심 메시지와 요약 문단을 배치해 독자가 바로 읽기 시작하도록 돕습니다."),
                button("스토리 읽기", "/posts"),
              ]),
              stack([card("Lead Visual", "이미지, 썸네일, 표지컷을 넣는 영역입니다.")]),
            ],
            2,
          ),
        ),
      ),
  }),
  pattern({
    id: "editorial-article-rail",
    name: "Article Rail",
    description: "기사/글 레일",
    category: "editorial-blog",
    archetypes: ["portfolio", "blog-media"],
    layoutType: "section",
    previewTags: ["Articles", "Rail"],
    createBlocksOrContainers: () =>
      result(collectionPattern("최신 글", "발행 순서대로 글을 배치하는 기사 레일입니다.", "posts", "media-list", 5)),
  }),
  pattern({
    id: "editorial-tag-strip",
    name: "Tag Strip",
    description: "태그/주제 스트립",
    category: "editorial-blog",
    archetypes: ["portfolio", "blog-media"],
    layoutType: "section",
    previewTags: ["Tags", "Topics"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "주제 탐색",
          "태그와 주제를 가볍게 훑어보는 스트립입니다.",
          row([badge("AI"), badge("Design"), badge("Business"), badge("Culture"), badge("Product"), badge("Opinion")]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "editorial-magazine-grid",
    name: "Magazine Grid",
    description: "매거진 카드 그리드",
    category: "editorial-blog",
    archetypes: ["portfolio", "blog-media"],
    layoutType: "section",
    previewTags: ["Magazine", "Grid"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "매거진 그리드",
          "카드형 기사와 에세이를 균형 있게 배치합니다.",
          grid(
            [
              card("에세이", "장문 읽기에 적합한 콘텐츠 카드"),
              card("인터뷰", "인물 중심 콘텐츠 카드"),
              card("가이드", "실용적인 정보형 콘텐츠 카드"),
              card("추천작", "큐레이션 콘텐츠 카드"),
            ],
            2,
          ),
          "bento",
        ),
      ),
  }),
  pattern({
    id: "dashboard-stat-cards-row",
    name: "Stat Cards Row",
    description: "핵심 지표 카드 행",
    category: "dashboard-admin",
    archetypes: ["dashboard"],
    layoutType: "section",
    previewTags: ["Dashboard", "Stats"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "핵심 지표",
          "운영 현황을 바로 읽을 수 있는 stat cards row입니다.",
          grid(
            [
              card("MAU", "18,240"),
              card("결제 전환", "4.8%"),
              card("오류 건수", "12"),
              card("처리 대기", "37"),
            ],
            4,
          ),
        ),
      ),
  }),
  pattern({
    id: "dashboard-filter-toolbar",
    name: "Filter Toolbar",
    description: "필터/검색 툴바",
    category: "dashboard-admin",
    archetypes: ["dashboard"],
    layoutType: "section",
    previewTags: ["Filters", "Toolbar"],
    createBlocksOrContainers: () =>
      result(
        containerSection(
          "필터 도구",
          "검색, 기간, 상태 필터를 한 줄에서 조절하는 툴바입니다.",
          row([input("검색어 입력"), badge("오늘"), badge("7일"), badge("30일"), button("필터 적용", "#", "secondary")]),
          "row",
        ),
      ),
  }),
  pattern({
    id: "dashboard-data-table-block",
    name: "Data Table Block",
    description: "테이블형 데이터 목록",
    category: "dashboard-admin",
    archetypes: ["dashboard"],
    layoutType: "section",
    previewTags: ["Table", "Admin"],
    createBlocksOrContainers: () =>
      result(collectionPattern("데이터 테이블", "운영 데이터와 리스트를 표 형식으로 보여줍니다.", "notices", "table", 8)),
  }),
  pattern({
    id: "dashboard-activity-board",
    name: "Activity Board",
    description: "최근 활동 보드",
    category: "dashboard-admin",
    archetypes: ["dashboard"],
    layoutType: "section",
    previewTags: ["Activity", "Board"],
    createBlocksOrContainers: () =>
      result(
        columnsSection(
          "최근 활동",
          "이벤트 로그와 담당 작업을 나눠서 보여주는 보드입니다.",
          columns(
            [
              stack([
                heading("최근 로그", 3),
                card("배포 완료", "오늘 13:40 production 배포"),
                card("권한 변경", "관리자 권한이 업데이트됨"),
                card("문의 처리", "고객 문의 7건 처리 완료"),
              ]),
              stack([
                heading("대기 작업", 3),
                card("정산 검토", "3건 검토 필요"),
                card("계정 승인", "신규 계정 12건 승인 대기"),
                card("콘텐츠 점검", "게시물 4건 검수 필요"),
              ]),
            ],
            2,
          ),
        ),
      ),
  }),
  pattern({
    id: "dashboard-chart-board",
    name: "Chart Board",
    description: "차트 보드형 카드",
    category: "dashboard-admin",
    archetypes: ["dashboard"],
    layoutType: "section",
    previewTags: ["Charts", "Analytics"],
    createBlocksOrContainers: () =>
      result(
        gridSection(
          "분석 보드",
          "차트 자리와 해석 텍스트를 위한 카드 보드입니다.",
          grid(
            [
              card("매출 추이", "라인 차트가 들어갈 영역"),
              card("유입 채널", "채널별 비중 차트 영역"),
              card("상태 분포", "상태별 분포를 요약하는 카드"),
            ],
            3,
          ),
        ),
      ),
  }),
];

export const patternLibraryById = Object.fromEntries(
  patternLibrary.map((patternDefinition) => [patternDefinition.id, patternDefinition]),
) as Record<string, PatternDefinition>;

export function findPatternDefinition(id: string) {
  return patternLibraryById[id] ?? null;
}

export function isPatternRecommendedForArchetype(patternDefinition: PatternDefinition, archetype?: string | null) {
  if (!archetype) {
    return false;
  }

  return patternDefinition.archetypes.includes(archetype);
}
