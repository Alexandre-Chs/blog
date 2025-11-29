import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { articlesList } from '../api/list'
import ArticleActions from './ArticleActions'
import { formatDate } from '@/utils/formatDate'

type ArticlesListProps = {
  articleStatus: 'published' | 'scheduled' | 'draft'
}

export default function ArticlesList({ articleStatus }: ArticlesListProps) {
  const articlesListsFn = useServerFn(articlesList)

  const { data: articles } = useQuery({
    queryKey: ['articles', articleStatus],
    queryFn: () => articlesListsFn({ data: { status: articleStatus } }),
  })

  if (!articles || articles.length === 0) {
    return <div className="max-w-5xl mx-auto px-6 py-10">No articles find.</div>
  }

  return (
    <div className="max-w-3xl mx-auto pt-6 w-full">
      <div className="border border-border/70 rounded-xl overflow-hidden">
        {articles.map((article, idx) => {
          const isLast = idx === articles.length - 1

          return (
            <div key={article.id} className={`${!isLast ? 'border-b border-border/70' : ''}`}>
              <article className="flex gap-4 px-4 py-5 sm:px-6">
                {article.thumbnailUrl ? (
                  <img src={article.thumbnailUrl} className="flex h-14 w-14 flex-shrink-0 rounded-md object-cover" />
                ) : (
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md bg-muted text-base font-semibold text-muted-foreground">
                    {article.title.trim().charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="truncate text-base font-semibold text-foreground">
                      {article.title.trim() || 'Draft'}
                    </div>
                    {article.publishedAt && (
                      <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{article.authorName ? article.authorName : 'Author unknown'}</span>
                    <ArticleActions articleId={article.id} articleStatus={articleStatus} />
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}
