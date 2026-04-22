선택된 블록의 문구를 AI로 수정하는 기능을 추가해줘.

파일:
- src/app/api/ai/rewrite-block/route.ts
- src/lib/prompts/rewrite-block-prompt.ts
- src/components/editor/AIRewriteBlockButton.tsx
- RightPanel에 버튼 연결

요구사항:
입력:
{
  block: Block;
  pageContext: {
    title: string;
    industry?: string;
    goal?: string;
    tone?: string;
  };
  instruction: string;
}

예시 instruction:
- 더 고급스럽게 바꿔줘
- 더 짧게 만들어줘
- 전환율 높게 바꿔줘
- 친근한 말투로 바꿔줘

응답:
- 같은 block.type을 유지한 updated props
- block id와 type은 변경하지 않음
- Zod로 검증
- 성공 시 updateBlock 실행

UI:
- RightPanel에 "AI로 문구 다듬기" 영역 추가
- 빠른 버튼:
  - 더 짧게
  - 더 감성적으로
  - 더 전문적으로
  - CTA 강하게
- 직접 요청 textarea도 제공