CanvasArea의 디자인을 개선해줘.

문제:
현재 Canvas가 단순 preview처럼 보여서 제품 완성도가 낮아 보인다.

개선:
1. Canvas 배경을 연한 checker/grid 또는 gray background로 변경
2. preview frame을 흰색 카드처럼 표시
3. frame에 shadow, rounded border 적용
4. Desktop/Tablet/Mobile 토글을 더 예쁘게
5. mobile preview는 실제 기기 프레임 느낌으로 표시
6. 선택된 블록은 과한 파란 테두리 대신 subtle ring + floating toolbar 표시

Floating toolbar:
- 위로
- 아래로
- 복제
- 삭제
- Variant 변경
- AI 수정

요구사항:
- hover 시 섹션 경계가 부드럽게 보이게
- selected 상태와 hover 상태 구분
- preview mode 변경 시 width transition 적용
- Canvas frame은 중앙 정렬
- desktop/tablet/mobile 각각 자연스러운 너비 적용
- toolbar는 선택된 블록 위쪽 또는 오른쪽에 floating 형태로 표시
- toolbar 버튼은 아이콘 + tooltip 사용

작업 후:
- 기존 block selection 기능 유지
- npm run lint
- npm run build
- 변경 요약 작성