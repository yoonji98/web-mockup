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