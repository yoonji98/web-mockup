# AI Website Builder Redesign & Element Builder Tasks

## 최종 목표

현재 프로젝트는 AI 기반 랜딩페이지 빌더다.  
이제 목표는 랜딩페이지뿐 아니라 일반 웹사이트까지 쉽게 만들 수 있는 **AI Website Builder**로 확장하는 것이다.

최종적으로 사용자는 다음을 할 수 있어야 한다.

- AI로 랜딩페이지 또는 다중 페이지 웹사이트 생성
- 예쁜 Style Pack 선택
- Header에 로고, 메뉴, 로그인 버튼, CTA 버튼 추가
- Page별 섹션 추가/수정
- Section 안에 텍스트, 이미지, 버튼, 카드, 폼 등 요소 추가
- 원하는 위치에 요소 배치
- 블록별 디자인 variant 선택
- 다중 페이지 React 프로젝트로 export
- 생성된 프로젝트는 독립 실행 가능한 Vite React 프로젝트여야 함

---

# 전체 실행 순서

## Phase 1. 디자인 품질 개선

1. R01 디자인 시스템 도입
2. R02 Style Pack 시스템 추가

## Phase 2. 블록 디자인 고도화

3. R06 블록 Variant 시스템 추가
4. R07 블록 디자인 퀄리티 개선

## Phase 3. 웹사이트 빌더로 확장

5. R03 PageData를 SiteData 구조로 확장
6. R04 페이지 관리 UI 추가
7. R05 Header / Navigation / Footer 전역화

## Phase 4. 웹사이트 템플릿 시스템

8. R08 웹사이트 템플릿 시스템 추가

## Phase 5. AI 웹사이트 생성으로 확장

9. R09 AI 생성 방식을 SiteData로 변경
10. R10 AI 생성 UI를 웹사이트 마법사로 개선

## Phase 6. 에디터 사용성 개선

11. R11 Canvas 디자인 개선
12. R12 RightPanel을 Content / Design / AI 탭으로 개편

## Phase 7. React 프로젝트 Export 확장

13. R13 React 프로젝트 Export를 다중 페이지 사이트로 확장

## Phase 8. 디자인 QA 문서화

14. R14 디자인 QA 체크리스트 추가

## Phase 9. Element Builder / 자유 배치 기능

15. R15 Element Node 시스템 추가
16. R16 Header Builder 추가
17. R17 Element Library 패널 추가
18. R18 Container / Layout Block 추가
19. R20 Element Properties Panel 추가
20. R19 Drag & Drop으로 요소 위치 변경
21. R21 Freeform Section 추가
22. R22 AI가 Header / Elements / Layout까지 생성하게 개선
23. R23 React Export에 Element Builder 구조 반영

---

# 공통 작업 규칙

모든 Task에서 아래 규칙을 지켜줘.

- 기존 기능은 깨지지 않아야 함
- TypeScript 타입 안정성 유지
- 불필요한 any 사용 최소화
- React 컴포넌트는 재사용 가능하게 분리
- Tailwind CSS 기반으로 작성
- 모바일 반응형 필수
- 작업 후 npm run lint 실행
- 작업 후 npm run build 실행
- 문제가 있으면 수정
- 마지막에 변경 요약 작성

---

# Phase 1. 디자인 품질 개선

---

## Task R01. 디자인 시스템 도입

### 목적

에디터 UI를 더 깔끔하고 완성도 높은 SaaS 제품처럼 개선한다.

### Codex Prompt

현재 AI 랜딩페이지 빌더의 디자인이 너무 단조롭다.  
전체 UI와 생성되는 웹사이트의 디자인 품질을 높이기 위해 디자인 시스템을 도입해줘.

목표:

- 에디터 UI를 깔끔한 SaaS 제품처럼 개선
- 생성되는 랜딩페이지/웹사이트 블록 디자인을 더 고급스럽게 개선
- 팔레트 중심이 아니라 Style Pack 중심으로 확장할 수 있게 기반을 만든다

작업:

1. shadcn/ui 스타일의 컴포넌트 기반 UI 시스템을 도입해줘.
2. 공통 UI 컴포넌트를 만들어줘.
   - Button
   - Input
   - Textarea
   - Select
   - Card
   - Badge
   - Tabs
   - Dialog
   - Dropdown
   - Separator
   - Tooltip
3. lucide-react 아이콘을 사용해줘.
4. 에디터 전체 배경은 연한 gray 계열로 변경해줘.
5. 패널은 white background, subtle border, rounded-xl 또는 rounded-2xl을 사용해줘.
6. 버튼은 primary, secondary, ghost, outline variant를 갖게 해줘.
7. Tailwind className 정리를 위해 cn 유틸을 만들어줘.
8. 기존 UI를 공통 컴포넌트 기반으로 교체해줘.

디자인 톤:

- 깔끔한 SaaS
- 넉넉한 spacing
- 부드러운 radius
- 얇은 border
- 과하지 않은 shadow
- hover 상태 명확함
- 현대적인 웹앱 느낌

중요:

- 기존 기능은 깨지지 않아야 함
- 기존 editor store와 block renderer는 유지
- UI만 개선하되 구조 확장에 방해되지 않게 작성

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R02. Style Pack 시스템 추가

### 목적

단순 색상 팔레트가 아니라 색상, 폰트, 간격, radius, 버튼, 카드, 그림자까지 묶은 디자인 세트를 만든다.

### Codex Prompt

기존 Palette 시스템을 Style Pack 시스템으로 확장해줘.

기존 팔레트는 색상만 다루는데, 이제는 색상/폰트/레이아웃/버튼/카드/배경효과를 함께 다루는 StylePack이 필요하다.

파일:

- src/types/style.ts
- src/data/style-packs.ts
- src/store/editor-store.ts 수정
- src/components/editor/StylePackPanel.tsx 생성

StylePack 타입:

