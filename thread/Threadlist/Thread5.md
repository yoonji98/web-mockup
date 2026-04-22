PageData.blocks를 화면에 렌더링하는 BlockRenderer와 각 블록 컴포넌트를 만들어줘.

파일:
- src/components/blocks/BlockRenderer.tsx
- src/components/blocks/HeroBlock.tsx
- src/components/blocks/FeaturesBlock.tsx
- src/components/blocks/AboutBlock.tsx
- src/components/blocks/TestimonialsBlock.tsx
- src/components/blocks/PricingBlock.tsx
- src/components/blocks/FaqBlock.tsx
- src/components/blocks/CtaBlock.tsx
- src/components/blocks/FooterBlock.tsx

요구사항:
- 모든 컴포넌트는 TypeScript props 타입을 명확히 작성
- theme colors를 받아서 스타일에 반영
- Tailwind CSS 사용
- inline style은 theme 색상 적용에 필요한 최소한만 사용
- 반응형 디자인 적용
- mobile에서도 예쁘게 보여야 함
- 각 섹션은 충분한 padding을 가짐
- CTA 버튼은 primary 색상 사용
- 카드 배경은 surface 색상 사용
- 텍스트는 theme.colors.text와 mutedText 사용

BlockRenderer 요구사항:
- block.type에 따라 올바른 컴포넌트 렌더링
- 알 수 없는 block.type이면 null 반환