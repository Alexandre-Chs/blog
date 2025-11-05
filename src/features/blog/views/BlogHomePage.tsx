import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { articlesPublished } from '../api/home'
import { PlateMarkdown } from '@/components/PlateMarkdown'

const HomePage = () => {
  const { data: articles } = useQuery({
    queryKey: ['articlesPublished'],
    queryFn: articlesPublished,
  })

  console.log('les articles', articles)

  if (!articles) {
    return <div>Loading...</div> // TODO: afficher ici pas d'articles
  }

  const popularArticles = [...articles].slice(0, 3)
  // TODO: pending = loading

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-6">
          <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            smith.
          </span>
          <Link
            to="/about"
            className="text-sm font-medium text-[#111] transition-colors duration-200 hover:text-[#555]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            About
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6" style={{ fontFamily: 'Merriweather, serif' }}>
        <section className="mt-16">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            Latest Articles
          </h1>

          <div className="mt-12 flex flex-col gap-16 lg:mt-16 lg:flex-row lg:gap-20">
            <div className="lg:flex-1 lg:min-w-0">
              {articles.map((article, index) => {
                const isLast = index === articles.length - 1
                const isFirst = index === 0

                return (
                  <article
                    key={article.id}
                    className={`${isFirst ? 'pb-12' : 'py-12'} ${isLast ? '' : 'border-b border-gray-100'}`}
                  >
                    <p
                      className="text-sm uppercase tracking-wide text-gray-500"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {/* {dateFormatter.format(publishedDate)} */}
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
              })}
            </div>

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
