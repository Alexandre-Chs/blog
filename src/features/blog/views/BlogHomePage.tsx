import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { articlesPublished } from '../api/home'
import ArticleHome from '@/features/blog/components/ArticleHome'
import { formatDate } from '@/utils/formatDate'
import { PlateMarkdown } from '@/components/PlateMarkdown'

const HomePage = () => {
  const { data: articles, isPending } = useQuery({
    queryKey: ['articlesPublished'],
    queryFn: articlesPublished,
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

  if (!articles || articles.length === 0) {
    return (
      <div
        className="flex flex-1 items-center justify-center bg-white text-neutral-900"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <div className="mx-auto w-full max-w-2xl py-24 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Quiet for now</p>
          <p className="mt-4 text-2xl font-semibold text-neutral-900">No articles published yet</p>
          <p className="mt-3 text-base leading-relaxed text-neutral-600">
            Check back soon&mdash;new posts will appear here as soon as they go live.
          </p>
        </div>
      </div>
    )
  }

  const articlesPopular = articles.slice(0, 4)

  return (
    <div className="flex flex-1 flex-col bg-white text-neutral-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-0 lg:py-16">
        <section className="lg:grid lg:grid-cols-[minmax(0,720px)_220px] lg:items-start lg:justify-center lg:gap-14">
          <div className="w-full max-w-2xl space-y-10">
            {articles.map((article, index) => (
              <ArticleHome key={article.id} article={article} index={index} articles={articles} />
            ))}
          </div>

          <aside className="mt-12 text-sm text-neutral-500 lg:mt-0">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 pb-1">Popular</p>
            <div className="mt-2 space-y-6">
              {articlesPopular.map((article) => (
                <article key={article.id} className="space-y-2">
                  <Link
                    params={{ slug: article.slug }}
                    to="/$slug"
                    className="text-sm font-semibold text-neutral-800 hover:underline"
                  >
                    {article.title}
                  </Link>
                  <p className="text-sm leading-relaxed text-neutral-500 mt-2">
                    <PlateMarkdown>
                      {article.content.slice(0, 90) + (article.content.length > 90 ? '…' : '')}
                    </PlateMarkdown>
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                    {formatDate(article.publishedAt ?? article.updatedAt)}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default HomePage