- id
- name
- description
- moodTags
- recommendedFor
- colors
  - primary
  - secondary
  - background
  - surface
  - text
  - mutedText
  - accent
  - border
- typography
  - headingFont
  - bodyFont
  - headingWeight: medium | semibold | bold | extrabold
  - bodySize: sm | base | lg
- layout
  - maxWidth: narrow | default | wide
  - sectionPadding: compact | comfortable | spacious
  - contentDensity: compact | normal | airy
- shape
  - radius: none | sm | md | lg | xl | 2xl
  - cardRadius
  - buttonRadius
- effects
  - shadow: none | soft | medium | bold
  - borderStyle: none | subtle | strong
  - backgroundStyle: flat | gradient | pattern | mesh
- button
  - style: solid | outline | soft | gradient
  - size: sm | md | lg

기본 StylePack 10개 생성:

1. Soft Editorial - 감성/브랜드/플라워/카페
2. Clean SaaS - 스타트업/SaaS/앱
3. Luxury Minimal - 프리미엄/패션/뷰티
4. Warm Local - 소상공인/매장/공방
5. Medical Clean - 병원/클리닉/상담
6. Bold Creator - 크리에이터/강의/커뮤니티
7. Calm Wellness - 요가/건강/심리상담
8. Dark Premium - 고급/B2B/컨설팅
9. Playful Pop - 이벤트/키즈/프로모션
10. Mono Portfolio - 포트폴리오/개인 사이트

요구사항:

- StylePack 선택 시 현재 사이트 theme에 반영
- 기존 palette 선택 기능은 StylePack 내부 색상 선택으로 흡수
- Canvas와 PublishedPage에서 StylePack 기반 스타일 사용
- 사용자 커스텀 StylePack도 저장 가능하도록 구조 준비
- StylePackPanel에서 각 StylePack의 색상 preview, mood tag, 추천 용도를 보여줘
- 선택된 StylePack은 active 상태로 표시

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

# Phase 2. 블록 디자인 고도화

---

## Task R06. 블록 Variant 시스템 추가

### 목적

같은 Hero, Features, CTA라도 여러 디자인 버전으로 보여줄 수 있게 한다.

### Codex Prompt

현재 블록 디자인이 단조롭다.  
각 블록에 variant를 추가해서 같은 콘텐츠라도 다른 디자인으로 렌더링되게 해줘.

Block 구조 변경:

- id
- type
- variant
- props

지원 variant:

hero:

- centered
- split-image
- editorial
- saas-gradient
- minimal
- luxury

features:

- icon-grid
- card-grid
- bento
- alternating
- numbered-list

about:

- story
- image-left
- image-right
- stats-focused
- timeline

services:

- service-cards
- detailed-list
- category-grid

testimonials:

- quote-cards
- wall
- featured

pricing:

- simple-cards
- comparison
- highlighted-plan

faq:

- accordion
- two-column
- minimal-list

cta:

- centered
- split
- banner
- gradient

contact:

- simple-form
- split-info
- booking-cta

작업:

1. Block 타입과 schema에 variant 추가
2. block-defaults에 기본 variant 설정
3. BlockRenderer에서 type + variant 기반 렌더링
4. 각 블록 컴포넌트 내부에서 variant별 layout 변경
5. RightPanel에서 variant 선택 가능
6. 기존 block은 migration으로 기본 variant 부여

중요:

- 디자인 품질을 높이는 것이 목표
- 모든 variant가 완전히 다를 필요는 없지만, 최소한 레이아웃/배경/카드 스타일 차이가 있어야 함
- 모바일 반응형 필수
- StylePack의 colors, spacing, radius, shadow를 최대한 반영
- 기존 저장 데이터가 깨지지 않도록 fallback variant 제공

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R07. 블록 디자인 퀄리티 개선

### 목적

생성되는 사이트가 더 고급스럽고 예쁘게 보이도록 모든 블록 컴포넌트를 리디자인한다.

### Codex Prompt

생성되는 사이트가 더 예쁘게 보이도록 모든 블록 컴포넌트의 디자인을 개선해줘.

공통 디자인 규칙:

- section padding은 넉넉하게
- max-width는 stylePack.layout.maxWidth 반영
- h1/h2 font-size는 더 크게
- subtitle은 mutedText 사용
- 카드에는 subtle border와 soft shadow 사용
- 버튼은 stylePack.button 반영
- 배경은 stylePack.effects.backgroundStyle 반영
- rounded는 stylePack.shape 반영
- 모바일에서 여백이 너무 크지 않게 조정

Hero:

- 큰 타이포그래피
- CTA 2개 지원
- badge/eyebrow 지원
- imagePrompt가 있으면 고급스러운 placeholder 카드 표시
- gradient background variant 추가
- split-image variant는 데스크탑에서 2단 레이아웃, 모바일에서 세로 레이아웃

Features:

- icon placeholder 추가
- bento layout variant 추가
- hover lift 효과
- 카드형, 번호형, 리스트형 variant 차이를 명확히 표현

About:

- stats 3개 표시 가능
- image placeholder를 더 예쁘게
- 긴 문단은 max-width 제한
- image-left / image-right / story variant 구분

Services:

- 서비스 카드 블록 추가
- 가격/소요시간/설명/CTA 표시 가능
- 소상공인/병원/교육 사이트에도 어울리게 구성

Portfolio:

- 프로젝트 카드 블록 추가
- 이미지 placeholder와 category badge 표시
- masonry나 grid 느낌을 낼 수 있게 구성

Contact:

- 폼 UI 개선
- 연락처 카드
- 카카오톡/이메일/전화 CTA 지원
- split-info, booking-cta variant 지원

CTA:

- centered, split, banner, gradient variant를 확실히 다르게 표현
- primary CTA가 명확하게 보이게 개선

FAQ:

- accordion 스타일 또는 two-column 스타일 지원
- 질문/답변 위계 명확히 표현

