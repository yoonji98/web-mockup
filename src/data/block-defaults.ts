import { v4 as createId } from "uuid";

import type { ContainerNode, ElementNode, ElementTreeNode } from "@/types/elements";
import type { Block, BlockType } from "@/types/page";

type BlockDefaultMap = {
  [Type in BlockType]: Omit<Extract<Block, { type: Type }>, "id">;
};

export const blockDefaults = {
  hero: {
    type: "hero",
    variant: "split-image",
    props: {
      title: "고객이 바로 이해하는 랜딩페이지를 빠르게 만드세요",
      subtitle:
        "AI가 만든 PageData 초안을 바탕으로 블록, 카피, 색상 팔레트를 조정해 전환 중심 페이지를 완성합니다.",
      buttonText: "무료로 시작하기",
      secondaryButtonText: "샘플 페이지 보기",
      imagePrompt: "깔끔한 SaaS 대시보드와 랜딩페이지 편집 화면",
      align: "left",
    },
  },
  features: {
    type: "features",
    variant: "card-grid",
    props: {
      title: "랜딩페이지 제작 흐름을 단순하게",
      subtitle: "기획부터 미리보기, export까지 하나의 PageData 구조로 관리합니다.",
      items: [
        {
          title: "블록 기반 구성",
          description: "Hero, 소개, 가격, FAQ 같은 섹션을 필요한 순서대로 조합합니다.",
        },
        {
          title: "팔레트 시스템",
          description: "업종별 기본 팔레트와 커스텀 팔레트로 브랜드 톤을 빠르게 맞춥니다.",
        },
        {
          title: "독립 프로젝트 Export",
          description: "완성된 페이지를 Vite React 프로젝트 ZIP으로 내보낼 수 있게 준비합니다.",
        },
      ],
    },
  },
  about: {
    type: "about",
    variant: "story",
    props: {
      title: "브랜드의 차별점을 자연스럽게 설명하세요",
      subtitle: "고객이 선택해야 하는 이유를 짧고 명확한 이야기로 정리합니다.",
      body: "우리 서비스는 랜딩페이지 제작에 필요한 구조와 디자인 결정을 PageData JSON으로 관리합니다. AI는 검증 가능한 데이터만 생성하고, 사용자는 에디터에서 필요한 부분을 직접 조정할 수 있습니다.",
      imagePrompt: "팀이 랜딩페이지 성과 지표를 검토하는 밝은 업무 공간",
    },
  },
  testimonials: {
    type: "testimonials",
    variant: "quote-cards",
    props: {
      title: "먼저 사용한 팀의 반응",
      subtitle: "반복 제작 시간을 줄이고 더 많은 캠페인을 빠르게 검증했습니다.",
      items: [
        {
          quote: "초안 제작과 수정 속도가 빨라져 캠페인 실험 주기가 짧아졌습니다.",
          name: "김민준",
          role: "Growth Lead",
        },
        {
          quote: "디자인 톤을 팔레트로 관리하니 여러 페이지의 일관성을 유지하기 쉬웠습니다.",
          name: "이서연",
          role: "Brand Marketer",
        },
        {
          quote: "AI 결과가 JSON이라 검수와 export 흐름을 안정적으로 설계할 수 있었습니다.",
          name: "박지훈",
          role: "Product Manager",
        },
      ],
    },
  },
  pricing: {
    type: "pricing",
    variant: "simple-cards",
    props: {
      title: "팀 규모에 맞게 선택하세요",
      subtitle: "초기 검증부터 발행과 다운로드까지 필요한 기능을 단계적으로 제공합니다.",
      plans: [
        {
          name: "Starter",
          price: "₩29,000",
          description: "작은 캠페인과 초기 아이디어 검증에 적합합니다.",
          features: ["PageData 초안 생성", "기본 팔레트", "미리보기"],
          buttonText: "Starter 시작",
          highlighted: false,
        },
        {
          name: "Pro",
          price: "₩79,000",
          description: "여러 랜딩페이지를 제작하고 export해야 하는 팀에 적합합니다.",
          features: ["커스텀 팔레트", "공개 URL 발행", "Vite React ZIP export"],
          buttonText: "Pro 선택",
          highlighted: true,
        },
        {
          name: "Business",
          price: "문의",
          description: "브랜드 가이드와 승인 흐름이 필요한 조직을 위한 플랜입니다.",
          features: ["팀 워크스페이스", "브랜드 템플릿", "우선 지원"],
          buttonText: "문의하기",
          highlighted: false,
        },
      ],
    },
  },
  faq: {
    type: "faq",
    variant: "accordion",
    props: {
      title: "자주 묻는 질문",
      items: [
        {
          question: "AI는 어떤 결과물을 생성하나요?",
          answer: "React 코드가 아니라 PageData JSON만 생성합니다.",
        },
        {
          question: "색상 팔레트를 직접 만들 수 있나요?",
          answer: "기본 팔레트를 선택하거나 직접 커스텀 팔레트를 적용할 수 있습니다.",
        },
        {
          question: "완성된 페이지를 다운로드할 수 있나요?",
          answer: "나중에 결제 후 Vite React 프로젝트 ZIP으로 다운로드하는 기능을 연결할 예정입니다.",
        },
        {
          question: "공개 URL 발행도 가능한가요?",
          answer: "발행 기능은 결제 흐름과 함께 붙일 수 있도록 구조를 준비하고 있습니다.",
        },
      ],
    },
  },
  cta: {
    type: "cta",
    variant: "centered",
    props: {
      title: "지금 첫 랜딩페이지 초안을 만들어보세요",
      subtitle: "블록과 팔레트를 조합해 고객에게 보여줄 수 있는 페이지를 빠르게 완성합니다.",
      buttonText: "에디터에서 시작하기",
    },
  },
  footer: {
    type: "footer",
    variant: "simple",
    props: {
      brandName: "Landing Studio",
      description: "AI 기반 PageData 랜딩페이지 빌더",
      links: [
        {
          label: "Editor",
          href: "/editor",
        },
        {
          label: "Preview",
          href: "/site/demo",
        },
        {
          label: "Export",
          href: "#export",
        },
      ],
      copyright: "2026 Landing Studio. All rights reserved.",
    },
  },
  services: {
    type: "services",
    variant: "service-cards",
    props: {
      title: "필요한 제작 서비스를 한 번에",
      subtitle: "웹사이트 제작에 필요한 핵심 서비스를 선택해 빠르게 구성합니다.",
      items: [
        {
          title: "웹사이트 전략 설계",
          description: "목표 고객과 전환 흐름을 바탕으로 페이지 구조를 설계합니다.",
          price: "₩300,000부터",
          duration: "3일",
          buttonText: "상담하기",
        },
        {
          title: "브랜드형 페이지 제작",
          description: "업종에 맞는 카피와 섹션으로 신뢰감 있는 웹사이트를 만듭니다.",
          price: "₩800,000부터",
          duration: "1주",
          buttonText: "견적 보기",
        },
        {
          title: "전환 최적화",
          description: "CTA, 후기, FAQ를 정리해 문의와 예약 전환을 개선합니다.",
          price: "문의",
          duration: "맞춤",
          buttonText: "문의하기",
        },
      ],
    },
  },
  portfolio: {
    type: "portfolio",
    variant: "project-grid",
    props: {
      title: "대표 프로젝트",
      subtitle: "브랜드의 역량을 보여주는 주요 사례를 정리합니다.",
      projects: [
        {
          title: "SaaS 온보딩 개선",
          description: "첫 사용자의 핵심 행동 전환을 높인 제품 페이지 개편",
          category: "Product",
          imagePrompt: "SaaS onboarding dashboard",
        },
        {
          title: "로컬 브랜드 웹사이트",
          description: "매장 방문과 예약 문의를 연결하는 브랜드 사이트 구축",
          category: "Brand",
          imagePrompt: "local shop website",
        },
        {
          title: "클리닉 상담 페이지",
          description: "신뢰감 있는 의료 정보 구조와 상담 CTA 설계",
          category: "Clinic",
          imagePrompt: "clean clinic website",
        },
      ],
    },
  },
  contact: {
    type: "contact",
    variant: "split-info",
    props: {
      title: "상담을 시작해보세요",
      subtitle: "원하는 웹사이트 목표를 남겨주시면 적합한 구성으로 제안드립니다.",
      email: "hello@example.com",
      phone: "02-0000-0000",
      kakao: "카카오톡 상담",
      buttonText: "문의 보내기",
    },
  },
  customSection: {
    type: "customSection",
    variant: "content-stack",
    props: {
      title: "새 섹션",
      subtitle: "원하는 요소를 추가해 직접 구성하세요.",
      padding: "72px 24px",
    },
    containers: [
      {
        id: "custom-section-stack",
        type: "stack",
        layout: {
          direction: "vertical",
          gap: "16px",
        },
        style: {
          maxWidth: "960px",
          margin: "0 auto",
        },
        children: [
          {
            id: "custom-section-heading",
            type: "heading",
            props: {
              level: 2,
              text: "섹션 제목",
            },
          },
          {
            id: "custom-section-text",
            type: "text",
            props: {
              text: "본문을 추가하고 버튼, 이미지, 카드 같은 요소를 배치해보세요.",
            },
          },
        ],
      },
    ],
  },
  containerSection: {
    type: "containerSection",
    variant: "stack",
    props: {
      title: "컨테이너 섹션",
      subtitle: "Stack, Row, Grid, Columns로 안전하게 배치합니다.",
      padding: "72px 24px",
    },
    containers: [
      {
        id: "container-section-stack",
        type: "stack",
        layout: {
          direction: "vertical",
          gap: "20px",
        },
        style: {
          maxWidth: "1040px",
          margin: "0 auto",
        },
        children: [
          {
            id: "container-section-heading",
            type: "heading",
            props: {
              level: 2,
              text: "원하는 레이아웃으로 시작하세요",
            },
          },
          {
            id: "container-section-button",
            type: "button",
            props: {
              href: "#lead",
              label: "CTA 추가",
            },
          },
        ],
      },
    ],
  },
  gridSection: {
    type: "gridSection",
    variant: "three-column",
    props: {
      title: "그리드 섹션",
      subtitle: "카드나 기능 목록을 격자로 배치합니다.",
      padding: "72px 24px",
    },
    containers: [
      {
        id: "grid-section-grid",
        type: "grid",
        layout: {
          columns: 3,
          gap: "16px",
        },
        style: {
          maxWidth: "1120px",
          margin: "0 auto",
        },
        children: [
          {
            id: "grid-section-card-1",
            type: "card",
            props: {
              title: "첫 번째 카드",
              description: "핵심 장점을 짧게 설명합니다.",
            },
          },
          {
            id: "grid-section-card-2",
            type: "card",
            props: {
              title: "두 번째 카드",
              description: "고객이 비교하기 쉬운 정보를 넣습니다.",
            },
          },
          {
            id: "grid-section-card-3",
            type: "card",
            props: {
              title: "세 번째 카드",
              description: "전환을 돕는 근거를 추가합니다.",
            },
          },
        ],
      },
    ],
  },
  columnsSection: {
    type: "columnsSection",
    variant: "two-column",
    props: {
      title: "2단 섹션",
      subtitle: "텍스트와 이미지를 나란히 배치합니다.",
      padding: "72px 24px",
    },
    containers: [
      {
        id: "columns-section-row",
        type: "columns",
        layout: {
          columns: 2,
          gap: "32px",
        },
        style: {
          maxWidth: "1120px",
          margin: "0 auto",
        },
        children: [
          {
            id: "columns-section-copy",
            type: "card",
            props: {
              title: "왼쪽 콘텐츠",
              description: "설명, 버튼, 목록을 담는 영역입니다.",
            },
          },
          {
            id: "columns-section-image",
            type: "image",
            props: {
              alt: "섹션 이미지",
              label: "이미지 영역",
            },
          },
        ],
      },
    ],
  },
  freeformSection: {
    type: "freeformSection",
    variant: "desktop-canvas",
    props: {
      title: "자유 배치 섹션",
      subtitle: "고급 사용자용으로 x/y/w/h 값을 직접 조정할 수 있습니다.",
      height: "560px",
      layouts: [
        {
          breakpoint: "desktop",
          elementId: "freeform-heading",
          h: 96,
          w: 420,
          x: 80,
          y: 96,
          zIndex: 2,
        },
        {
          breakpoint: "desktop",
          elementId: "freeform-card",
          h: 220,
          w: 320,
          x: 560,
          y: 160,
          zIndex: 1,
        },
      ],
    },
    elements: [
      {
        id: "freeform-heading",
        type: "heading",
        props: {
          level: 2,
          text: "자유롭게 배치하는 히어로 메시지",
        },
        style: {
          maxWidth: "420px",
        },
      },
      {
        id: "freeform-card",
        type: "card",
        props: {
          title: "Freeform 카드",
          description: "위치와 크기를 직접 조정할 수 있습니다.",
        },
      },
    ],
  },
} satisfies BlockDefaultMap;

