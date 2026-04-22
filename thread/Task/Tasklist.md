# Task 01. 현재 웹사이트 빌더 구조 감사

현재 프로젝트는 AI Website Builder 프로토타입이다.
기능이 일부 구현되어 있지만, 사용자가 원하는 위치에 요소를 배치하는 UX가 부족하다.

이번 작업에서는 코드를 수정하지 말고 현재 구조를 감사해줘.

## 목표

아래 기능들이 실제로 구현되어 있는지 확인한다.

1. SiteData 구조
2. PageData → SiteData migration
3. PagesPanel
4. StylePack
5. Block Variant
6. Element Library
7. ElementRenderer
8. ContainerRenderer
9. HeaderBuilderPanel
10. SiteHeader slot 구조
11. RightPanel element editing
12. Drag & Drop 관련 코드
13. React export 구조

## 확인할 파일

- src/types
- src/schemas
- src/store/editor-store.ts
- src/components/editor/LeftSidebar.tsx
- src/components/editor/ElementLibraryPanel.tsx
- src/components/editor/HeaderBuilderPanel.tsx
- src/components/editor/RightPanel.tsx
- src/components/editor/ElementPropertiesPanel.tsx
- src/components/elements
- src/components/layout
- src/components/site
- src/components/blocks
- src/lib/export
- src/data

## 보고 형식

아래 형식으로 보고해줘.

### 정상 연결됨
- ...

### 파일은 있지만 UI에 연결 안 됨
- ...

### 타입은 있지만 renderer/store에 연결 안 됨
- ...

### 아예 없음
- ...

### 가장 먼저 고쳐야 할 것 TOP 5
1. ...
2. ...
3. ...
4. ...
5. ...

### 추천 수정 순서
1. ...
2. ...
3. ...

## 절대 하지 말 것

- 코드 수정하지 말 것
- 새 파일 만들지 말 것
- 리팩토링하지 말 것
- 삭제하지 말 것

이번 task는 감사 보고만 작성해줘.


---

# Task 02. 선택 상태와 LocationRef 구조 정리

현재 사용자가 원하는 위치에 요소를 배치하려면 selection과 location 구조가 명확해야 한다.

이번 작업에서는 드래그앤드랍과 요소 추가의 기반이 되는 선택 상태와 LocationRef 타입을 정리해줘.

## 목표

아래 선택 상태를 editor-store에서 명확히 관리한다.

- selectedBlockId
- selectedContainerId
- selectedElementId
- selectedHeaderSlot
- currentPageId

## 추가할 타입

LocationRef 타입을 추가해줘.

type LocationRef =
  | { type: 'page'; pageId: string }
  | { type: 'section'; pageId: string; sectionId: string }
  | { type: 'container'; pageId: string; sectionId: string; containerId: string }
  | { type: 'headerSlot'; slot: 'left' | 'center' | 'right' | 'mobile' };

## Store 액션

아래 액션을 추가하거나 정리해줘.

- selectBlock(blockId: string | null)
- selectContainer(containerId: string | null)
- selectElement(elementId: string | null)
- setSelectedHeaderSlot(slot: 'left' | 'center' | 'right' | 'mobile' | null)
- clearSelection()
- getSelectedLocation()
- findElementLocation(elementId)
- findContainerLocation(containerId)

## 선택 우선순위

선택 우선순위는 아래처럼 해줘.

1. selectedElementId
2. selectedContainerId
3. selectedBlockId
4. selectedHeaderSlot
5. none

Element를 선택하면 block/container 선택은 필요하면 유지하되, RightPanel에서는 element가 우선되어야 한다.

## 요구사항

- 타입 안전하게 작성
- any 최소화
- existing store 구조를 크게 깨지 않기
- 기존 block selection이 깨지지 않게 하기
- RightPanel에서 선택 우선순위가 반영되도록 준비

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성

---

# Task 03. 클릭으로 요소 추가 UX 완성

현재 목표는 Drag & Drop 전에 클릭 추가 UX를 완성하는 것이다.

사용자는 왼쪽 Elements 패널에서 Text/Button/Image/Card/Form 등을 클릭해서 Canvas에 바로 추가할 수 있어야 한다.

## 목표

1. 왼쪽 메뉴에 Elements 탭 표시
2. Elements 탭에서 요소 카드 표시
3. 요소 클릭 시 현재 선택 위치에 추가
4. 선택 위치가 없으면 새 containerSection 자동 생성
5. 추가된 요소는 Canvas에 즉시 표시
6. 추가된 요소는 자동 선택됨
7. RightPanel에서 바로 수정 가능

## Elements 탭 구성

### Basic
- Heading
- Text
- Button
- Image

### Brand
- Logo
- Menu
- Login Button
- Signup Button

### Content
- Card
- Form
- Divider
- Spacer

## Store 액션

아래 액션을 추가하거나 정리해줘.