Footer:

- simple, columns, brand-heavy, newsletter 스타일 지원

작업 후:

- 기본 생성 사이트가 깔끔한 SaaS/브랜드 사이트처럼 보여야 함
- npm run lint
- npm run build
- 변경 요약 작성

---

# Phase 3. 웹사이트 빌더로 확장

---

## Task R03. PageData를 SiteData 구조로 확장

### 목적

단일 랜딩페이지가 아니라 여러 페이지를 가진 일반 웹사이트도 만들 수 있게 한다.

### Codex Prompt

현재 프로젝트는 단일 PageData 기반이다.  
랜딩페이지뿐 아니라 일반 웹사이트도 만들 수 있게 SiteData 구조로 확장해줘.

새 구조:

SiteData:

- id
- name
- slug
- brand
  - name
  - tagline
  - logoText
- theme
- navigation
  - items
  - cta
- pages
- globalSections
  - header
  - footer
- seo
  - title
  - description
  - keywords

SitePage:

- id
- title
- slug
- type
  - home
  - landing
  - about
  - services
  - portfolio
  - pricing
  - contact
  - blog
  - product
  - custom
- seo
- blocks

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

---

## Task R04. 페이지 관리 UI 추가

### 목적

사용자가 Home, About, Services, Contact 같은 페이지를 쉽게 추가/수정/삭제할 수 있게 한다.

### Codex Prompt

랜딩페이지뿐 아니라 여러 페이지짜리 웹사이트를 만들 수 있게 페이지 관리 UI를 추가해줘.

파일:

- src/components/editor/PagesPanel.tsx
- src/components/editor/PageCreateDialog.tsx
- LeftSidebar 수정

요구사항:

1. LeftSidebar 상단에 Pages 탭 추가
2. 현재 사이트의 pages 목록 표시
3. 페이지 클릭 시 currentPage 변경
4. 페이지 추가 가능
5. 페이지 삭제 가능
6. 페이지 복제 가능
7. 페이지 title/slug 수정 가능
8. page type 선택 가능
   - Home
   - Landing
   - About
   - Services
   - Portfolio
   - Pricing
   - Contact
   - Blog
   - Product
   - Custom

UX:

- 현재 페이지는 active 상태 표시
- Home page는 삭제 방지
- slug 중복 방지
- 페이지 추가 시 기본 블록 자동 생성 옵션 제공
- 페이지 목록은 깔끔한 카드/리스트 형태로 표시
- 페이지별 아이콘을 lucide-react로 표시
- 페이지 slug가 잘못되면 에러 표시

작업 후:

- Canvas는 currentPage.blocks만 렌더링
- TopBar에 현재 페이지명 표시
- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R05. Header / Navigation / Footer를 글로벌 섹션으로 분리

### 목적

일반 웹사이트처럼 모든 페이지에 공통 Header와 Footer가 나오게 한다.

### Codex Prompt

일반 웹사이트를 만들기 위해 Header, Navigation, Footer를 전역 섹션으로 분리해줘.

작업:

1. HeaderBlock을 일반 block이 아니라 global header로 렌더링
2. FooterBlock도 global footer로 렌더링 가능하게 변경
3. SiteData.navigation.items를 기반으로 Header 렌더링
4. Header variant 지원
   - minimal
   - centered
   - cta-right
   - transparent
5. Footer variant 지원
   - simple
   - columns
   - brand-heavy
   - newsletter

파일:

- src/components/site/SiteRenderer.tsx
- src/components/site/SiteHeader.tsx
- src/components/site/SiteFooter.tsx
- src/components/editor/NavigationPanel.tsx

요구사항:

- SiteRenderer는 site와 currentPage를 받아 header + page blocks + footer를 렌더링
- Editor Canvas에서도 SiteRenderer 사용
- Published site에서도 SiteRenderer 사용
- navigation item 추가/삭제/수정 가능
- CTA 버튼 label/href 수정 가능
- Header/Footer는 StylePack을 반영
- 모바일에서는 navigation이 menu 형태로 동작
- footer에는 brand name, tagline, links, copyright 표시

주의:

- 기존 FooterBlock이 있으면 global footer로 migration하거나 fallback 처리
- Header/Footer를 숨기는 옵션도 구조상 가능하게 준비

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

# Phase 4. 웹사이트 템플릿 시스템

---

## Task R08. 웹사이트 템플릿 시스템 추가

### 목적

사용자가 블록을 하나씩 조립하지 않아도 업종별 사이트를 바로 시작할 수 있게 한다.

### Codex Prompt

사용자가 랜딩페이지뿐 아니라 일반 웹사이트도 쉽게 만들 수 있도록 Site Template 시스템을 추가해줘.

파일:

- src/data/site-templates.ts
- src/types/template.ts
- src/components/editor/SiteTemplateGallery.tsx

SiteTemplate 구조:

- id
- name
- description
- siteType
  - landing
  - business
  - portfolio
  - cafe
  - clinic
  - education
  - agency
  - shop
  - creator
- recommendedStylePackIds
- pages
- navigation

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

---

# Phase 5. AI 웹사이트 생성으로 확장

---

## Task R09. AI 생성 방식을 PageData에서 SiteData로 변경

### 목적

AI가 단일 랜딩페이지가 아니라 전체 웹사이트 구조를 생성하도록 변경한다.

### Codex Prompt

AI 생성 API를 단일 랜딩페이지 생성에서 전체 웹사이트 생성으로 확장해줘.

기존:

- PageData 생성

변경:

- SiteData 생성

API:

- POST /api/ai/generate-site

입력:

- businessName
- siteType
  - landing
  - business
  - portfolio
  - cafe
  - clinic
  - education
  - agency
  - shop
  - creator
- industry
- targetAudience
- goal
- tone
- pageCount
  - one-page
  - small-site
  - full-site
- stylePreference

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

---

