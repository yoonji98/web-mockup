기존 Palette 시스템을 Style Pack 시스템으로 확장해줘.

기존 팔레트는 색상만 다루는데, 이제는 색상/폰트/레이아웃/버튼/카드/배경효과를 함께 다루는 StylePack이 필요하다.

파일:
- src/types/style.ts
- src/data/style-packs.ts
- src/store/editor-store.ts 수정
- src/components/editor/StylePackPanel.tsx 생성

StylePack 타입:
{
  id: string;
  name: string;
  description: string;
  moodTags: string[];
  recommendedFor: string[];
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    accent: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: 'medium' | 'semibold' | 'bold' | 'extrabold';
    bodySize: 'sm' | 'base' | 'lg';
  };
  layout: {
    maxWidth: 'narrow' | 'default' | 'wide';
    sectionPadding: 'compact' | 'comfortable' | 'spacious';
    contentDensity: 'compact' | 'normal' | 'airy';
  };
  shape: {
    radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    cardRadius: string;
    buttonRadius: string;
  };
  effects: {
    shadow: 'none' | 'soft' | 'medium' | 'bold';
    borderStyle: 'none' | 'subtle' | 'strong';
    backgroundStyle: 'flat' | 'gradient' | 'pattern' | 'mesh';
  };
  button: {
    style: 'solid' | 'outline' | 'soft' | 'gradient';
    size: 'sm' | 'md' | 'lg';
  };
}

기본 StylePack 10개 생성:
1. Soft Editorial - 감성/브랜드/플라워/카페
2. Clean SaaS - 스타트업/SaaS/앱
3. Luxury Minimal - 프리미엄/패션/뷰티
4. Warm Local - 소상공인/매장/공방
5. Medical Clean - 병원/클리닉/상담
6. Bold Creator - 크리에이터/강의/커뮤니티
7. Calm Wellness - 요가/건강/심리상담
8. Dark Premium - 고급/B2B/컨설팅
9. Playful Pop - 이벤트/키즈/프로모션
10. Mono Portfolio - 포트폴리오/개인 사이트

요구사항:
- StylePack 선택 시 현재 사이트 theme에 반영
- 기존 palette 선택 기능은 StylePack 내부 색상 선택으로 흡수
- Canvas와 PublishedPage에서 StylePack 기반 스타일 사용
- 사용자 커스텀 StylePack도 저장 가능하도록 구조 준비
- StylePackPanel에서 각 StylePack의 색상 preview, mood tag, 추천 용도를 보여줘
- 선택된 StylePack은 active 상태로 표시

작업 후:
- npm run lint
- npm run build
- 변경 요약 작성