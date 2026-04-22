my-landing-page/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  src/
    main.tsx
    App.tsx
    data/page.json
    types/page.ts
    components/blocks/...
    styles/globals.css

    현재 에디터의 PageData를 독립 실행 가능한 Vite React 프로젝트 ZIP으로 export하는 기능을 만들어줘.

파일:
- src/app/api/export/react-project/route.ts
- src/lib/export/react-project-generator.ts
- src/lib/export/templates.ts
- src/components/editor/ExportReactProjectButton.tsx

요구사항:
API:
POST /api/export/react-project

입력:
{
  page: PageData;
  projectName: string;
}

응답:
- application/zip
- 다운로드 파일명: {projectName}.zip

ZIP 안에 포함될 React 프로젝트:
- Vite
- React
- TypeScript
- Tailwind CSS
- 독립 실행 가능해야 함

생성 파일:
- package.json
- index.html
- vite.config.ts
- tsconfig.json
- tsconfig.node.json
- tailwind.config.ts
- postcss.config.js
- src/main.tsx
- src/App.tsx
- src/data/page.json
- src/types/page.ts
- src/components/blocks/BlockRenderer.tsx
- src/components/blocks/HeroBlock.tsx
- src/components/blocks/FeaturesBlock.tsx
- src/components/blocks/AboutBlock.tsx
- src/components/blocks/TestimonialsBlock.tsx
- src/components/blocks/PricingBlock.tsx
- src/components/blocks/FaqBlock.tsx
- src/components/blocks/CtaBlock.tsx
- src/components/blocks/FooterBlock.tsx
- src/styles/globals.css
- README.md

README.md에는 아래 명령어 포함:
npm install
npm run dev
npm run build

중요:
- export된 프로젝트는 원래 빌더 서비스에 의존하면 안 됨
- page.json을 읽어서 App.tsx에서 렌더링해야 함
- Tailwind 설정 포함
- theme 색상 적용
- npm install 후 바로 실행 가능해야 함
- PageData는 Zod로 검증 후 export
- projectName은 파일명에 안전하게 sanitize

ZIP 생성 라이브러리:
- 서버에서 archiver 또는 jszip 사용
- Next.js route에서 binary response 반환

UI:
- TopBar의 "React 프로젝트 Export" 버튼과 연결
- 클릭 시 프로젝트 이름 입력
- API 호출 후 zip 다운로드
- loading 상태 표시
- 실패 시 에러 표시

작업 후:
- export zip을 직접 생성해보고 압축 해제
- npm install
- npm run build
- 문제 있으면 수정