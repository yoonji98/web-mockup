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
src/
  main.tsx
  App.tsx
  data/site.json
  types/site.ts
  components/site/SiteRenderer.tsx
  components/site/SiteHeader.tsx
  components/site/SiteFooter.tsx
  components/blocks/BlockRenderer.tsx
  components/blocks/HeroBlock.tsx
  components/blocks/FeaturesBlock.tsx
  components/blocks/AboutBlock.tsx
  components/blocks/ServicesBlock.tsx
  components/blocks/PortfolioBlock.tsx
  components/blocks/TestimonialsBlock.tsx
  components/blocks/PricingBlock.tsx
  components/blocks/FaqBlock.tsx
  components/blocks/CtaBlock.tsx
  components/blocks/ContactBlock.tsx
  styles/globals.css

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