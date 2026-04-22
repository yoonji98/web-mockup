랜딩페이지뿐 아니라 여러 페이지짜리 웹사이트를 만들 수 있게 페이지 관리 UI를 추가해줘.

파일:
- src/components/editor/PagesPanel.tsx
- src/components/editor/PageCreateDialog.tsx
- LeftSidebar 수정

요구사항:
1. LeftSidebar 상단에 Pages 탭 추가
2. 현재 사이트의 pages 목록 표시
3. 페이지 클릭 시 currentPage 변경
4. 페이지 추가 가능
5. 페이지 삭제 가능
6. 페이지 복제 가능
7. 페이지 title/slug 수정 가능
8. page type 선택 가능:
   - Home
   - Landing
   - About
   - Services
   - Portfolio
   - Pricing
   - Contact
   - Blog
   - Product
   - Custom

UX:
- 현재 페이지는 active 상태 표시
- Home page는 삭제 방지
- slug 중복 방지
- 페이지 추가 시 기본 블록 자동 생성 옵션 제공
- 페이지 목록은 깔끔한 카드/리스트 형태로 표시
- 페이지별 아이콘을 lucide-react로 표시
- 페이지 slug가 잘못되면 에러 표시

작업 후:
- Canvas는 currentPage.blocks만 렌더링
- TopBar에 현재 페이지명 표시
- npm run lint
- npm run build
- 변경 요약 작성