## Task R10. AI 생성 UI를 웹사이트 생성 마법사로 개선

### 목적

사용자가 복잡한 설정 없이 단계별로 사이트를 생성할 수 있게 한다.

### Codex Prompt

AI 생성 UI를 랜딩페이지 생성 폼에서 웹사이트 생성 마법사로 개선해줘.

파일:

- src/components/editor/AISiteWizard.tsx

단계:

1. 사이트 종류 선택
   - 랜딩페이지
   - 회사/매장 홈페이지
   - 포트폴리오
   - 카페/식당
   - 병원/클리닉
   - 강의/코칭
   - 에이전시
   - 제품 소개
   - 크리에이터 사이트

2. 기본 정보 입력
   - 브랜드명
   - 업종
   - 타겟 고객
   - 주요 목적

3. 페이지 규모 선택
   - 한 페이지
   - 작은 사이트 3~5페이지
   - 전체 사이트 5~8페이지

4. 분위기 선택
   - 감성적인
   - 미니멀한
   - 고급스러운
   - 전문적인
   - 따뜻한
   - 트렌디한
   - 강렬한

5. AI 생성

요구사항:

- 생성 전 preview summary 표시
- 생성 중 skeleton/loading UI 표시
- 생성 후 SiteData를 editor store에 반영
- 기존 작업 덮어쓰기 confirm
- 결과가 마음에 안 들면 다른 스타일로 다시 생성 버튼 제공
- 생성 결과에 선택된 StylePack과 생성된 페이지 목록 표시
- 에러 발생 시 사용자가 이해하기 쉬운 메시지 표시

UI 톤:

- 마법사 형태의 깔끔한 dialog 또는 full panel
- 단계 표시 progress
- 선택 옵션은 카드 UI
- 너무 복잡하지 않게 구성

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

# Phase 6. 에디터 사용성 개선

---

## Task R11. Canvas 디자인 개선

### 목적

Canvas가 그냥 미리보기 화면처럼 보이지 않고, 실제 웹사이트 제작 도구처럼 보이게 한다.

### Codex Prompt

CanvasArea의 디자인을 개선해줘.

문제:

현재 Canvas가 단순 preview처럼 보여서 제품 완성도가 낮아 보인다.

개선:

1. Canvas 배경을 연한 checker/grid 또는 gray background로 변경
2. preview frame을 흰색 카드처럼 표시
3. frame에 shadow, rounded border 적용
4. Desktop/Tablet/Mobile 토글을 더 예쁘게
5. mobile preview는 실제 기기 프레임 느낌으로 표시
6. 선택된 블록은 과한 파란 테두리 대신 subtle ring + floating toolbar 표시

Floating toolbar:

- 위로
- 아래로
- 복제
- 삭제
- Variant 변경
- AI 수정

요구사항:

- hover 시 섹션 경계가 부드럽게 보이게
- selected 상태와 hover 상태 구분
- preview mode 변경 시 width transition 적용
- Canvas frame은 중앙 정렬
- desktop/tablet/mobile 각각 자연스러운 너비 적용
- toolbar는 선택된 블록 위쪽 또는 오른쪽에 floating 형태로 표시
- toolbar 버튼은 아이콘 + tooltip 사용

작업 후:

- 기존 block selection 기능 유지
- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R12. RightPanel을 Content / Design / AI 탭으로 개편

### 목적

오른쪽 편집 패널을 더 직관적으로 만들고, 콘텐츠/디자인/AI 기능을 분리한다.

### Codex Prompt

RightPanel을 더 쓰기 쉽게 탭 구조로 바꿔줘.

탭:

1. Content
   - 텍스트/리스트/링크 편집

2. Design
   - block variant 선택
   - background style
   - spacing
   - alignment
   - 카드 스타일
   - 버튼 스타일

3. AI
   - 문구 다듬기
   - 블록 다시 생성
   - 더 고급스럽게
   - 더 짧게
   - CTA 강하게
   - 다른 레이아웃 추천

요구사항:

- 선택된 블록이 없으면 안내 empty state
- 선택된 블록이 있으면 block type 표시
- variant를 dropdown 또는 visual card로 선택 가능
- 배열 편집 UI 개선
- 저장 버튼 없이 즉시 반영
- Content 탭은 기존 block editor 기능 유지
- Design 탭은 variant, alignment, spacing 같은 디자인 옵션 담당
- AI 탭은 기존 AI rewrite 기능과 연결
- 각 탭은 UI적으로 깔끔하게 분리

작업 후:

- 기존 RightPanel 기능이 사라지지 않게 유지
- npm run lint
- npm run build
- 변경 요약 작성

---

# Phase 7. React 프로젝트 Export 확장

---

## Task R13. React 프로젝트 Export를 다중 페이지 사이트로 확장

### 목적

단일 랜딩페이지 export가 아니라, 여러 페이지를 가진 React 웹사이트 프로젝트로 export되게 한다.

### Codex Prompt

현재 React 프로젝트 export는 단일 PageData 기준이다.  
이제 SiteData 기반의 다중 페이지 React 프로젝트로 export되게 바꿔줘.

Export 결과물:

- Vite React
- React Router 사용
- SiteData JSON 포함
- pages 배열 기반으로 라우트 생성
- navigation 작동
- header/footer 포함
- stylePack 반영

생성 파일:

- src/main.tsx
- src/App.tsx
- src/data/site.json
- src/types/site.ts
- src/components/site/SiteRenderer.tsx
- src/components/site/SiteHeader.tsx
- src/components/site/SiteFooter.tsx
- src/components/blocks/BlockRenderer.tsx
- src/components/blocks/HeroBlock.tsx
- src/components/blocks/FeaturesBlock.tsx
- src/components/blocks/AboutBlock.tsx
- src/components/blocks/ServicesBlock.tsx
- src/components/blocks/PortfolioBlock.tsx
- src/components/blocks/TestimonialsBlock.tsx
- src/components/blocks/PricingBlock.tsx
- src/components/blocks/FaqBlock.tsx
- src/components/blocks/CtaBlock.tsx
- src/components/blocks/ContactBlock.tsx
- src/styles/globals.css

