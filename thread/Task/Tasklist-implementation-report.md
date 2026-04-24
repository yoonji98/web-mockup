# Tasklist 1-4 구현 상태 보고서

작성일: 2026-04-23

대상 파일:

- `thread/Task/Tasklist.md`
- `thread/Task/Tasklist2.md`
- `thread/Task/Tasklist3.md`
- `thread/Task/Tasklist4.md`

참고:

- `Tasklist.md` ~ `Tasklist4.md`에는 Task 01~12, Task 14~19가 포함되어 있다.
- Task 13은 별도 요청으로 진행된 `Freeform Section` 작업이므로 이 보고서에 참고 항목으로 포함했다.

## 전체 요약

| Task | 상태 | 요약 |
| --- | --- | --- |
| Task 01. 현재 웹사이트 빌더 구조 감사 | 완료 | 구조 감사 보고성 작업 |
| Task 02. 선택 상태와 LocationRef 구조 정리 | 완료 | block/container/element/header slot 선택 구조 연결 |
| Task 03. 클릭으로 요소 추가 UX 완성 | 완료 | Element Library에서 선택 위치 기준 요소 추가 |
| Task 04. Elements에서 Canvas로 Drag & Drop 추가 | 완료 | dnd-kit 기반 Canvas drop 연결 |
| Task 05. 섹션 순서 Drag & Drop 구현 | 완료 | 섹션 재정렬 가능 |
| Task 06. Container 내부 Element 순서 Drag & Drop | 완료 | 같은 컨테이너 내부 요소 정렬 가능 |
| Task 07. Container 간 Element 이동 구현 | 완료 | 컨테이너 간 요소 이동 가능 |
| Task 08. Header Slot Builder 개선 | 완료 | left/center/right slot 기반 header builder 연결 |
| Task 09. Header Slot Drag & Drop 구현 | 완료 | Header slot 내부 drop/reorder 연결 |
| Task 10. Smart Insert 버튼 추가 | 완료 | Canvas/Container에 Smart Insert 메뉴 연결 |
| Task 11. Undo / Redo 기능 추가 | 완료 | store history, TopBar 버튼, 단축키 연결 |
| Task 12. Breadcrumb와 Layer Tree 추가 | 완료 | 선택 위치 탐색과 layer tree 연결 |
| Task 13. Freeform Section 추가 | 부분 구현 | freeform section, 이동, 수치 편집, 저장 구현. resize handle 미구현 |
| Task 14. Page Catalog 시스템 추가 | 완료 | page catalog 타입/데이터/generation 연결 |
| Task 15. Feature Kit 시스템 추가 | 부분 구현 | feature kit 타입/데이터/UI 연결. 일부 kit 구성은 요구와 1:1 불일치 |
| Task 16. Site Creation Wizard 개선 | 부분 구현 | 6단계 wizard, catalog/kit/style pack 연결. 세부 feature 선택 UX는 부족 |
| Task 17. Collection / Mock Data 시스템 추가 | 부분 구현 | collection 타입/데이터/block/export 연결. 필드와 detail routing 미완성 |
| Task 18. Export Mode 확장 | 대부분 구현 | static/clickable/frontend/full-stack export mode 분기 구현 |
| Task 19. 최종 UX QA 및 사용성 개선 | 부분 구현 | build/export 검증 및 일부 UX fallback 수정. 전체 수동 QA는 미완료 |

## 정상 구현 및 연결됨

- `SiteData`, `PageData`, `BlockData`, `ElementNode`, `ContainerNode` 중심의 타입 구조가 연결되어 있다.
- `LocationRef` 기반으로 block, container, element, header slot 위치를 찾고 선택할 수 있다.
- `ElementLibraryPanel`에서 클릭으로 요소를 추가할 수 있다.
- `EditorDndContext`를 통해 element, section, container, header slot drag & drop이 연결되어 있다.
- `ElementRenderer`와 `ContainerRenderer`가 실제 canvas 렌더링에 사용된다.
- `RightPanel`과 `ElementPropertiesPanel`이 선택된 요소의 속성 편집에 연결되어 있다.
- `HeaderBuilderPanel`과 `SiteHeader`가 slot 기반 header 구조를 사용한다.
- `SmartInsertMenu`가 section/container 삽입 흐름에 연결되어 있다.
- `SelectionBreadcrumb`와 `LayerTreePanel`이 선택 상태와 연결되어 있다.
- `undo`, `redo`가 editor store와 TopBar에 연결되어 있다.
- `Page Catalog` 데이터가 wizard, prompt, fallback page 생성 흐름에 연결되어 있다.
- `Feature Kit` 데이터와 `FeatureKitPanel`이 좌측 sidebar에 연결되어 있다.
- `Collection` 타입, mock data, collection block renderer, export 구조가 추가되어 있다.
- React export API와 generator가 export mode별로 다른 파일 구성을 생성한다.

