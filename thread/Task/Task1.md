현재 AI 랜딩페이지 빌더의 디자인이 너무 단조롭다.
전체 UI와 생성되는 웹사이트의 디자인 품질을 높이기 위해 디자인 시스템을 도입해줘.

목표:
- 에디터 UI를 깔끔한 SaaS 제품처럼 개선
- 생성되는 랜딩페이지/웹사이트 블록 디자인을 더 고급스럽게 개선
- 팔레트 중심이 아니라 Style Pack 중심으로 확장할 수 있게 기반을 만든다

작업:
1. shadcn/ui 스타일의 컴포넌트 기반 UI 시스템을 도입해줘.
2. 공통 UI 컴포넌트를 만들어줘:
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
8. 기존 UI를 이 공통 컴포넌트 기반으로 교체해줘.

디자인 톤:
- 깔끔한 SaaS
- 넉넉한 spacing
- 부드러운 radius
- 얇은 border
- 과하지 않은 shadow
- hover 상태 명확함
- 전반적으로 깔끔하고 현대적인 웹앱 느낌

중요:
- 기존 기능은 깨지지 않아야 함
- 기존 editor store와 block renderer는 유지
- UI만 개선하되 구조 확장에 방해되지 않게 작성

작업 후:
- npm run lint 실행
- npm run build 실행
- 문제가 있으면 수정
- 변경 요약 작성