요구사항:

- site.pages를 기반으로 route 구성
- "/"는 home page
- "/about", "/services", "/contact" 등 동작
- navigation href와 slug 연결
- export된 프로젝트는 빌더 서비스에 의존하지 않음
- npm install 후 npm run build 통과
- README에 다중 페이지 구조 설명
- Tailwind 설정 포함
- StylePack의 색상, radius, shadow, spacing이 export 결과에도 반영
- 빌더 내부 editor store, AI API, 결제 코드는 export에 포함하지 않음

README에 포함할 내용:

- 설치 방법
- 실행 방법
- 빌드 방법
- site.json 수정 방법
- 페이지 추가 방법
- 스타일 수정 방법

작업 후:

- export zip을 실제로 생성
- 압축 해제
- npm install
- npm run build 실행
- 문제 있으면 수정
- 변경 요약 작성

---

# Phase 8. 디자인 QA 문서화

---

## Task R14. 디자인 QA 체크리스트 추가

### 목적

블록과 템플릿을 계속 추가해도 디자인 품질이 떨어지지 않게 기준을 문서화한다.

### Codex Prompt

디자인 품질을 일정 수준 이상으로 유지하기 위한 QA 체크리스트를 문서로 추가해줘.

파일:

- docs/design-qa.md

내용:

1. Typography
   - h1 크기
   - h2 크기
   - body line-height
   - muted text 색상
   - heading/body font 조합

2. Spacing
   - section padding
   - card padding
   - grid gap
   - mobile spacing
   - desktop spacing

3. Visual hierarchy
   - CTA가 눈에 띄는가
   - 제목/설명 구분이 명확한가
   - 섹션마다 핵심 메시지가 보이는가
   - 카드 간 우선순위가 명확한가

4. Responsive
   - mobile에서 overflow 없는가
   - button이 너무 작지 않은가
   - grid가 1열로 자연스럽게 바뀌는가
   - header navigation이 모바일에서 잘 동작하는가

5. Style consistency
   - radius 일관성
   - shadow 일관성
   - border 일관성
   - button 스타일 일관성
   - card 스타일 일관성

6. Generated site quality
   - 첫 화면이 매력적인가
   - 업종에 맞는 문구인가
   - 페이지 구성이 자연스러운가
   - CTA가 목적에 맞는가
   - 불필요하게 긴 문장이 없는가

7. Export quality
   - export된 React 프로젝트가 빌드되는가
   - navigation이 동작하는가
   - 다중 페이지 라우팅이 동작하는가
   - stylePack이 export 결과에도 반영되는가

README에 다음 내용도 추가:

- 블록 컴포넌트를 수정할 때 docs/design-qa.md를 기준으로 확인할 것
- 새 StylePack을 추가할 때 contrast와 responsive를 확인할 것
- 새 Block Variant를 추가할 때 mobile layout을 반드시 확인할 것

작업 후:

- 문서 추가
- README 업데이트
- 변경 요약 작성

---

# Phase 9. Element Builder / 자유 배치 기능 추가

---

## Phase 9 목표

현재 빌더는 블록 단위로 사이트를 만든다.  
이제 사용자가 로고, 메뉴, 로그인 버튼, CTA 버튼, 텍스트, 이미지 같은 요소를 원하는 위치에 추가하고 배치할 수 있게 확장한다.

핵심 방향:

- 단순 Block 기반에서 Section / Container / Element 기반으로 확장
- Header에는 logo, menu, login button, CTA button을 자유롭게 구성할 수 있게 한다
- 일반 섹션에는 text, image, button, card, form 같은 요소를 추가할 수 있게 한다
- 기본은 안전한 layout system을 사용한다
- 고급 기능으로 Freeform Section을 추가한다
- export된 React 프로젝트에도 element layout이 반영되어야 한다

권장 구조:

- Site
  - Page
    - Sections
      - Containers
        - Elements

---

## Task R15. Element Node 시스템 추가

### 목적

사용자가 로고, 메뉴, 버튼, 텍스트, 이미지 같은 요소를 원하는 위치에 넣을 수 있도록 데이터 구조를 확장한다.

### Codex Prompt

현재 프로젝트는 block 중심 구조다.  
사용자가 로고, 메뉴, 버튼, 텍스트, 이미지 같은 요소를 원하는 위치에 넣을 수 있도록 Element Node 시스템을 추가해줘.

목표:

- block 내부에 elements를 가질 수 있게 한다
- header/navigation도 element 기반으로 구성 가능하게 한다
- 앞으로 자유 배치와 drag/drop을 지원할 수 있는 데이터 구조를 만든다

새 타입:

ElementNode:

- id
- type
  - logo
  - text
  - heading
  - button
  - image
  - icon
  - menu
  - link
  - badge
  - card
  - form
  - input
  - textarea
  - divider
  - spacer
  - socialLinks
  - loginButton
  - signupButton
- props
- style
  - width
  - maxWidth
  - height
  - padding
  - margin
  - alignSelf
  - justifySelf
  - textAlign
  - color
  - backgroundColor
  - borderRadius
- responsive
  - desktop
  - tablet
  - mobile

ContainerNode:

- id
- type
  - stack
  - row
  - grid
  - columns
  - headerBar
  - cardGroup
  - freeform
- layout
  - direction
  - gap
  - align
  - justify
  - columns
  - wrap
- children

작업:

