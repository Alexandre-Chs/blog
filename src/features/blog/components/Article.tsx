import { Link } from '@tanstack/react-router'
import type { Article } from '@/db/schema'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import { formatDate } from '@/utils/formatDate'

type ArticlePropsType = {
  article: Article
  articles: Array<Article>
  index: number
}

export default function Article({ article, articles, index }: ArticlePropsType) {
  const isLast = index === articles.length - 1
  const isFirst = index === 0

  return (
    <article key={article.id} className={`${isFirst ? 'pb-12' : 'py-12'} ${isLast ? '' : 'border-b border-gray-100'}`}>
      <p className="text-sm lowercase tracking-wide text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
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
          <span className="text-sm font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
}
