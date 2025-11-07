export default function ArticleNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
      <span
        className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Empty Feed
      </span>
      <h2 className="mt-6 text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Inter, sans-serif' }}>
        No articles yet
      </h2>
      <p className="mt-4 text-base leading-relaxed text-gray-600">
        When new stories are published, they’ll appear here. Until then, enjoy the quiet moment.
      </p>
    </div>
  )
}
