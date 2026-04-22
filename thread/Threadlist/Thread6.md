랜딩페이지 빌더의 3단 에디터 UI를 만들어줘.

파일:
- src/app/editor/page.tsx
- src/components/editor/EditorLayout.tsx
- src/components/editor/LeftSidebar.tsx
- src/components/editor/CanvasArea.tsx
- src/components/editor/RightPanel.tsx
- src/components/editor/TopBar.tsx

레이아웃:
- 상단 TopBar
- 왼쪽 LeftSidebar: 블록 추가, 팔레트 선택
- 가운데 CanvasArea: 랜딩페이지 미리보기
- 오른쪽 RightPanel: 선택된 블록 속성 편집

요구사항:
TopBar:
- 서비스 이름
- Desktop / Tablet / Mobile 미리보기 토글
- 저장 버튼
- React 프로젝트 Export 버튼
- 발행 버튼 placeholder

LeftSidebar:
- 블록 추가 버튼 목록
- 기본 팔레트 목록
- 팔레트 클릭 시 theme 적용

CanvasArea:
- 현재 page.blocks 렌더링
- 블록 클릭 시 selectedBlockId 설정
- 선택된 블록은 테두리 표시
- previewMode에 따라 캔버스 너비 변경:
  desktop: 100%
  tablet: 768px
  mobile: 390px

RightPanel:
- 선택된 블록이 없으면 안내 문구 표시
- 선택된 블록이 있으면 기본 편집 UI 표시
- 우선 JSON textarea 방식으로 props 수정 가능하게 구현
- 나중에 폼 기반 편집으로 개선할 수 있게 구조화

작업 후:
- npm run lint
- npm run build