- addElementToSelectedTarget(elementType)
- addElementToContainer(containerId, elementType, index?)
- addElementToHeaderSlot(slot, elementType, index?)
- createContainerSectionWithElement(elementType, insertPosition?)
- updateElement(elementId, updates)
- removeElement(elementId)

## addElementToSelectedTarget 동작

우선순위:

1. selectedHeaderSlot이 있으면 해당 header slot에 추가
2. selectedContainerId가 있으면 해당 container에 추가
3. selectedBlockId가 있고 block 안에 container가 있으면 첫 번째 container에 추가
4. 아무 선택 대상이 없으면 현재 페이지 맨 아래에 containerSection을 만들고 그 안에 추가

## element-defaults

createDefaultElement(type)을 만들어줘.

기본값:

heading:
- text: "새로운 제목"
- level: "h2"

text:
- text: "여기에 설명 문구를 입력하세요."

button:
- label: "버튼"
- href: "#"
- variant: "primary"

image:
- src: ""
- alt: "이미지"
- placeholderText: "이미지 영역"

logo:
- logoType: "text"
- text: "Brand"
- href: "/"

menu:
- items:
  - Home /
  - About /about
  - Contact /contact

card:
- title
- description
- buttonLabel

form:
- fields
- submitLabel

## Renderer 요구사항

- ContainerRenderer는 children을 ElementRenderer로 렌더링
- ElementRenderer는 heading/text/button/image/logo/menu/card/form/divider/spacer 지원
- Element 클릭 시 selectedElementId 설정

## RightPanel 요구사항

selectedElementId가 있으면 ElementPropertiesPanel 표시.

최소 수정 가능 항목:

- Heading/Text: text
- Button: label, href
- Image: src, alt
- Logo: text, href
- Menu: items label/href
- Card: title, description
- Form: submitLabel

## 테스트 시나리오

1. /editor 접속
2. Elements 탭 클릭
3. Text 클릭
4. 새 섹션이 자동 생성되고 Text가 보임
5. Text가 자동 선택됨
6. RightPanel에서 Text 수정 가능
7. Button 클릭
8. Button이 Canvas에 추가됨
9. Image 클릭
10. Image placeholder가 Canvas에 표시됨

## 하지 말 것

- Drag & Drop 구현하지 말 것
- Freeform 구현하지 말 것
- AI 수정하지 말 것
- Export 수정하지 말 것

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성


---

# Task 04. Elements에서 Canvas로 Drag & Drop 추가

현재 클릭으로 요소 추가가 가능하다.
이번 작업에서는 왼쪽 Elements 패널에서 요소를 드래그해서 Canvas의 원하는 위치에 놓을 수 있게 해줘.

## 목표

사용자는 왼쪽 Elements 패널에서 아래 요소를 드래그해서 Canvas에 추가할 수 있어야 한다.

- Heading
- Text
- Button
- Image
- Card
- Form
- Divider
- Spacer

## 지원 드롭 위치

- 빈 페이지
- 현재 페이지 맨 위
- 섹션과 섹션 사이
- 기존 container 내부
- columns section의 각 column 내부
- grid section 내부

## 라이브러리

- dnd-kit 사용

## 구현 요구사항

1. EditorDndContext 생성
2. Elements 패널의 요소 카드를 draggable로 만들기
3. Canvas의 section/container를 droppable로 만들기
4. DragOverlay 표시
5. 드래그 중 drop 가능한 위치 표시
6. hover 중인 drop zone 강조
7. 드롭 성공 시 addElementToLocation 실행
8. 드롭 위치가 없으면 createContainerSectionWithElement 실행
9. 추가된 element는 자동으로 selectedElementId 설정
10. PointerSensor 사용

## Store 액션

아래 액션을 추가해줘.

- addElementToLocation(elementType, location, index?)
- createContainerSectionWithElement(elementType, insertPosition?)
- selectElement(elementId)

## UX 요구사항

- 드래그 중 Canvas에 점선 drop zone 표시
- 섹션 사이에는 얇은 insert line 표시
- container 안에는 dashed border 표시
- 빈 페이지에는 큰 drop area 표시
- 드롭 성공 시 안내 메시지 표시
  - "Text 요소를 추가했어요."
  - "새 섹션을 만들고 Image를 추가했어요."

## 하지 말 것

- 섹션 순서 변경은 이번 task에서 하지 말 것
- 요소 간 이동은 이번 task에서 하지 말 것
- Header slot drag/drop은 이번 task에서 하지 말 것
- Freeform 구현하지 말 것
- Export 수정하지 말 것

## 테스트 시나리오

1. Elements 탭에서 Text를 드래그
2. Canvas의 섹션 사이에 드롭
3. 새 containerSection이 생성되고 Text가 보임
4. Button을 기존 container에 드롭
5. 해당 container 안에 Button이 추가됨
6. Image를 빈 페이지에 드롭
7. 새 섹션이 생기고 Image placeholder가 보임
8. 추가된 요소가 자동 선택됨
9. RightPanel에서 수정 가능

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성



---

# Task 05. 섹션 순서 Drag & Drop 구현

