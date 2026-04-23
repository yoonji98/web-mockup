# Task 14. Page Catalog 시스템 추가

현재 웹사이트 유형별 페이지 구성이 흩어져 있다.
사용자가 사이트 유형을 고르면 필요한 페이지를 추천할 수 있도록 Page Catalog 시스템을 추가해줘.

## 목표

쇼핑몰, 기업 홈페이지, 포트폴리오, SaaS, 블로그, 커뮤니티, 공공기관, 관리자 등에서 사용할 페이지 정의를 데이터로 관리한다.

## 파일

- src/types/page-catalog.ts
- src/data/page-catalog.ts

## PageDefinition 타입

PageDefinition {
  id: string;
  name: string;
  description: string;
  category:
    | 'global'
    | 'commerce'
    | 'government'
    | 'portfolio'
    | 'saas'
    | 'content'
    | 'community'
    | 'company'
    | 'admin';

  pageKind:
    | 'static'
    | 'form'
    | 'list'
    | 'detail'
    | 'auth'
    | 'checkout'
    | 'dashboard'
    | 'settings'
    | 'error';

  complexity: 0 | 1 | 2 | 3 | 4 | 5;
  routePattern: string;
  requires?: string[];
  recommendedFor: string[];
  defaultBlocks: string[];
  dataModel?: string;
  canBeStaticMockup: boolean;
  canBeFrontendScaffold: boolean;
  canBeFullStack: boolean;
}

## 포함할 Page Catalog

### Global
- 홈
- 소개
- 문의
- 이용약관
- 개인정보처리방침
- 404

### E-commerce
- 카테고리 리스트
- 카테고리 상세
- 검색 결과
- 상품 상세
- 리뷰 리스트
- 리뷰 작성
- Q&A 리스트
- 장바구니
- 주문서 작성
- 결제 완료
- 결제 실패
- 마이페이지
- 주문 내역
- 배송 조회
- 찜 목록
- 이벤트
- FAQ
- 1:1 문의

### Portfolio
- 홈
- About
- Skills
- 프로젝트 리스트
- 프로젝트 상세
- 블로그
- Contact
- 이력서 다운로드

### SaaS
- 랜딩
- 기능 소개
- 가격
- 로그인
- 회원가입
- 온보딩
- 대시보드
- 설정
- 구독 관리
- 결제 내역

### Content / Blog
- 홈
- 카테고리
- 태그
- 게시글 리스트
- 게시글 상세
- 검색
- 댓글
- 북마크

### Community
- 홈 피드
- 게시글 상세
- 글 작성
- 댓글
- 프로필
- 팔로우
- 알림
- 메시지

### Company
- 홈
- 회사 소개
- 비전/미션
- 서비스 리스트
- 서비스 상세
- 포트폴리오
- 고객사
- 사례 연구
- 채용 공고
- 지원하기
- 뉴스
- 공지사항
- 문의

### Government
- 기관 소개
- 조직도
- 연혁
- 위치
- 정책 안내
- 법령/규정
- 보도자료
- 연구보고서
- 자료실
- 민원 신청
- 민원 조회
- 서식 다운로드
- 공지사항
- 정보공개 청구

### Admin
- 대시보드
- 사용자 목록
- 사용자 상세
- 권한 관리
- 주문 목록
- 상품 목록
- 상품 등록/수정
- 콘텐츠 관리
- 문의 관리
- FAQ 관리
- 통계
- 설정
- 로그

## 요구사항

- 각 page는 complexity를 가져야 함
- 실제 기능이 필요한 페이지는 requires에 feature key 추가
- mockup 가능 여부와 frontend scaffold 가능 여부 구분
- AI가 직접 페이지를 마음대로 만들지 않고 이 catalog에서 선택하게 할 수 있어야 함

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성

---


# Task 15. Feature Kit 시스템 추가

사용자가 긴 페이지 목록에서 하나씩 고르지 않아도 되도록 Feature Kit 시스템을 추가해줘.

## 목표

기능 묶음을 선택하면 관련 페이지들이 자동으로 추천/추가되게 한다.

## 파일

- src/types/feature-kit.ts
- src/data/feature-kits.ts
- src/components/editor/FeatureKitPanel.tsx

## FeatureKit 타입

FeatureKit {
  id: string;
  name: string;
  description: string;
  category:
    | 'auth'
    | 'commerce'
    | 'content'
    | 'support'
    | 'admin'
    | 'legal'
    | 'portfolio'
    | 'company'
    | 'government';

  includedPageIds: string[];
  recommendedPageIds?: string[];
  requiredFeatureKeys?: string[];
  complexity: 0 | 1 | 2 | 3 | 4 | 5;
  modeSupport: {
    website: boolean;
    prototype: boolean;
    frontendScaffold: boolean;
    fullStack: boolean;
  };
}

## 기본 Feature Kits

