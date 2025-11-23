import { createFileRoute } from '@tanstack/react-router'
import ArticlesCreatePage from '@/features/admin/articles/view/ArticlesCreatePage'
import { articleCreate } from '@/features/admin/articles/api/create'

export const Route = createFileRoute('/admin/_layout/articles/create/')({
  loader: async () => {
    const { article } = await articleCreate({ data: { articleId: crypto.randomUUID() } })
    return { articleId: article.id }
  },
  component: () => {
    const { articleId } = Route.useLoaderData()
    return <ArticlesCreatePage articleId={articleId} />
  },
})
