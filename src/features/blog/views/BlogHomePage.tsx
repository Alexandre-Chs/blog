import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { articlesPublished } from '../api/home'
import { formatDate } from '@/utils/formatDate'
import { PlateMarkdown } from '@/components/PlateMarkdown'

const BlogHomePage = () => {
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

  return (
    <section className="grid gap-8 lg:grid-cols-2 md:gap-10 mt-20">
      {articles.map((article) => {
        const date = formatDate(article.publishedAt ?? article.updatedAt)

        return (
          <Link key={article.id} params={{ slug: article.slug }} to="/$slug" className="block">
            <article className="overflow-hidden rounded-lg border border-neutral-100 bg-white h-[400px]">
              <div className="overflow-hidden">
                {article.thumbnail.thumbnailUrl ? (
                  <img
                    src={article.thumbnail.thumbnailUrl}
                    alt={article.thumbnail.alt || ''}
                    className="h-[200px] w-full object-cover"
                  />
                ) : (
                  <div className="h-[200px] w-full bg-gray-50" />
                )}
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-7">
                <p className="mb-1 text-xs text-neutral-500">{date}</p>
                <h2 className="text-2xl font-semibold leading-snug text-neutral-900">{article.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                  <PlateMarkdown>
                    {article.content
                      .replace(/[*_#`[\]]/g, '')
                      .replace(/\s+/g, ' ')
                      .slice(0, 140) + (article.content.length > 140 ? '…' : '')}
                  </PlateMarkdown>
                </p>
              </div>
            </article>
          </Link>
        )
      })}
    </section>
  )
}

export default BlogHomePage
