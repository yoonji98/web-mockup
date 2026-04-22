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

그리고 README에 다음 내용을 추가해줘:
- 블록 컴포넌트를 수정할 때 docs/design-qa.md를 기준으로 확인할 것
- 새 StylePack을 추가할 때 contrast와 responsive를 확인할 것
- 새 Block Variant를 추가할 때 mobile layout을 반드시 확인할 것

작업 후:
- 문서 추가
- README 업데이트
- 변경 요약 작성