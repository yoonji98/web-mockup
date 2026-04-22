Prisma 기반 DB 구조를 추가해줘.

패키지:
- prisma
- @prisma/client

파일:
- prisma/schema.prisma
- src/lib/db.ts

모델:
User는 인증 구현 전이므로 일단 optional ownerEmail 정도만 둬.

Project:
- id
- ownerEmail optional
- title
- slug unique optional
- pageJson Json
- status enum: DRAFT, PUBLISHED
- paymentStatus enum: NONE, PAID
- createdAt
- updatedAt
- publishedAt optional

Palette:
- id
- ownerEmail optional
- name
- type enum: SYSTEM, AI, CUSTOM
- moodTags Json
- colors Json
- createdAt

Payment:
- id
- projectId
- provider enum: TOSS, STRIPE
- amount
- currency
- status
- externalPaymentKey optional
- createdAt
- updatedAt

요구사항:
- Prisma schema 작성
- db client singleton 작성
- 기존 localStorage repository와 DB repository를 나중에 교체할 수 있게 인터페이스 고려