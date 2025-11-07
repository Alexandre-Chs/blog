import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { articlesPublished } from '../api/home'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import ArticleNotFound from '@/features/blog/components/ArticleNotFound'
import Article from '@/features/blog/components/Article'

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
              {articles && articles.length ? (
                articles.map((article, index) => <Article article={article} index={index} articles={articles} />)
              ) : (
                <ArticleNotFound />
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
    </div>
  )
}

export default HomePage
