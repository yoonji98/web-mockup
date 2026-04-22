생성되는 사이트가 더 예쁘게 보이도록 모든 블록 컴포넌트의 디자인을 개선해줘.

공통 디자인 규칙:
- section padding은 넉넉하게
- max-width는 stylePack.layout.maxWidth 반영
- h1/h2 font-size는 더 크게
- subtitle은 mutedText 사용
- 카드에는 subtle border와 soft shadow 사용
- 버튼은 stylePack.button 반영
- 배경은 stylePack.effects.backgroundStyle 반영
- rounded는 stylePack.shape 반영
- 모바일에서 여백이 너무 크지 않게 조정

Hero:
- 큰 타이포그래피
- CTA 2개 지원
- badge/eyebrow 지원
- imagePrompt가 있으면 고급스러운 placeholder 카드 표시
- gradient background variant 추가
- split-image variant는 데스크탑에서 2단 레이아웃, 모바일에서 세로 레이아웃

Features:
- icon placeholder 추가
- bento layout variant 추가
- hover lift 효과
- 카드형, 번호형, 리스트형 variant 차이를 명확히 표현

About:
- stats 3개 표시 가능
- image placeholder를 더 예쁘게
- 긴 문단은 max-width 제한
- image-left / image-right / story variant 구분

Services:
- 서비스 카드 블록 추가
- 가격/소요시간/설명/CTA 표시 가능
- 소상공인/병원/교육 사이트에도 어울리게 구성

Portfolio:
- 프로젝트 카드 블록 추가
- 이미지 placeholder와 category badge 표시
- masonry나 grid 느낌을 낼 수 있게 구성

Contact:
- 폼 UI 개선
- 연락처 카드
- 카카오톡/이메일/전화 CTA 지원
- split-info, booking-cta variant 지원

CTA:
- centered, split, banner, gradient variant를 확실히 다르게 표현
- primary CTA가 명확하게 보이게 개선

FAQ:
- accordion 스타일 또는 two-column 스타일 지원
- 질문/답변 위계 명확히 표현

Footer:
- simple, columns, brand-heavy, newsletter 스타일 지원

작업 후:
- 기본 생성 사이트가 템플릿 마켓 수준까지는 아니어도, 깔끔한 SaaS/브랜드 사이트처럼 보여야 함
- npm run lint
- npm run build
- 변경 요약 작성