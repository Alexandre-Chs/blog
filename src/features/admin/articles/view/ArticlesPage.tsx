import { useQuery } from '@tanstack/react-query'
import { articlesList } from '../api/list'

export default function ArticlesPage() {
  const { data: articles } = useQuery({
    queryKey: ['todos'],
    queryFn: articlesList,
  })

  if (!articles) {
    return <div className="max-w-5xl mx-auto px-6 py-10">No articles find.</div>
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 w-full">
      <div className="border border-border/70 rounded-xl overflow-hidden">
        {articles.map((article, idx) => {
          const isLast = idx === articles.length - 1

          return (
            <div key={article.id} className={`${!isLast ? 'border-b border-border/70' : ''}`}>
              <article className="flex gap-4 px-4 py-5 sm:px-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md bg-muted text-base font-semibold text-muted-foreground">
                  {article.title.trim().charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="truncate text-base font-semibold text-foreground">{article.title.trim()}</div>
                    {article.status ? (
                      <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                        {article.status}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-sm">{article.authorName ? article.authorName : 'Author unknown'}</span>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}
