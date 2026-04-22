# Task 08. Header Slot Builder 개선

현재 웹사이트 상단 Header를 더 쉽게 구성할 수 있게 Header Slot Builder를 개선해줘.

## 목표

Header는 left / center / right slot 구조를 가져야 한다.

기본 배치:

- Left: Logo
- Center: Menu
- Right: Login Button / CTA Button

## HeaderConfig 구조

HeaderConfig {
  variant: 'minimal' | 'centered' | 'cta-right' | 'transparent' | 'custom';
  sticky?: boolean;
  transparent?: boolean;
  height?: 'sm' | 'md' | 'lg';
  slots: {
    left: ElementNode[];
    center: ElementNode[];
    right: ElementNode[];
    mobile?: ElementNode[];
  };
}

## HeaderBuilderPanel 요구사항

1. left / center / right slot을 카드 3개로 표시
2. 각 slot 안에 현재 요소 표시
3. 요소 추가 버튼 제공
   - Logo
   - Menu
   - Login Button
   - Signup Button
   - CTA Button
   - Link
4. slot 안 요소 클릭 시 selectedElementId 설정
5. RightPanel에서 요소 수정 가능
6. sticky header 옵션
7. transparent header 옵션
8. mobile menu 자동 구성 옵션

## SiteHeader 요구사항

- slot 기반으로 렌더링
- left/center/right를 flex layout으로 배치
- mobile에서는 menu가 hamburger로 전환
- StylePack 반영
- Header가 비어 있으면 기본 Header 생성 버튼 제공

## UX 요구사항

- Header 설정은 복잡하지 않게 구성
- 비어 있는 slot에는 "여기에 요소 추가" 표시
- Logo/Menu/Button이 어떤 slot에 있는지 명확히 보여주기

## 하지 말 것

- Header drag/drop은 다음 task에서 처리
- AI 수정하지 말 것
- Export 수정하지 말 것

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성

----

# Task 09. Header Slot Drag & Drop 구현

현재 Header Slot Builder가 있다.
이번 작업에서는 Header의 left/center/right slot에 요소를 드래그해서 배치할 수 있게 해줘.

## 목표

사용자는 Header에 아래 요소를 원하는 slot에 배치할 수 있어야 한다.

- Logo
- Menu
- Login Button
- Signup Button
- CTA Button
- Link

## 지원 동작

1. Header slot 내부 순서 변경
2. Header slot 간 요소 이동
3. Elements 패널에서 Header slot으로 요소 드롭
4. Header 요소 클릭 후 RightPanel 수정

## 구현 요구사항

1. Header left/center/right slot을 droppable로 만들기
2. Header slot 내부 요소를 draggable로 만들기
3. Header slot 간 이동 가능
4. dragEnd에서 moveElementToHeaderSlot 실행
5. slot 내부 reorder 지원
6. 드롭 후 selectedElementId 유지

## Store 액션

- addElementToHeaderSlot(slot, elementType, index?)
- moveElementToHeaderSlot(elementId, targetSlot, index?)
- reorderHeaderSlotElements(slot, activeId, overId)

## UX 요구사항

- Header 편집 시 slot 영역이 시각적으로 보여야 함
- 비어 있는 slot에는 "여기에 요소 놓기" 표시
- drag 중 slot이 dashed border로 강조
- mobile menu는 Menu element 기준으로 자동 구성

## 하지 말 것

- Freeform 구현하지 말 것
- AI 수정하지 말 것
- Export 수정하지 말 것

## 테스트 시나리오

1. Logo가 left에 있음
2. Logo를 center로 이동
3. Header에서 Logo 위치가 변경됨
4. Menu를 center에서 left로 이동
5. Login Button을 right에 추가
6. RightPanel에서 label/href 수정 가능

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성


---
# Task 10. Smart Insert 버튼 추가

드래그앤드랍을 어려워하는 사용자를 위해 Smart Insert 버튼을 추가해줘.