1. src/types/elements.ts 생성
2. src/schemas/element-schema.ts 생성
3. ElementNodeSchema 작성
4. ContainerNodeSchema 작성
5. 기존 Block 타입에 elements 또는 containers 추가
6. 기존 블록은 props 기반 렌더링을 유지하되, element 기반 블록도 렌더링 가능하게 준비
7. migration 함수 작성
   - 기존 hero props를 heading/text/button/image element로 변환 가능하게 준비
   - 기존 footer props를 logo/menu/text/socialLinks element로 변환 가능하게 준비

중요:

- 기존 block renderer가 깨지면 안 됨
- element 기반 렌더링은 점진적으로 도입
- 타입 안전하게 작성
- any 사용 최소화

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R16. Header Builder 추가

### 목적

상단 헤더에 로고, 메뉴, 로그인 버튼, CTA 버튼을 사용자가 직접 추가/수정/배치할 수 있게 한다.

### Codex Prompt

상단 헤더를 사용자가 직접 구성할 수 있게 Header Builder를 추가해줘.

목표:

- 사용자가 로고를 넣을 수 있다
- 메뉴를 추가/수정/삭제할 수 있다
- 로그인 버튼을 넣을 수 있다
- 회원가입/문의하기 같은 CTA 버튼을 넣을 수 있다
- 로고/메뉴/버튼을 left/center/right slot에 배치할 수 있다
- 모바일 메뉴도 자동으로 생성된다

Header 구조:

HeaderConfig:

- variant
  - minimal
  - centered
  - cta-right
  - transparent
  - custom
- sticky
- transparent
- height
  - sm
  - md
  - lg
- slots
  - left
  - center
  - right
  - mobile

필요 요소:

- logo
- menu
- loginButton
- signupButton
- button
- link
- icon

파일:

- src/components/editor/HeaderBuilderPanel.tsx
- src/components/site/SiteHeader.tsx 수정
- src/types/elements.ts 수정
- src/schemas/site-schema.ts 수정
- src/store/editor-store.ts 수정

기능:

1. HeaderBuilderPanel 생성
2. left / center / right slot 표시
3. 각 slot에 요소 추가 가능
4. slot 안에서 요소 순서 변경 가능
5. 요소를 다른 slot으로 이동 가능
6. Logo 텍스트/이미지 설정 가능
7. Menu items 추가/수정/삭제 가능
8. Login button label/href 수정 가능
9. CTA button label/href/style 수정 가능
10. sticky header 옵션
11. transparent header 옵션
12. mobile menu 자동 구성

UI:

- LeftSidebar 또는 RightPanel에 Header 탭 추가
- slot별 카드 UI
- 요소 추가 버튼
- 요소 선택 시 RightPanel에서 props 수정
- drag/drop 가능하면 dnd-kit 사용
- 우선 drag/drop이 어렵다면 move left/right/up/down 버튼으로 구현하고, 이후 drag/drop으로 개선

작업 후:

- Header가 SiteRenderer에서 모든 페이지 상단에 렌더링되어야 함
- export된 React 프로젝트에도 Header 구성이 반영되어야 함
- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R17. Element Library 패널 추가

### 목적

사용자가 블록뿐 아니라 개별 요소를 추가할 수 있게 한다.

### Codex Prompt

사용자가 원하는 요소를 페이지나 헤더에 추가할 수 있도록 Element Library 패널을 추가해줘.

목표:

- 사용자가 블록뿐 아니라 개별 요소를 추가할 수 있게 한다
- 요소를 선택한 container나 slot에 넣을 수 있게 한다
- 초반에는 click-to-add 방식으로 구현하고, 이후 drag/drop으로 확장한다

파일:

- src/components/editor/ElementLibraryPanel.tsx
- src/data/element-defaults.ts
- src/components/elements/ElementRenderer.tsx
- src/components/elements/LogoElement.tsx
- src/components/elements/TextElement.tsx
- src/components/elements/HeadingElement.tsx
- src/components/elements/ButtonElement.tsx
- src/components/elements/ImageElement.tsx
- src/components/elements/MenuElement.tsx
- src/components/elements/BadgeElement.tsx
- src/components/elements/CardElement.tsx
- src/components/elements/FormElement.tsx
- src/components/elements/DividerElement.tsx
- src/components/elements/SpacerElement.tsx
- src/components/elements/SocialLinksElement.tsx
- src/components/elements/LoginButtonElement.tsx

Element Library 카테고리:

1. Brand
   - Logo
   - Badge

2. Text
   - Heading
   - Text
   - Link

3. Action
   - Button
   - Login Button
   - Signup Button

4. Media
   - Image
   - Icon

5. Navigation
   - Menu
   - Social Links

6. Form
   - Form
   - Input
   - Textarea

7. Layout
   - Divider
   - Spacer
   - Card

기능:

1. 요소 목록 표시
2. 요소 클릭 시 현재 선택된 container/slot/block에 추가
3. 선택된 위치가 없으면 사용자에게 안내
4. 요소 기본값은 element-defaults.ts에서 관리
5. ElementRenderer에서 type별 컴포넌트 렌더링
6. StylePack 색상과 radius 반영
7. 모바일 반응형 고려

작업 후:

- Header slot에 logo/menu/button 추가 가능
- 일반 section에도 heading/text/button/image/card 추가 가능
- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R18. Container / Layout Block 추가

### 목적

빈 섹션을 만들고 그 안에 요소를 원하는 구조로 배치할 수 있게 한다.

### Codex Prompt

사용자가 원하는 위치에 요소를 넣을 수 있도록 Container 기반 layout block을 추가해줘.

목표:

- 빈 섹션을 만들고 그 안에 요소를 추가할 수 있게 한다
- Row, Stack, Grid, Columns 같은 레이아웃을 제공한다
- 사용자가 텍스트/이미지/버튼을 원하는 구조로 배치할 수 있다

새 Block:

- customSection
- containerSection
- gridSection
- columnsSection
- freeformSection

Container 종류:

- Stack: 세로 배치
- Row: 가로 배치
- Grid: 격자 배치
- Columns: 2~4단 배치
- CardGroup: 카드 묶음
- Freeform: 자유 배치

