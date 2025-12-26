import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import ArticleNotFound from '@/features/blog/BlogArticleNotFound'
import Article from '@/features/blog/BlogArticle'
import { blogArticleRead } from '@/features/blog/blog-article-read.api'

type ArticlePageProps = {
  slug: string
}

export default function BlogArticlePage({ slug }: ArticlePageProps) {
  const articleBySlugFn = useServerFn(blogArticleRead)
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
