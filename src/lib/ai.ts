type OpenAIResponseContent = {
  text?: unknown;
  type?: unknown;
};

type OpenAIResponseOutput = {
  content?: unknown;
  type?: unknown;
};

type OpenAIResponseBody = {
  error?: {
    message?: string;
  };
  output?: unknown;
  output_text?: unknown;
};

export class MissingOpenAIKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY 환경변수가 설정되어 있지 않습니다.");
    this.name = "MissingOpenAIKeyError";
  }
}

export class AIResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIResponseError";
  }
}

export async function generateJsonWithOpenAI(input: {
  instructions: string;
  prompt: string;
  maxOutputTokens?: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new MissingOpenAIKeyError();
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: input.prompt,
      instructions: input.instructions,
      max_output_tokens: input.maxOutputTokens ?? 4000,
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      store: false,
      text: {
        format: {
          type: "json_object",
        },
      },
    }),
  });

  const body = (await response.json()) as OpenAIResponseBody;

  if (!response.ok) {
    throw new AIResponseError(body.error?.message ?? "OpenAI API 호출에 실패했습니다.");
  }

  const text = extractResponseText(body);

  if (!text) {
    throw new AIResponseError("OpenAI 응답에서 JSON 텍스트를 찾을 수 없습니다.");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AIResponseError("OpenAI 응답이 유효한 JSON이 아닙니다.");
  }
}

function extractResponseText(body: OpenAIResponseBody) {
  if (typeof body.output_text === "string") {
    return body.output_text;
  }

  if (!Array.isArray(body.output)) {
    return null;
  }

  for (const output of body.output as OpenAIResponseOutput[]) {
    if (!Array.isArray(output.content)) {
      continue;
    }

    for (const content of output.content as OpenAIResponseContent[]) {
      if (
        (content.type === "output_text" || content.type === "text") &&
        typeof content.text === "string"
      ) {
        return content.text;
      }
    }
  }

  return null;
}
