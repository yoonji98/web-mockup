에디터에서 AI 랜딩페이지 생성을 요청할 수 있는 UI를 만들어줘.

파일:
- src/components/editor/AIGeneratePanel.tsx
- src/components/editor/LeftSidebar.tsx 또는 TopBar에 연결

요구사항:
폼 입력:
- 브랜드명
- 업종
- 타겟 고객
- 목적
  - 예약 받기
  - 문의 받기
  - 상품 판매
  - 회원가입
  - 앱 다운로드
- 분위기
  - 감성적인
  - 미니멀한
  - 고급스러운
  - 귀여운
  - 전문적인
  - 트렌디한
- 색상 취향

동작:
- "AI로 생성하기" 클릭
- /api/ai/generate-page 호출
- loading 상태 표시
- 성공하면 setPage로 에디터에 반영
- 실패하면 사용자에게 에러 메시지 표시
- 기존 작업이 있으면 덮어쓰기 확인 confirm 표시