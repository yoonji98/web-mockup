AI가 업종/분위기에 맞는 팔레트를 추천하거나 커스텀 팔레트를 생성하는 기능을 추가해줘.

파일:
- src/app/api/ai/suggest-palette/route.ts
- src/lib/prompts/suggest-palette-prompt.ts
- src/components/editor/AIPaletteSuggestButton.tsx

요구사항:
입력:
{
  industry: string;
  tone: string;
  targetAudience?: string;
  currentPage?: PageData;
}

응답:
{
  mode: 'system' | 'custom';
  paletteId?: string;
  customPalette?: Palette;
  reason: string;
}

규칙:
- 가능하면 src/data/palettes.ts의 system palette 중 하나를 추천
- 꼭 필요할 때만 customPalette 생성
- customPalette 색상은 HEX
- background와 text 대비 고려
- primary는 CTA 버튼에 적합해야 함

UI:
- PalettePanel에 "AI 추천" 버튼 추가
- 추천 결과 reason 표시
- 적용하기 버튼