### Legal Kit
- 이용약관
- 개인정보처리방침
- 404

### Support Kit
- FAQ
- 문의
- 1:1 문의
- 공지사항

### Blog Kit
- 게시글 리스트
- 게시글 상세
- 카테고리
- 태그
- 검색

### Portfolio Kit
- 프로젝트 리스트
- 프로젝트 상세
- Skills
- 이력서 다운로드

### Company Kit
- 회사 소개
- 서비스 리스트
- 서비스 상세
- 고객사
- 사례 연구
- 채용
- 문의

### Auth Kit
- 로그인
- 회원가입
- 비밀번호 찾기
- 마이페이지
- 프로필

### Commerce Starter Kit
- 카테고리 리스트
- 상품 상세
- 장바구니
- 주문서
- 결제 완료
- 마이페이지
- 주문 내역

### Admin Starter Kit
- 대시보드
- 사용자 관리
- 콘텐츠 관리
- 문의 관리
- 설정

### Government Info Kit
- 기관 소개
- 조직도
- 정책 안내
- 자료실
- 공지사항
- 위치

## FeatureKitPanel 요구사항

- 왼쪽 또는 생성 Wizard에서 kit 선택 가능
- Kit 카드에는 포함 페이지 수, 난이도, 추천 모드 표시
- 선택 시 포함 페이지 preview 표시
- 추가 버튼 클릭 시 SiteData.pages에 페이지 추가
- 이미 있는 페이지는 중복 추가하지 않음

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성


---


# Task 16. Site Creation Wizard 개선

AI 웹사이트 생성 Wizard를 Page Catalog와 Feature Kit 기반으로 개선해줘.

## 목표

사용자가 사이트 유형과 생성 수준을 고르면 필요한 페이지와 Feature Kit을 자동 추천한다.

## 단계

### Step 1. 사이트 유형 선택

- 일반 홈페이지
- 기업 홈페이지
- 포트폴리오
- SaaS / 웹앱
- 쇼핑몰
- 블로그 / 콘텐츠
- 커뮤니티
- 공공기관
- 관리자 대시보드

### Step 2. 생성 수준 선택

- 예쁜 웹사이트
- 클릭 가능한 프로토타입
- React 프론트엔드 프로젝트
- 풀스택 스타터 준비

### Step 3. 필요한 기능 선택

- 로그인/회원가입
- 문의 폼
- 블로그
- 상품 목록
- 장바구니
- 결제 화면
- 관리자
- 검색
- 댓글
- 마이페이지
- 약관/개인정보 페이지

### Step 4. 추천 페이지 확인

추천 페이지를 3그룹으로 보여줘.

- 필수
- 추천
- 선택

사용자는 페이지를 추가/제거할 수 있다.

### Step 5. StylePack / 분위기 선택

- 감성적인
- 미니멀한
- 고급스러운
- 전문적인
- 따뜻한
- 트렌디한
- 강렬한

### Step 6. 생성

선택한 Page Catalog와 Feature Kit을 기반으로 SiteData 생성.

## 요구사항

- AI가 페이지를 무작정 만들지 않게 하기
- PageCatalog와 FeatureKit 규칙을 우선 사용
- AI는 문구, 섹션 내용, mock data, 스타일 추천에 집중
- 추천 페이지 UI는 너무 복잡하지 않게 카드/체크리스트로 구성
- 생성 후 PagesPanel에서 확인 가능

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성



---


# Task 17. Collection / Mock Data 시스템 추가

리스트/상세 페이지를 안정적으로 생성하기 위해 Collection 시스템을 추가해줘.

## 목표

상품, 게시글, 프로젝트, 서비스, 공지사항 같은 데이터를 SiteData 안에서 정의하고, 해당 collection 기반으로 list/detail 페이지를 렌더링한다.

## 타입

CollectionDefinition {
  id: string;
  name: string;
  itemName: string;
  fields: FieldDefinition[];
  sampleData: Record<string, unknown>[];
}

FieldDefinition {
  id: string;
  name: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'image'
    | 'date'
    | 'boolean'
    | 'select'
    | 'tags'
    | 'url';
  required?: boolean;
  options?: string[];
}

## 기본 Collection

### products
- name
- price
- description
- image
- category
- tags
- stock
- rating

### posts
- title
- excerpt
- content
- coverImage
- category
- tags
- publishedAt
- author

### projects
- title
- description
- image
- role
- period
- skills
- url

### services
- title
- description
- price
- duration
- icon

### notices
- title
- content
- publishedAt
- category

### jobs
- title
- department
- location
- description
- deadline

## 요구사항

- SiteData에 collections 필드 추가
- Collection 기반 ListBlock / DetailBlock 렌더링 준비
- sampleData를 기반으로 리스트/상세 페이지 mock 렌더링
- React export에도 sample data 포함

## 작업 후

- npm run lint
- npm run build
- 변경 요약 작성