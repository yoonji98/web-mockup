import Link from "next/link";

const capabilities = [
  "PageData JSON 기반 생성",
  "블록 단위 편집",
  "팔레트 선택 및 커스텀",
  "Vite React ZIP export",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between border-b border-slate-200 pb-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Landing Studio
          </Link>
          <Link
            href="/editor"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            에디터 열기
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              AI Landing Page Builder
            </p>
            <h1 className="text-balance text-5xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
              JSON으로 만들고, 블록으로 다듬는 랜딩페이지 스튜디오
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              AI는 React 코드를 만들지 않고 PageData JSON만 생성합니다. 사용자는
              블록, 카피, 팔레트를 조정하고 미리보기에서 즉시 결과를 확인합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                빌더 시작
              </Link>
              <Link
                href="/site/demo"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              >
                공개 페이지 보기
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {capabilities.map((capability) => (
              <div
                key={capability}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {capability}
                </p>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 w-2/3 rounded-full bg-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
