# Design QA Checklist

AI 웹사이트 빌더의 에디터 UI, 블록 컴포넌트, StylePack, export 결과를 점검할 때 사용한다.

## Typography

- H1은 데스크톱에서 48px 이상, 모바일에서 36px 전후로 읽기 쉬운가.
- H2는 섹션 간 위계를 만들 만큼 충분히 크고 일관적인가.
- 본문 line-height는 긴 문장에서도 답답하지 않은가.
- muted text 색상은 배경과 충분한 대비를 유지하는가.
- heading/body font 조합이 StylePack의 톤과 맞는가.

## Spacing

- section padding이 mobile/desktop에서 모두 자연스러운가.
- card padding이 콘텐츠 양에 비해 좁거나 과하지 않은가.
- grid gap이 카드 간 구분을 충분히 만드는가.
- 모바일에서 상하 간격이 너무 촘촘하지 않은가.
- 데스크톱에서 콘텐츠 max-width가 너무 넓게 풀리지 않는가.

## Visual Hierarchy

- 주요 CTA가 첫 화면과 전환 섹션에서 분명히 보이는가.
- 제목, 설명, 보조 텍스트 구분이 명확한가.
- 섹션마다 핵심 메시지가 3초 안에 파악되는가.
- 카드 간 우선순위가 색상, border, shadow로 자연스럽게 드러나는가.

## Responsive

- 모바일에서 horizontal overflow가 없는가.
- 버튼 터치 영역이 너무 작지 않은가.
- 2~3열 grid가 모바일에서 1열로 자연스럽게 바뀌는가.
- header navigation이 모바일에서 메뉴 형태로 동작하는가.

## Style Consistency

- radius가 StylePack의 shape 설정과 일관적인가.
- shadow가 effects 설정과 일관적인가.
- border 색상과 두께가 섹션/카드 전반에서 맞는가.
- button 스타일이 primary/secondary CTA 간 역할을 분명히 나누는가.
- card 스타일이 페이지 전체에서 같은 제품처럼 보이는가.

## Generated Site Quality

- 첫 화면이 업종과 목적에 맞게 매력적인가.
- 문구가 업종과 타겟 고객에게 맞는가.
- 페이지 구성이 Home/About/Services/Contact 등 자연스러운 흐름인가.
- CTA가 예약, 문의, 구매, 가입 등 목표와 맞는가.
- 불필요하게 긴 문장이 없는가.

## Export Quality

- export된 React 프로젝트가 `npm run build`를 통과하는가.
- navigation 링크가 다중 페이지 라우팅과 맞는가.
- `/`, `/about`, `/services`, `/contact` 같은 route가 동작하는가.
- StylePack 색상, radius, shadow, spacing이 export 결과에도 반영되는가.
