랜딩페이지 에디터 상태 관리를 위한 Zustand store를 만들어줘.

파일:
- src/store/editor-store.ts

요구사항:
상태:
- page: PageData
- selectedBlockId: string | null
- previewMode: 'desktop' | 'tablet' | 'mobile'
- isDirty: boolean

액션:
- setPage(page)
- updatePageMeta(partial)
- selectBlock(id)
- addBlock(type)
- removeBlock(id)
- duplicateBlock(id)
- updateBlock(id, props)
- moveBlock(id, direction: 'up' | 'down')
- reorderBlocks(activeId, overId)
- setTheme(theme)
- setPalette(palette)
- setPreviewMode(mode)
- resetEditor()
- loadFromLocalStorage()
- saveToLocalStorage()

추가 요구사항:
- addBlock(type)은 blockDefaults를 사용해야 함
- blockDefaults 파일도 만들어줘
- 새 블록 id는 uuid 사용
- localStorage 저장 key는 "ai-landing-builder-draft" 사용
- 타입 안전하게 작성
- 불필요한 any 사용하지 않기