현재 Elements에서 Canvas로 요소 추가가 가능하다.
이번 작업에서는 페이지 안의 섹션 순서를 드래그로 변경할 수 있게 해줘.

## 목표

사용자는 Canvas에서 섹션을 위아래로 드래그해서 순서를 변경할 수 있어야 한다.

## 구현 요구사항

1. CanvasArea에서 currentPage.blocks를 SortableContext로 렌더링
2. SortableSectionWrapper 생성
3. 각 섹션 hover 시 drag handle 표시
4. handle을 잡고 드래그하면 섹션 이동
5. drop indicator 표시
6. dragEnd에서 reorderSections(activeId, overId) 호출
7. selectedBlockId 유지

## Store 액션

- reorderSections(activeId, overId)

## UX 요구사항

- drag handle은 섹션 왼쪽 상단에 작게 표시
- 드래그 중 섹션 opacity 조절
- drop 위치에 얇은 line 표시
- 선택된 섹션 ring과 hover ring을 구분
- 빈 섹션도 이동 가능해야 함

## 하지 말 것

- 요소 순서 변경은 이번 task에서 하지 말 것
- container 간 이동은 이번 task에서 하지 말 것
- Header slot 이동은 이번 task에서 하지 말 것
- Freeform 구현하지 말 것

## 테스트 시나리오

1. 페이지에 3개 이상의 섹션이 있음
2. 두 번째 섹션을 첫 번째 위치로 드래그
3. 순서가 변경됨
4. 새로고침 전까지 상태 유지
5. 선택 상태가 깨지지 않음

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성

---

# Task 06. Container 내부 Element 순서 Drag & Drop

현재 섹션 순서 변경이 가능하다.
이번 작업에서는 같은 container 내부의 요소 순서를 드래그로 바꿀 수 있게 해줘.

## 목표

예를 들어 container 안에 아래 요소가 있을 때:

- Heading
- Text
- Button

사용자는 Button을 Text 위로 드래그해서 순서를 바꿀 수 있어야 한다.

## 구현 요구사항

1. ContainerRenderer 내부 children을 SortableContext로 렌더링
2. SortableElementWrapper 생성
3. Element hover 시 drag handle 표시
4. handle로만 drag 시작되게 하기
5. dragEnd에서 reorderElements(containerId, activeId, overId) 호출
6. selectedElementId 유지

## Store 액션

- reorderElements(containerId, activeId, overId)

## UX 요구사항

- 요소 전체가 아니라 작은 handle로 drag
- text input 클릭과 drag가 충돌하지 않게 처리
- 드래그 중 opacity 또는 ghost 적용
- drop 위치 표시
- 빈 container에는 "여기에 요소를 놓으세요" 표시

## 하지 말 것

- 다른 container로 이동은 이번 task에서 하지 말 것
- Header slot 이동은 이번 task에서 하지 말 것
- Freeform 구현하지 말 것

## 테스트 시나리오

1. container 안에 Heading/Text/Button이 있음
2. Button을 Heading 위로 드래그
3. 순서가 변경됨
4. Button 선택 상태 유지
5. RightPanel 수정 가능

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성

---

# Task 07. Container 간 Element 이동 구현

현재 같은 container 내부 요소 순서 변경이 가능하다.
이번 작업에서는 요소를 다른 container로 이동할 수 있게 해줘.

## 목표

사용자는 한 container에 있는 요소를 다른 container로 옮길 수 있어야 한다.

예:

- Hero 왼쪽 column의 Button을 오른쪽 column으로 이동
- Text를 다른 section의 container로 이동
- Image를 빈 container로 이동
- Card를 grid container 안으로 이동

## 구현 요구사항

1. 모든 container를 droppable 영역으로 만들기
2. 모든 element를 draggable로 만들기
3. dragEnd에서 from/to location 계산
4. moveElement 액션 추가
5. 원래 container에서 element 제거
6. target container에 element 삽입
7. 드롭 후 moved element를 selectedElementId로 유지
8. 이동 실패 시 기존 상태 유지

## Store 액션

moveElement({
  elementId,
  from,
  to,
  index
})

## LocationRef

type LocationRef =
  | { type: 'container'; pageId: string; sectionId: string; containerId: string }
  | { type: 'headerSlot'; slot: 'left' | 'center' | 'right' | 'mobile' };

## UX 요구사항

- 드래그 중 drop 가능한 container는 dashed border
- hover 중인 container는 강조
- 빈 container도 drop target으로 표시
- 드롭 불가능한 곳은 표시하지 않음
- 요소가 중복 생성되지 않아야 함

## 하지 말 것

- Header slot 이동은 다음 task에서 처리
- Freeform 구현하지 말 것
- Export 수정하지 말 것

## 테스트 시나리오

1. 2 columns section 생성
2. 왼쪽 column에 Text/Button 있음
3. Button을 오른쪽 column으로 이동
4. Button이 왼쪽에서 제거되고 오른쪽에 표시됨
5. Button 선택 상태 유지
6. RightPanel 수정 가능

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성