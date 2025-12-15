import { Link } from '@tanstack/react-router'
import type { Article } from '@/db/schema'
import { formatDate } from '@/utils/formatDate'
import { EditorMarkdown } from '@/components/PlateMarkdown'

type ArticlePropsType = {
  article: Article
  articles: Array<Article>
  index: number
}

export default function ArticleHome({ article, articles, index }: ArticlePropsType) {
  const isLast = index === articles.length - 1
  const authorName = (article as Article & { authorName?: string }).authorName ?? 'Editorial Team'

  return (
    <article
      className={`space-y-3 sm:space-y-4 ${isLast ? '' : 'pb-10 md:pb-12'} ${isLast ? '' : 'border-b border-neutral-100'}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
        {formatDate(article.publishedAt)}
      </p>

      <Link params={{ slug: article.slug }} to="/$slug" className="group block">
        <h2 className="cursor-pointer text-2xl font-semibold leading-snug text-neutral-900 group-hover:underline">
          {article.title}
        </h2>
      </Link>

      <div className="text-base leading-relaxed text-neutral-700">
        <EditorMarkdown>{article.content.slice(0, 100) + (article.content.length > 100 ? '...' : '')}</EditorMarkdown>
      </div>

      <p className="text-sm font-medium text-neutral-500">{authorName}</p>
    </article>
  )
}
