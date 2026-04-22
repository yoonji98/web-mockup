# AI Website Builder

Next.js App Router, React, TypeScript, Tailwind 기반의 AI 웹사이트 빌더 프로토타입이다.

## Development

```bash
npm install
npm run dev
```

## Build Checks

```bash
npm run lint
npm run build
```

## Architecture Notes

- AI는 React 코드가 아니라 `SiteData` JSON만 생성한다.
- `SiteData`는 brand, theme, navigation, pages, globalSections, seo를 포함한다.
- 기존 `PageData`는 migration helper를 통해 `SiteData`로 변환된다.
- 에디터는 현재 선택된 `currentPageId` 기준으로 Canvas를 렌더링한다.
- export는 다중 페이지 Vite React 프로젝트 ZIP을 생성하고 `site.json`을 포함한다.

## Design QA

- 블록 컴포넌트를 수정할 때 [docs/design-qa.md](docs/design-qa.md)를 기준으로 확인한다.
- 새 StylePack을 추가할 때 contrast와 responsive 상태를 확인한다.
- 새 Block Variant를 추가할 때 mobile layout을 반드시 확인한다.
# web-mockup
