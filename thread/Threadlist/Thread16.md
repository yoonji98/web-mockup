React 프로젝트 export 결과물의 코드 품질을 개선해줘.

요구사항:
1. export된 React 프로젝트의 컴포넌트 파일이 읽기 쉬워야 함
2. 모든 컴포넌트에 타입 정의 포함
3. page.json만 수정해도 화면이 바뀌는 구조 유지
4. README에 구조 설명 추가
5. export된 프로젝트에서 불필요한 에디터 관련 코드는 포함하지 않기
6. 빌더 내부 store, editor UI, AI API 코드는 포함하지 않기
7. 컴포넌트는 순수 렌더링 전용
8. npm run build 통과해야 함

추가:
- package.json scripts:
  - dev
  - build
  - preview
  - lint

가능하면 export된 프로젝트에 eslint 설정도 포함.