export function createDefaultBlock(type: BlockType): Block {
  return withFreshElementIds({
    id: createId(),
    ...structuredClone(blockDefaults[type]),
  } as Block);
}

function withFreshElementIds(block: Block): Block {
  const idMap = new Map<string, string>();
  const containers = block.containers?.map((container) => refreshContainer(container, idMap));
  const elements = block.elements?.map((element) => refreshElement(element, idMap));

  if (block.type === "freeformSection") {
    return {
      ...block,
      containers,
      elements,
      props: {
        ...block.props,
        layouts: block.props.layouts.map((layout) => ({
          ...layout,
          elementId: idMap.get(layout.elementId) ?? layout.elementId,
        })),
      },
    };
  }

  return {
    ...block,
    containers,
    elements,
  };
}

function refreshNode(node: ElementTreeNode, idMap: Map<string, string>): ElementTreeNode {
  return "children" in node ? refreshContainer(node, idMap) : refreshElement(node, idMap);
}

function refreshContainer(container: ContainerNode, idMap: Map<string, string>): ContainerNode {
  const nextId = createId();
  idMap.set(container.id, nextId);

  return {
    ...container,
    id: nextId,
    children: container.children.map((child) => refreshNode(child, idMap)),
  };
}

function refreshElement(element: ElementNode, idMap: Map<string, string>): ElementNode {
  const nextId = createId();
  idMap.set(element.id, nextId);

  return {
    ...element,
    id: nextId,
  };
}
