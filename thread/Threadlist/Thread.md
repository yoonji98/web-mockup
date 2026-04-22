Next.js 기반의 AI 랜딩페이지 빌더 프로젝트를 초기 세팅해줘.

요구사항:
- Next.js App Router 사용
- TypeScript 사용
- Tailwind CSS 사용
- ESLint 설정 유지
- src 디렉토리 구조 사용
- 기본 페이지는 /editor 로 이동할 수 있게 구성
- UI는 깔끔한 SaaS 대시보드 느낌으로 시작
- 아래 폴더 구조를 만들어줘:

src/
  app/
    page.tsx
    editor/
      page.tsx
    site/
      [slug]/
        page.tsx
    api/
  components/
    editor/
    blocks/
    common/
  data/
  lib/
  schemas/
  store/
  types/
  utils/

추가 패키지:
- zustand
- zod
- react-hook-form
- uuid
- clsx
- tailwind-merge

작업 후:
- npm run lint 실행
- npm run build 실행
- 문제가 있으면 수정


AI가 랜딩페이지 초안을 만들고,
사용자는 블록과 팔레트를 수정하고,
결제하면 공개 URL로 발행하거나,
독립 실행 가능한 React 프로젝트 ZIP으로 다운로드할 수 있는 서비스.