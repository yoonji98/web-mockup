랜딩페이지 발행 기능 1차 버전을 구현해줘.

현재는 DB 없이 localStorage 기반으로 구현하되, 나중에 DB로 옮기기 쉽게 service layer를 분리해줘.

요구사항:
- TopBar에 "발행하기" 버튼 추가
- 클릭 시 slug 입력 모달 표시
- slug는 영문 소문자, 숫자, 하이픈만 허용
- 발행하면 publishedProjects localStorage에 저장
- 발행 완료 후 /site/[slug] 링크 표시
- /site/[slug] 페이지에서 해당 slug의 PageData를 렌더링

주의:
Next.js 서버 컴포넌트에서는 localStorage 접근이 안 되므로,
1차 구현은 client-side published page로 구성하거나,
mock adapter 구조로 구현해줘.

향후 DB로 전환하기 쉽게:
- src/lib/project-repository.ts
- getPublishedProjectBySlug
- publishProject
함수 인터페이스를 만들어줘.