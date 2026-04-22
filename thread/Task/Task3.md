현재 블록 디자인이 단조롭다.
각 블록에 variant를 추가해서 같은 콘텐츠라도 다른 디자인으로 렌더링되게 해줘.

Block 구조 변경:
{
  id: string;
  type: BlockType;
  variant: string;
  props: ...
}

지원 variant:

hero:
- centered
- split-image
- editorial
- saas-gradient
- minimal
- luxury

features:
- icon-grid
- card-grid
- bento
- alternating
- numbered-list

about:
- story
- image-left
- image-right
- stats-focused
- timeline

services:
- service-cards
- detailed-list
- category-grid

testimonials:
- quote-cards
- wall
- featured

pricing:
- simple-cards
- comparison
- highlighted-plan

faq:
- accordion
- two-column
- minimal-list

cta:
- centered
- split
- banner
- gradient

contact:
- simple-form
- split-info
- booking-cta

작업:
1. Block 타입과 schema에 variant 추가
2. block-defaults에 기본 variant 설정
3. BlockRenderer에서 type + variant 기반 렌더링
4. 각 블록 컴포넌트 내부에서 variant별 layout 변경
5. RightPanel에서 variant 선택 가능
6. 기존 block은 migration으로 기본 variant 부여

중요:
- 디자인 품질을 높이는 것이 목표
- 모든 variant가 완전히 다를 필요는 없지만, 최소한 레이아웃/배경/카드 스타일 차이가 있어야 함
- 모바일 반응형 필수
- StylePack의 colors, spacing, radius, shadow를 최대한 반영
- 기존 저장 데이터가 깨지지 않도록 fallback variant를 제공

작업 후:
- npm run lint
- npm run build
- 변경 요약 작성