작업:

1. BlockType에 customSection/containerSection/gridSection/columnsSection/freeformSection 추가
2. block-defaults에 기본값 추가
3. ContainerRenderer 생성
4. ContainerNode를 렌더링하는 컴포넌트 생성
5. Container 안에 ElementNode를 렌더링
6. RightPanel에서 container layout 편집 가능하게 구성
   - direction
   - gap
   - align
   - justify
   - columns
   - padding
   - background
7. Canvas에서 container 선택 가능
8. Element 추가 시 선택된 container에 추가

UI:

- 빈 섹션 추가
- 2단 섹션 추가
- 3단 카드 섹션 추가
- 자유 배치 섹션 추가
- 헤더용 Row 추가

주의:

- 일반 사용자는 복잡한 CSS를 몰라도 되게 select/input 중심으로 구성
- mobile에서는 columns/grid가 자연스럽게 1열로 바뀌어야 함
- export된 React 프로젝트에도 container 구조가 반영되어야 함

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R20. Element Properties Panel 추가

### 목적

선택된 Element의 내용을 수정할 수 있는 속성 패널을 만든다.

### Codex Prompt

선택된 Element의 내용을 수정할 수 있는 Properties Panel을 추가해줘.

목표:

- 로고 텍스트 수정
- 메뉴 항목 수정
- 버튼 label/href/style 수정
- 텍스트 내용 수정
- 이미지 URL/alt 수정
- 카드 내용 수정
- 폼 필드 수정
- 요소별 spacing, alignment, visibility 수정

파일:

- src/components/editor/ElementPropertiesPanel.tsx
- src/components/editor/element-editors/LogoElementEditor.tsx
- src/components/editor/element-editors/MenuElementEditor.tsx
- src/components/editor/element-editors/ButtonElementEditor.tsx
- src/components/editor/element-editors/TextElementEditor.tsx
- src/components/editor/element-editors/ImageElementEditor.tsx
- src/components/editor/element-editors/CardElementEditor.tsx
- src/components/editor/element-editors/FormElementEditor.tsx
- src/components/editor/element-editors/SpacingEditor.tsx
- src/components/editor/element-editors/VisibilityEditor.tsx

기능:

1. selectedElementId 상태 추가
2. Element 클릭 시 selectedElementId 설정
3. RightPanel에서 block 선택과 element 선택을 구분
4. element가 선택되면 ElementPropertiesPanel 표시
5. element type에 따라 다른 editor 렌더링
6. 공통 style editor 제공
   - width
   - maxWidth
   - padding
   - margin
   - textAlign
   - alignSelf
   - hideOnMobile
   - hideOnDesktop
7. 변경 즉시 Canvas에 반영

MenuElementEditor:

- menu item label/href 수정
- item 추가/삭제
- 순서 변경

ButtonElementEditor:

- label
- href
- variant
- size
- openInNewTab

LogoElementEditor:

- logo type: text/image
- logo text
- image url
- href

작업 후:

- Header의 logo/menu/login button 수정 가능
- 일반 section의 text/button/image 수정 가능
- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R19. Drag & Drop으로 요소 위치 변경

### 목적

Header slot, Container, Section 안의 요소를 드래그해서 위치 변경할 수 있게 한다.

### Codex Prompt

Element와 Container를 drag/drop으로 이동할 수 있게 해줘.

목표:

- Header slot 안에서 logo/menu/button 순서 변경
- Header left/center/right slot 간 요소 이동
- Container 안에서 element 순서 변경
- Page 안에서 section 순서 변경
- 추후 freeform section에서는 x/y 위치 이동 가능하게 준비

라이브러리:

- dnd-kit 사용 권장

작업:

1. dnd-kit 설치
2. DragDropProvider 또는 EditorDndContext 생성
3. sortable section 구현
4. sortable element 구현
5. droppable header slot 구현
6. droppable container 구현
7. drag end 시 store 업데이트
8. 드래그 중 preview overlay 표시
9. 드래그 가능한 요소에는 handle 표시
10. mobile/touch 환경도 고려

지원해야 하는 이동:

- section reorder
- element reorder within same container
- element move between containers
- element move between header slots
- element move from library to selected container는 후순위 가능

데이터 업데이트:

- moveElement(elementId, fromLocation, toLocation)
- reorderElements(containerId, activeId, overId)
- moveElementToHeaderSlot(elementId, slot)
- moveSection(activeId, overId)

주의:

- drag/drop 실패 시 기존 상태 유지
- id 기반으로 안전하게 업데이트
- nested structure 업데이트 유틸 분리
- 너무 복잡하면 먼저 header slot + container 내부 reorder부터 구현

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R21. Freeform Section 추가

### 목적

고급 사용자용으로 자유 배치가 가능한 섹션을 추가한다.

### Codex Prompt

고급 사용자용으로 자유 배치가 가능한 Freeform Section을 추가해줘.

목표:

- 사용자가 요소를 섹션 안에서 자유롭게 배치할 수 있다
- x, y, width, height 값을 저장한다
- 데스크탑/태블릿/모바일별 layout을 따로 가질 수 있게 준비한다

FreeformElementLayout:

- elementId
- x
- y
- w
- h
- zIndex
- breakpoint
  - desktop
  - tablet
  - mobile

FreeformSection props:

- height
- background
- elements
- layouts

기능:

1. freeformSection block 추가
2. Canvas에서 요소를 드래그로 이동 가능
3. 가능하면 resize도 지원
4. 위치는 grid 단위로 snap
5. 요소 선택 시 x/y/w/h 편집 가능
6. z-index 조정 가능
7. 모바일 layout은 별도로 fallback 처리

라이브러리:

- react-grid-layout 사용 검토
- 어렵다면 초기 버전은 absolute positioning + 직접 x/y 입력으로 구현

주의:

