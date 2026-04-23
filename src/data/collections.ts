import type { CollectionDefinition } from "@/types/collections";

export const defaultCollections: CollectionDefinition[] = [
  {
    id: "products",
    name: "Products",
    itemName: "Product",
    fields: [
      { id: "title", name: "상품명", type: "text", required: true },
      { id: "description", name: "설명", type: "textarea" },
      { id: "price", name: "가격", type: "text" },
      { id: "category", name: "카테고리", type: "select", options: ["SaaS", "Template", "Service"] },
      { id: "image", name: "이미지", type: "image" },
      { id: "featured", name: "추천", type: "boolean" },
    ],
    sampleData: [
      {
        id: "product-1",
        slug: "starter-template",
        title: "Starter Template",
        description: "빠르게 런칭하는 랜딩페이지 템플릿",
        price: "₩49,000",
        category: "Template",
        image: "깔끔한 웹사이트 템플릿 미리보기",
        featured: true,
      },
      {
        id: "product-2",
        slug: "growth-kit",
        title: "Growth Kit",
        description: "전환 개선을 위한 섹션과 카피 묶음",
        price: "₩99,000",
        category: "Service",
        image: "마케팅 성장 도구 카드",
        featured: false,
      },
      {
        id: "product-3",
        slug: "pro-dashboard",
        title: "Pro Dashboard",
        description: "SaaS 관리자 화면을 위한 프론트엔드 스캐폴드",
        price: "₩149,000",
        category: "SaaS",
        image: "데이터 대시보드 화면",
        featured: true,
      },
    ],
  },
  {
    id: "posts",
    name: "Posts",
    itemName: "Post",
    fields: [
      { id: "title", name: "제목", type: "text", required: true },
      { id: "excerpt", name: "요약", type: "textarea" },
      { id: "author", name: "작성자", type: "text" },
      { id: "publishedAt", name: "발행일", type: "date" },
      { id: "tags", name: "태그", type: "tags" },
    ],
    sampleData: [
      {
        id: "post-1",
        slug: "website-structure",
        title: "전환형 웹사이트 구조 설계법",
        excerpt: "방문자가 바로 이해하는 페이지 흐름을 만드는 방법",
        author: "Landing Studio",
        publishedAt: "2026-04-01",
        tags: ["UX", "Conversion"],
      },
      {
        id: "post-2",
        slug: "mock-data-first",
        title: "Mock Data 먼저 설계해야 하는 이유",
        excerpt: "리스트와 상세 페이지를 안정적으로 만드는 데이터 모델 접근",
        author: "Product Team",
        publishedAt: "2026-04-12",
        tags: ["Data", "Prototype"],
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    itemName: "Project",
    fields: [
      { id: "title", name: "프로젝트명", type: "text", required: true },
      { id: "description", name: "설명", type: "textarea" },
      { id: "category", name: "분야", type: "select", options: ["Brand", "Product", "Commerce"] },
      { id: "year", name: "연도", type: "number" },
      { id: "url", name: "링크", type: "url" },
    ],
    sampleData: [
      {
        id: "project-1",
        slug: "saas-onboarding",
        title: "SaaS Onboarding Renewal",
        description: "첫 사용자의 핵심 행동 전환을 높인 온보딩 개편",
        category: "Product",
        year: 2026,
        url: "https://example.com",
      },
      {
        id: "project-2",
        slug: "local-brand",
        title: "Local Brand Website",
        description: "예약과 방문 전환을 연결한 로컬 브랜드 사이트",
        category: "Brand",
        year: 2025,
        url: "https://example.com",
      },
    ],
  },
  {
    id: "services",
    name: "Services",
    itemName: "Service",
    fields: [
      { id: "title", name: "서비스명", type: "text", required: true },
      { id: "description", name: "설명", type: "textarea" },
      { id: "price", name: "가격", type: "text" },
      { id: "duration", name: "기간", type: "text" },
    ],
    sampleData: [
      {
        id: "service-1",
        slug: "strategy",
        title: "웹사이트 전략 설계",
        description: "목표 고객과 전환 흐름을 바탕으로 페이지 구조를 설계합니다.",
        price: "₩300,000부터",
        duration: "3일",
      },
      {
        id: "service-2",
        slug: "frontend-scaffold",
        title: "프론트엔드 스캐폴드",
        description: "React 기반 페이지 구조와 샘플 데이터를 구성합니다.",
        price: "₩800,000부터",
        duration: "1주",
      },
    ],
  },
  {
    id: "notices",
    name: "Notices",
    itemName: "Notice",
    fields: [
      { id: "title", name: "제목", type: "text", required: true },
      { id: "summary", name: "요약", type: "textarea" },
      { id: "publishedAt", name: "게시일", type: "date" },
      { id: "important", name: "중요", type: "boolean" },
    ],
    sampleData: [
      {
        id: "notice-1",
        slug: "launch-update",
        title: "서비스 업데이트 안내",
        summary: "새로운 페이지 카탈로그와 Feature Kit이 추가되었습니다.",
        publishedAt: "2026-04-18",
        important: true,
      },
      {
        id: "notice-2",
        slug: "holiday-support",
        title: "고객지원 운영 시간 안내",
        summary: "공휴일 고객지원 운영 시간이 조정됩니다.",
        publishedAt: "2026-04-20",
        important: false,
      },
    ],
  },
  {
    id: "jobs",
    name: "Jobs",
    itemName: "Job",
    fields: [
      { id: "title", name: "포지션", type: "text", required: true },
      { id: "team", name: "팀", type: "text" },
      { id: "location", name: "근무지", type: "text" },
      { id: "employmentType", name: "고용 형태", type: "select", options: ["Full-time", "Contract"] },
      { id: "deadline", name: "마감일", type: "date" },
    ],
    sampleData: [
      {
        id: "job-1",
        slug: "product-designer",
        title: "Product Designer",
        team: "Design",
        location: "Seoul",
        employmentType: "Full-time",
        deadline: "2026-05-31",
      },
      {
        id: "job-2",
        slug: "frontend-engineer",
        title: "Frontend Engineer",
        team: "Engineering",
        location: "Remote",
        employmentType: "Full-time",
        deadline: "2026-06-15",
      },
    ],
  },
];

export const defaultCollectionsById = Object.fromEntries(
  defaultCollections.map((collection) => [collection.id, collection]),
) as Record<string, CollectionDefinition>;

export function findDefaultCollection(id: string) {
  return defaultCollectionsById[id] ?? null;
}
