현재 프로젝트는 단일 PageData 기반이다.
랜딩페이지뿐 아니라 일반 웹사이트도 만들 수 있게 SiteData 구조로 확장해줘.

새 구조:
SiteData {
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
    cta?: {
      label: string;
      href: string;
    };
  };
  pages: SitePage[];
  globalSections?: {
    header?: HeaderConfig;
    footer?: FooterConfig;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

SitePage:
{
  id: string;
  title: string;
  slug: string;
  type:
    | 'home'
    | 'landing'
    | 'about'
    | 'services'
    | 'portfolio'
    | 'pricing'
    | 'contact'
    | 'blog'
    | 'product'
    | 'custom';
  seo?: {
    title: string;
    description: string;
  };
  blocks: Block[];
}

작업:
1. src/types/page.ts를 SiteData 중심으로 확장
2. 기존 PageData 호환성을 유지하거나 migration 함수 작성
3. src/schemas/site-schema.ts 생성
4. Zod schema 작성
5. editor-store를 page 중심에서 site/currentPageId 중심으로 변경

새 store 상태:
- site: SiteData
- currentPageId: string
- selectedBlockId: string | null
- previewMode
- isDirty

새 액션:
- setSite
- updateSiteMeta
- addPage
- removePage
- duplicatePage
- updatePage
- setCurrentPage
- addBlockToCurrentPage
- updateBlock
- removeBlock
- moveBlock
- setNavigation
- applyStylePack

요구사항:
- 기존 에디터가 깨지지 않게 currentPage 기준으로 Canvas 렌더링
- 기존 PageData는 SiteData로 migration 가능해야 함
- Home page가 없으면 자동 생성
- currentPageId가 유효하지 않으면 첫 번째 page로 fallback
- 기존 localStorage draft도 migration 고려

작업 후:
- npm run lint
- npm run build
- 변경 요약 작성