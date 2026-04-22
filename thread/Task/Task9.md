AI 생성 API를 단일 랜딩페이지 생성에서 전체 웹사이트 생성으로 확장해줘.

기존:
- PageData 생성

변경:
- SiteData 생성

API:
POST /api/ai/generate-site

입력:
{
  businessName: string;
  siteType: 'landing' | 'business' | 'portfolio' | 'cafe' | 'clinic' | 'education' | 'agency' | 'shop' | 'creator';
  industry: string;
  targetAudience: string;
  goal: string;
  tone: string;
  pageCount: 'one-page' | 'small-site' | 'full-site';
  stylePreference?: string;
}

AI가 결정해야 하는 것:
- 사이트 이름
- brand tagline
- stylePackId
- pages 배열
- navigation
- page별 block 구성
- block별 variant
- SEO
- CTA 전략

규칙:
- AI는 React 코드나 HTML을 만들지 않음
- 반드시 SiteData JSON만 생성
- 지원되는 page type, block type, variant만 사용
- 한국어 문구 생성
- 지나치게 긴 문장 금지
- 사이트 목적에 맞는 페이지 구성
- pageCount가 one-page면 pages 1개
- small-site면 3~5개
- full-site면 5~8개
- StylePack은 기존 style-packs.ts의 id 중 하나를 우선 선택
- block variant도 기존 지원 variant 중 하나만 사용

검증:
- Zod schema로 검증
- 검증 실패 시 안전한 fallback SiteData 제공
- API key가 없으면 명확한 에러 반환
- 민감정보 로그 금지

작업 후:
- 기존 generate-page API가 있다면 generate-site로 대체하거나 호환 wrapper 제공
- npm run lint
- npm run build
- 변경 요약 작성