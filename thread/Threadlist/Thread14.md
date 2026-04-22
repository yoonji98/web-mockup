저장된 PageData를 공개 랜딩페이지처럼 렌더링하는 /site/[slug] 페이지를 만들어줘.

파일:
- src/app/site/[slug]/page.tsx
- src/lib/published-projects.ts

현재는 DB 없이 localStorage를 서버에서 읽을 수 없으므로, 임시 mock published data를 사용해줘.
나중에 DB 연결하기 쉽게 구조화해줘.

요구사항:
- PublishedPage 컴포넌트 생성
- PageData를 받아서 BlockRenderer로 렌더링
- editor UI 없이 순수 랜딩페이지처럼 보여야 함
- SEO metadata 생성 구조 추가
- slug 없으면 notFound 처리
- theme 반영
- 모바일 반응형