일반 웹사이트를 만들기 위해 Header, Navigation, Footer를 전역 섹션으로 분리해줘.

작업:
1. HeaderBlock을 일반 block이 아니라 global header로 렌더링
2. FooterBlock도 global footer로 렌더링 가능하게 변경
3. SiteData.navigation.items를 기반으로 Header 렌더링
4. Header variant 지원:
   - minimal
   - centered
   - cta-right
   - transparent
5. Footer variant 지원:
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