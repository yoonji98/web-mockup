AI로 랜딩페이지 PageData JSON을 생성하는 API route를 만들어줘.

파일:
- src/app/api/ai/generate-page/route.ts
- src/lib/ai.ts
- src/lib/prompts/generate-page-prompt.ts

요구사항:
- OpenAI API 또는 Vercel AI SDK 사용 가능한 구조로 작성
- 환경변수 OPENAI_API_KEY 사용
- 클라이언트에서 API key가 노출되지 않게 서버 route에서만 호출
- page-schema.ts의 Zod 스키마로 응답 검증
- AI는 React 코드나 HTML을 만들면 안 됨
- AI는 반드시 PageData JSON만 생성해야 함
- 지원 block type만 사용해야 함
- 한국어 카피 생성
- 사용 가능한 팔레트 목록을 prompt에 포함
- 입력값:
  {
    businessName: string;
    industry: string;
    targetAudience: string;
    goal: string;
    tone: string;
    palettePreference?: string;
  }

응답:
- 검증된 PageData

에러 처리:
- API key 없을 때 명확한 에러 반환
- AI 응답 검증 실패 시 400 또는 500 반환
- 로그에는 민감정보 남기지 않기