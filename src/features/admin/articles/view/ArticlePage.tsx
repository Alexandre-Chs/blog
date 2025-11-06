import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { articleBySlug } from '../api/list'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import { formatDate } from '@/utils/formatDate'

type ArticlePageProps = {
  slug: string
}

const formatReadTime = (readTime: number | null | undefined) => {
  if (!readTime || readTime <= 0) {
    return null
  }

  return `${readTime} min read`
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  const {
    data: article,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleBySlug({ data: { slug } }),
  })

  if (isPending) {
    return (
      <div className="min-h-screen bg-white text-[#1a1a1a]">
        <div className="mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-6">
          <span className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Loading article...
          </span>
        </div>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-white text-[#1a1a1a]">
        <main className="mx-auto flex min-h-[60vh] max-w-screen-md flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            Article not found
          </h1>
          <p className="mt-4 text-base text-gray-600">
            We couldn’t locate the article you were looking for. It may have been unpublished or moved.
          </p>
          <Link
            to="/"
            className="mt-8 text-sm font-medium text-[#111] transition-colors duration-200 hover:text-[#555]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Go back to the blog →
          </Link>
        </main>
      </div>
    )
  }

  const displayDate = formatDate(article.publishedAt ?? article.updatedAt)
  const readTimeLabel = formatReadTime(article.readTime)

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <main className="mx-auto max-w-screen-lg px-6 pb-16 pt-12 md:pt-20" style={{ fontFamily: 'Merriweather, serif' }}>
        <article className="mx-auto max-w-3xl">
          {displayDate ? (
            <p className="text-sm uppercase tracking-wide text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {displayDate}
            </p>
          ) : null}

          <h1
            className="mt-4 text-4xl font-semibold leading-tight text-[#1a1a1a] md:text-5xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {article.title}
          </h1>

          <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-4">
            <span className="font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {article.authorName ?? 'the team blogai'}
            </span>
            {readTimeLabel ? <span>• {readTimeLabel}</span> : null}
          </div>

          <div className="mt-10">
            <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-gray-700">
              {article.content}
            </PlateMarkdown>
          </div>
        </article>

        <div className="mx-auto mt-16 flex max-w-3xl items-center justify-between border-t border-gray-100 pt-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#555]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Back to articles
          </Link>
        </div>
      </main>
    </div>
  )
}
