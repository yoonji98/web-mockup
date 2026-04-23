# Task 18. Export Mode 확장

React export를 생성 수준에 따라 다르게 만들 수 있게 개선해줘.

## Export Mode

1. Static Website
2. Clickable Prototype
3. Frontend Scaffold
4. Full-stack Starter 준비용 placeholder

## Static Website

- React Router
- site.json
- 정적 페이지
- header/footer
- elements/containers
- stylePack

## Clickable Prototype

- React Router
- mock data
- 로그인/장바구니/관리자 등 화면만 구현
- 실제 API 없음
- 버튼 클릭은 관련 페이지 이동 중심

## Frontend Scaffold

- React Router
- mock API layer
- collections data
- auth placeholder
- forms
- tables
- dashboard
- basic state management

## Full-stack Starter

이번 task에서는 placeholder만 제공.

- Next.js full-stack export는 후순위
- DB/Auth/Payment 연결 안내만 README에 작성

## 요구사항

- export modal에서 mode 선택
- 선택한 mode에 따라 포함 파일 변경
- export된 프로젝트는 npm install 후 npm run build 통과
- README에 mode별 설명 추가

## 작업 후

- export zip 생성
- 압축 해제
- npm install
- npm run build
- 변경 요약 작성

---


# Task 19. 최종 UX QA 및 사용성 개선

지금까지 구현된 웹사이트 빌더를 사용자 편의성 기준으로 점검하고 개선해줘.

## 핵심 시나리오

### 시나리오 1. 빈 페이지에서 시작

1. /editor 접속
2. 빈 페이지 확인
3. Text 클릭
4. 새 섹션 자동 생성
5. Text 수정
6. Button 추가
7. Button 링크 수정

### 시나리오 2. 드래그로 배치

1. Elements에서 Image 드래그
2. Canvas container에 드롭
3. Button을 다른 container로 이동
4. 섹션 순서 변경

### 시나리오 3. Header 구성

1. Header Builder 열기
2. Logo 추가
3. Menu 추가
4. Login Button 추가
5. CTA Button 추가
6. Logo/Menu/Button 위치 변경

### 시나리오 4. 사이트 생성

1. Wizard 열기
2. 기업 홈페이지 선택
3. 생성 수준 선택
4. 추천 페이지 확인
5. Site 생성
6. PagesPanel에서 페이지 확인

### 시나리오 5. Export

1. React export 열기
2. Static Website 선택
3. zip 생성
4. 압축 해제 후 npm run build 통과

## 점검 기준

- 사용자가 막히는 지점이 있는가?
- 선택 대상이 없어도 자동으로 추가되는가?
- 드롭 가능한 위치가 명확한가?
- 삭제/이동 실수 복구가 가능한가?
- 모바일 미리보기가 깨지지 않는가?
- RightPanel이 선택한 대상에 맞게 바뀌는가?
- Header/Footer가 모든 페이지에 자연스럽게 적용되는가?
- export 결과가 빌드되는가?

## 개선 요구사항

발견된 UX 문제를 작게 수정해줘.

단, 대규모 구조 변경은 하지 말 것.

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성
- 남은 UX 개선 TODO 작성