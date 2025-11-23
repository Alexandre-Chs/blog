import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import ArticleNotFound from '@/features/blog/components/ArticleNotFound'
import Article from '@/features/blog/components/Article'
import { articleBySlug } from '@/features/blog/api/articles'

type ArticlePageProps = {
  slug: string
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  const articleBySlugFn = useServerFn(articleBySlug)
  const {
    data: article,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleBySlugFn({ data: { slug } }),
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

  if (isError || !article) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <ArticleNotFound />
      </div>
    )
  }

  return (
    <Article
      content={{
        variant: 'article',
        ...article,
      }}
    />
  )
}
