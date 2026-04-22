결제 전/후 기능 제한 구조를 만들어줘.

요구사항:
무료 상태:
- 에디터 사용 가능
- AI 생성 가능
- 미리보기 가능
- 발행 버튼 클릭 시 결제 안내
- React 프로젝트 export 클릭 시 결제 안내

유료 상태:
- 발행 가능
- React 프로젝트 export 가능
- 워터마크 제거

구현:
- Project.paymentStatus === 'PAID'이면 유료 기능 허용
- 지금은 mock paymentStatus를 store나 localStorage에 저장
- PricingModal 컴포넌트 생성
- "1회 구매" 플랜 UI 생성
- 결제 버튼은 아직 placeholder

파일:
- src/components/billing/PricingModal.tsx
- src/lib/billing/entitlements.ts
- TopBar에 연결