- Freeform은 고급 기능으로 표시
- 기본 사용자에게는 Stack/Row/Grid/Columns를 우선 추천
- 자유 배치는 responsive가 깨질 수 있으므로 desktop 중심으로 안내
- export된 React 프로젝트에도 freeform layout 반영

작업 후:

- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R22. AI가 Header / Elements / Layout까지 생성하게 개선

### 목적

AI 생성 결과가 단순 block만 만드는 것이 아니라 header, navigation, elements, layout까지 구성하도록 개선한다.

### Codex Prompt

AI 생성 결과가 단순 block만 만드는 것이 아니라 header, navigation, elements, layout까지 구성하도록 개선해줘.

목표:

- AI가 브랜드명에 맞는 로고 텍스트를 생성
- AI가 메뉴 구조를 생성
- AI가 로그인/회원가입/문의 버튼 여부를 목적에 맞게 결정
- AI가 페이지별 섹션 안에 heading/text/button/image/card 요소를 배치
- AI가 StylePack과 block variant도 함께 선택

AI 생성 SiteData에 포함할 것:

- global header
- navigation items
- header slots
- logo element
- menu element
- loginButton 또는 CTA button
- pages
- sections
- containers
- elements
- footer

규칙:

1. AI는 React 코드나 HTML을 만들지 않는다
2. SiteData JSON만 생성한다
3. 지원되는 element type만 사용한다
4. 지원되는 container type만 사용한다
5. Header에는 기본적으로 logo + menu + CTA를 넣는다
6. 로그인 기능이 필요한 사이트 유형이면 loginButton을 추가한다
7. 랜딩페이지는 CTA 중심
8. 일반 웹사이트는 navigation 중심
9. 쇼핑/강의/앱 서비스는 login/signup 버튼을 더 적극적으로 사용
10. 카페/병원/소상공인 사이트는 문의하기/예약하기 CTA 중심

작업:

1. generate-site prompt 수정
2. site-schema에 header slots/elements 검증 추가
3. AI response validation 강화
4. fallback SiteData도 element 기반으로 수정
5. AISiteWizard에서 로그인 버튼 필요 옵션 추가
6. 상단 메뉴 구성 옵션 추가
   - 기본 메뉴 자동 생성
   - 한 페이지 앵커 메뉴
   - 다중 페이지 메뉴

작업 후:

- AI 생성 사이트 상단에 로고, 메뉴, CTA 버튼이 자동 생성되어야 함
- 사용자가 HeaderBuilderPanel에서 수정 가능해야 함
- npm run lint
- npm run build
- 변경 요약 작성

---

## Task R23. React Export에 Element Builder 구조 반영

### 목적

Element Builder와 Header Builder 구조를 React 프로젝트 export에 반영한다.

### Codex Prompt

Element Builder와 Header Builder 구조를 React 프로젝트 export에 반영해줘.

목표:

- export된 React 프로젝트에서도 header slots, logo, menu, login button, CTA button이 그대로 렌더링된다
- customSection/containerSection/freeformSection도 export된다
- ElementRenderer와 ContainerRenderer가 export 결과물에 포함된다

Export 결과물에 추가할 파일:

- src/components/elements/ElementRenderer.tsx
- src/components/elements/LogoElement.tsx
- src/components/elements/TextElement.tsx
- src/components/elements/HeadingElement.tsx
- src/components/elements/ButtonElement.tsx
- src/components/elements/ImageElement.tsx
- src/components/elements/MenuElement.tsx
- src/components/elements/LoginButtonElement.tsx
- src/components/elements/SocialLinksElement.tsx
- src/components/elements/FormElement.tsx
- src/components/layout/ContainerRenderer.tsx
- src/components/layout/FreeformRenderer.tsx

요구사항:

1. export된 site.json에 elements/containers/header slots 포함
2. SiteHeader가 slot 기반으로 렌더링
3. ElementRenderer가 type별 element 렌더링
4. ContainerRenderer가 stack/row/grid/columns 렌더링
5. FreeformRenderer가 freeform layout 렌더링
6. React Router navigation 유지
7. mobile menu 작동
8. npm install 후 npm run build 통과

주의:

- 빌더 내부 editor code는 export하지 않음
- export 결과물은 순수 렌더링용 코드만 포함
- dnd-kit, editor-store, AI API, billing code는 export하지 않음

작업 후:

- export zip 생성
- 압축 해제
- npm install
- npm run build
- 문제 있으면 수정
- 변경 요약 작성

---

# 최종 우선순위 요약

## 먼저 디자인 살리기

1. R01 디자인 시스템 도입
2. R02 Style Pack 시스템 추가
3. R06 블록 Variant 시스템 추가
4. R07 블록 디자인 퀄리티 개선

## 그다음 웹사이트 구조로 확장

5. R03 PageData를 SiteData 구조로 확장
6. R04 페이지 관리 UI 추가
7. R05 Header / Navigation / Footer 전역화
8. R08 웹사이트 템플릿 시스템 추가

## AI 생성 구조 개선

9. R09 AI 생성 방식을 SiteData로 변경
10. R10 AI 생성 UI를 웹사이트 마법사로 개선

## 에디터 UX 개선

11. R11 Canvas 디자인 개선
12. R12 RightPanel을 Content / Design / AI 탭으로 개편

## Export / QA

13. R13 React 프로젝트 Export를 다중 페이지 사이트로 확장
14. R14 디자인 QA 체크리스트 추가

## Header / Element Builder 추가

15. R15 Element Node 시스템 추가
16. R16 Header Builder 추가
17. R17 Element Library 패널 추가
18. R18 Container / Layout Block 추가
19. R20 Element Properties Panel 추가
20. R19 Drag & Drop으로 요소 위치 변경
21. R21 Freeform Section 추가
22. R22 AI가 Header / Elements / Layout까지 생성하게 개선
23. R23 React Export에 Element Builder 구조 반영

---