## 목표

섹션 사이에 + 버튼을 표시하고, 사용자가 클릭으로 새 섹션이나 요소를 추가할 수 있게 한다.

## 위치

- 섹션 위
- 섹션 아래
- 빈 페이지 중앙
- container 내부 빈 상태

## 메뉴 항목

### Section
- Hero Section
- Text + Image Section
- Feature Cards
- Pricing
- FAQ
- Contact
- Blank Section

### Element
- Heading
- Text
- Button
- Image
- Card
- Form
- Divider
- Spacer

### AI
- AI 추천 섹션 추가

## 동작

- 섹션 항목 선택 시 해당 위치에 새 section 추가
- 요소 항목 선택 시 근처 container에 요소 추가
- 선택 위치가 없으면 새 containerSection 생성 후 요소 추가

## UX 요구사항

- + 버튼은 hover 시 자연스럽게 표시
- 메뉴는 command menu 또는 dropdown 스타일
- 자주 쓰는 항목을 상단에 표시
- 추가 후 새로 추가된 대상 자동 선택
- 안내 메시지 표시

## 하지 말 것

- AI 추천 실제 구현은 placeholder만 가능
- Freeform 구현하지 말 것
- Export 수정하지 말 것

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성


---

# Task 11. Undo / Redo 기능 추가

드래그앤드랍과 요소 편집에 Undo / Redo 기능을 추가해줘.

## 목표

사용자는 실수로 요소를 이동하거나 삭제해도 되돌릴 수 있어야 한다.

## 지원

- Ctrl+Z / Cmd+Z: undo
- Ctrl+Shift+Z / Cmd+Shift+Z: redo
- TopBar에 Undo / Redo 버튼 표시

## 적용 대상

- addElement
- removeElement
- updateElement
- reorderSections
- reorderElements
- moveElement
- addBlock
- removeBlock
- updateBlock
- applyStylePack
- updateHeader
- addPage
- removePage

## 구현 요구사항

1. editor-store에 history 추가
2. past / present / future 구조 사용
3. history size 제한: 50
4. undo/redo 시 selection도 최대한 복원
5. text input 변경은 debounce 또는 group 처리
6. AI 생성처럼 큰 변경은 하나의 history entry로 처리

## 주의

- localStorage 저장과 충돌하지 않게 하기
- 너무 잦은 updateElement로 history가 폭발하지 않게 하기
- undo 후 Canvas와 RightPanel 상태가 동기화되어야 함

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성

---

# Task 12. Breadcrumb와 Layer Tree 추가

사용자가 현재 선택한 요소의 위치를 쉽게 이해할 수 있게 Breadcrumb와 Layer Tree를 추가해줘.

## 목표

1. 선택한 요소가 어느 페이지/섹션/컨테이너 안에 있는지 보여준다.
2. Canvas에서 클릭하기 어려운 요소를 Layer Tree에서 선택할 수 있다.

## Breadcrumb 예시

Home > Hero Section > Left Column > Button

## Layer Tree 예시

Home
  Header
    Logo
    Menu
    CTA Button
  Hero
    Left Column
      Heading
      Text
      Button
    Right Column
      Image
  Features
    Card
    Card
    Card

## 구현 파일

- src/components/editor/SelectionBreadcrumb.tsx
- src/components/editor/LayerTreePanel.tsx

## 요구사항

1. SelectionBreadcrumb 생성
2. LayerTreePanel 생성
3. LeftSidebar에 Layers 탭 추가
4. Layer item 클릭 시 해당 block/container/element 선택
5. 선택된 item active 표시
6. 접기/펼치기 지원
7. element type별 아이콘 표시
8. Header / Page / Section / Container / Element 구분 표시

## 추가 기능

- 삭제 버튼은 optional
- 복제 버튼은 optional
- 숨김 버튼은 placeholder 가능

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성