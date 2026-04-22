사용자가 직접 색상 팔레트를 만들고 적용할 수 있는 기능을 추가해줘.

파일:
- src/components/editor/PalettePanel.tsx
- src/store/editor-store.ts 필요한 수정
- src/types/page.ts 필요한 수정

요구사항:
- 기본 팔레트 목록 표시
- 사용자 커스텀 팔레트 생성 버튼
- 색상 입력 필드:
  - primary
  - secondary
  - background
  - surface
  - text
  - mutedText
  - accent
- 팔레트 이름 입력
- 저장 시 localStorage에 저장
- localStorage key: "ai-landing-builder-custom-palettes"
- 저장한 팔레트를 다시 선택 가능
- 삭제 가능
- 선택 시 현재 page.theme.colors에 반영
- HEX 형식 검증