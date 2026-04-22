사용자가 랜딩페이지뿐 아니라 일반 웹사이트도 쉽게 만들 수 있도록 Site Template 시스템을 추가해줘.

파일:
- src/data/site-templates.ts
- src/types/template.ts
- src/components/editor/SiteTemplateGallery.tsx

SiteTemplate 구조:
{
  id: string;
  name: string;
  description: string;
  siteType:
    | 'landing'
    | 'business'
    | 'portfolio'
    | 'cafe'
    | 'clinic'
    | 'education'
    | 'agency'
    | 'shop'
    | 'creator';
  recommendedStylePackIds: string[];
  pages: SitePage[];
  navigation: NavItem[];
}

기본 템플릿 9개 생성:
1. AI SaaS Landing
2. Local Cafe Website
3. Beauty Clinic Website
4. Personal Portfolio
5. Coaching / Course Website
6. Small Business Homepage
7. Creative Agency Website
8. Product Showcase Website
9. Medical / Consultation Website

요구사항:
- 템플릿 선택 시 전체 SiteData 생성
- 페이지 여러 개 포함 가능
- Home/About/Services/Contact 같은 기본 페이지 자동 구성
- 템플릿 카드 UI는 예쁘게 구성
- 업종/목적/분위기 태그 표시
- 추천 StylePack도 함께 적용 가능
- 템플릿 선택 전 미리보기 preview 제공
- 기존 작업이 있으면 덮어쓰기 confirm 표시

작업 후:
- npm run lint
- npm run build
- 변경 요약 작성