## 파일은 있지만 UI 또는 동작 완성도가 부족함

- `FeatureKitPanel`은 연결되어 있지만 일부 kit의 page 구성이 요구사항과 정확히 일치하지 않는다.
- `AISiteWizard`는 6단계로 개선되었지만, 요구된 개별 feature checklist UX는 완전히 구현되지 않았다.
- `Collection` 관련 파일은 있지만 실제 detail page routing과 mock API 사용 흐름은 제한적이다.
- `FreeformSection` 관련 파일은 있지만 resize handle 기반 직접 크기 조절은 아직 없다.
- `Export Mode` 파일 구성은 분기되지만 clickable prototype의 모든 버튼/폼 행동이 자동 연결되는 수준은 아니다.

## 타입은 있지만 renderer/store/export에 완전히 연결되지 않은 부분

- Collection detail route는 타입/블록은 있으나 `/products/:id` 같은 실제 동적 라우팅까지 완성되어 있지는 않다.
- Collection field schema는 있으나 요구된 기본 field 세트와 1:1로 맞지 않는 collection이 있다.
- Freeform responsive layout 구조는 준비되어 있지만 desktop/tablet/mobile별 실제 편집 UX는 초기 수준이다.
- Full-stack export mode는 starter placeholder와 문서 중심이며 실제 backend integration은 없다.

## 아예 없음 또는 후순위로 남은 것

- Freeform Section resize drag handle
- Collection detail page의 실제 dynamic route 생성
- Collection별 요구 field 세트 100% 일치
- Feature Kit별 요구 page 세트 100% 일치
- Wizard의 세부 feature checkbox 기반 선택 UX
- Export된 clickable prototype의 모든 interaction 자동 매핑
- 전체 브라우저 수동 QA 체크리스트 완료 기록

## 가장 먼저 고쳐야 할 것 TOP 5

1. Collection detail routing 완성
2. Feature Kit page 구성 요구사항과 실제 데이터 1:1 정리
3. Freeform Section resize handle 추가
4. Wizard에서 feature 선택 UX를 명확한 checklist로 개선
5. Export clickable/frontend mode의 실제 interaction 연결 범위 확대

## 추천 수정 순서

1. 현재 빌더 UX 안정화
   - Freeform resize
   - Drag & Drop edge case
   - RightPanel 편집 항목 정리

2. 데이터 기반 사이트 기능 완성
   - Collection field schema 정리
   - Collection list/detail routing 연결
   - mock data와 renderer의 필드 매핑 정리

3. 생성 UX 고도화
   - Feature Kit 요구 page 세트 보정
   - Wizard feature checklist 추가
   - Page Catalog와 Feature Kit 중복 처리 개선

4. Export 품질 개선
   - clickable prototype action mapping
   - frontend scaffold mock API 사용 예시 강화
   - full-stack starter의 실제 파일 구조 확장

5. 최종 QA
   - Chrome/IAB 양쪽 수동 테스트
   - export zip build 테스트
   - mobile viewport 확인
   - payment/export modal 잘림 여부 확인

## 검증 상태

최근 확인 기준:

- `npm run lint` 통과
- `npm run build` 통과
- `http://localhost:3000/editor` 응답 확인
- React export ZIP 생성 확인
- export된 frontend scaffold 프로젝트에서 `npm install`, `npm run build` 통과

남은 경고:

- `src/components/elements/ImageElement.tsx`의 `img` 태그 관련 lint warning
- `src/components/elements/LogoElement.tsx`의 `img` 태그 관련 lint warning

