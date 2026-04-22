각 랜딩페이지 블록의 기본값을 만들어줘.

파일:
- src/data/block-defaults.ts

지원 블록:
- hero
- features
- about
- testimonials
- pricing
- faq
- cta
- footer

요구사항:
createDefaultBlock(type: BlockType): Block 함수를 export해줘.
각 블록은 사용자가 바로 볼 수 있는 자연스러운 한국어 기본 문구를 가져야 함.

예:
hero:
- title
- subtitle
- buttonText
- secondaryButtonText
- imagePrompt
- align

features:
- title
- subtitle
- items 배열 3개

pricing:
- title
- plans 배열 3개

faq:
- items 배열 4개

footer:
- brandName
- links
- copyright

모든 블록 props는 page-schema.ts의 Zod 스키마와 맞아야 함.