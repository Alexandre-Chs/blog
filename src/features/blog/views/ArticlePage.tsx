import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import { formatDate } from '@/utils/formatDate'
import ArticleNotFound from '@/features/blog/components/ArticleNotFound'
import { articleBySlug } from '@/features/blog/api/articles'

type ArticlePageProps = {
  slug: string
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  const articleBySlugFn = useServerFn(articleBySlug)
  const {
    data: article,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleBySlugFn({ data: { slug } }),
  })

  if (isPending) {
    return (
      <div
        className="flex flex-1 items-center justify-center bg-white text-sm text-neutral-500"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Loading...
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <ArticleNotFound />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-white text-neutral-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-20">
        <article className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">{formatDate(article.publishedAt)}</p>
          <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-[3.2rem]">{article.title}</h1>

          <div className="flex flex-col gap-2 text-sm text-neutral-500 sm:flex-row sm:items-center sm:gap-3">
            <span className="font-medium text-neutral-600">{article.authorName ?? 'Editorial team'}</span>
          </div>

          <div className="pt-6 text-neutral-800" style={{ fontFamily: 'Inter, sans-serif' }}>
            <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-neutral-800">
              {article.content}
            </PlateMarkdown>
          </div>
        </article>

        <div className="mt-16 text-sm">
          <Link to="/" className="text-neutral-600 transition-colors hover:text-neutral-900 hover:underline">
            ← Back to articles
          </Link>
        </div>
      </main>
    </div>
  )
}
