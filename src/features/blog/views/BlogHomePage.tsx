import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { articlesPublished } from '../api/home'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import { formatDate } from '@/utils/formatDate'

const HomePage = () => {
  const { data: articles, isPending } = useQuery({
    queryKey: ['articlesPublished'],
    queryFn: articlesPublished,
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  const latestArticles = articles ?? []
  const hasArticles = latestArticles.length > 0
  const popularArticles = latestArticles.slice(0, 3)

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <main className="mx-auto max-w-screen-xl px-6" style={{ fontFamily: 'Merriweather, serif' }}>
        <section className={`${hasArticles ? 'mt-16' : ''}`}>
          {hasArticles && (
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              Latest Articles
            </h1>
          )}

          <div
            className={`flex flex-col gap-16 lg:mt-16 lg:flex-row lg:gap-20 min-h-[55vh] ${hasArticles ? 'mt-12' : ''}`}
          >
            <div className={`flex flex-1 flex-col lg:min-w-0 ${!hasArticles ? 'justify-center' : ''}`}>
              {hasArticles ? (
                latestArticles.map((article, index) => {
                  const isLast = index === latestArticles.length - 1
                  const isFirst = index === 0

                  return (
                    <article
                      key={article.id}
                      className={`${isFirst ? 'pb-12' : 'py-12'} ${isLast ? '' : 'border-b border-gray-100'}`}
                    >
                      <p
                        className="text-sm lowercase tracking-wide text-gray-500"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {formatDate(article.publishedAt)}
                      </p>

                      <h2
                        className="mt-3 text-3xl font-semibold leading-snug text-[#1a1a1a]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {article.title}
                      </h2>

                      <div className="mt-5">
                        <PlateMarkdown className="prose prose-lg max-w-none text-gray-700">
                          {article.content.slice(0, 100) + (article.content.length > 100 ? '...' : '')}
                        </PlateMarkdown>
                      </div>

                      <div className="mt-8 flex flex-col gap-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-sm font-semibold text-[#1a1a1a]"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {/* {article.author} */}
                            the team blogai
                          </span>
                        </div>

                        <Link
                          params={{ slug: article.slug }}
                          to="/$slug"
                          className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#555]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Read more →
                        </Link>
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Empty Feed
                  </span>
                  <h2
                    className="mt-6 text-2xl font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    No articles yet
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-600">
                    When new stories are published, they’ll appear here. Until then, enjoy the quiet moment.
                  </p>
                </div>
              )}
            </div>

            {hasArticles && (
              <aside className="lg:sticky lg:top-24 lg:w-[30%] lg:min-w-[260px] lg:self-start">
                <h2 className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Popular Articles
                </h2>

                <div className="mt-6 divide-y divide-gray-100 border-t border-gray-100">
                  {popularArticles.map((article) => (
                    <article key={article.id} className="py-6">
                      <Link
                        params={{ slug: article.slug }}
                        to="/$slug"
                        className="text-base font-semibold text-[#111] transition-colors duration-200 hover:text-[#555]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {article.title}
                      </Link>
                      <div className="mt-3">
                        <PlateMarkdown className="prose prose-sm max-w-none text-gray-600">
                          {article.content.slice(0, 70) + (article.content.length > 70 ? '...' : '')}
                        </PlateMarkdown>
                      </div>
                      <p
                        className="mt-4 text-xs uppercase tracking-wide text-gray-500"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {/* {viewsFormatter.format(article.views)} views · {article.readTime} min read */}
                      </p>
                    </article>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100">
        <div
          className="mx-auto max-w-screen-lg px-6 py-10 text-center text-sm text-gray-500"
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          © 2025 BlogAI — Built with ❤️
        </div>
      </footer>
    </div>
  )
}

export default HomePage
