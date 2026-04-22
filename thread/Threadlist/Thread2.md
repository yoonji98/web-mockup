랜딩페이지 빌더에서 사용할 기본 색상 팔레트 데이터를 만들어줘.

파일:
- src/data/palettes.ts

요구사항:
Palette 타입은 src/types/page.ts의 타입을 사용해줘.

기본 팔레트 13개를 만들어줘:
1. Soft Rose - 감성/뷰티/플라워
2. Modern Blue - SaaS/테크/전문성
3. Warm Beige - 카페/라이프스타일
4. Minimal Black - 프리미엄/패션
5. Fresh Green - 건강/요가/친환경
6. Luxury Gold - 고급/브랜드/컨설팅
7. Playful Purple - 크리에이터/앱/교육
8. Clean Sky - 병원/클리닉/전문 서비스
9. Coral Pop - 이벤트/프로모션
10. Deep Navy - 금융/법률/B2B
11. Cream Brown - 베이커리/카페/공방
12. Mono Gray - 포트폴리오/미니멀
13. Simple white - 공공기관용

각 팔레트는 다음 필드를 가져야 함:
- id
- name
- description
- moodTags
- colors.primary
- colors.secondary
- colors.background
- colors.surface
- colors.text
- colors.mutedText
- colors.accent

색상은 모두 HEX 형식으로 작성.
가독성을 고려해서 background와 text 대비가 충분히 나도록 해줘.