랜딩페이지 빌더의 핵심 데이터 타입과 Zod 스키마를 만들어줘.

파일 위치:
- src/types/page.ts
- src/schemas/page-schema.ts

요구사항:
1. PageData 타입 생성
2. Theme 타입 생성
3. Palette 타입 생성
4. Block 타입 생성
5. 지원할 블록 타입:
   - hero
   - features
   - about
   - testimonials
   - pricing
   - faq
   - cta
   - footer

각 블록은 다음 구조를 가져야 함:
{
  id: string;
  type: BlockType;
  props: ...
}

PageData 구조:
{
  id?: string;
  title: string;
  slug?: string;
  industry?: string;
  goal?: 'reservation' | 'lead' | 'purchase' | 'signup' | 'download';
  theme: {
    paletteId?: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      mutedText: string;
      accent: string;
    };
    fontFamily: string;
    radius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  blocks: Block[];
}

Zod 스키마도 동일하게 작성해줘.
AI 응답 검증과 export 검증에 사용할 예정이므로 strict하게 작성해줘.

작업 후:
- TypeScript 에러 없는지 확인
- npm run lint 실행