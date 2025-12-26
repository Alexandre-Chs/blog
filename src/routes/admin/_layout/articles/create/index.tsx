import { createFileRoute, redirect } from '@tanstack/react-router'
import { articlesArticleCreate } from '@/features/admin/articles/articles-article-create.api'

export const Route = createFileRoute('/admin/_layout/articles/create/')({
  loader: async () => {
    const { article } = await articlesArticleCreate({ data: { articleId: crypto.randomUUID() } })

    throw redirect({
      to: '/admin/articles/$articleId/edit',
      params: { articleId: article.id },
    })
  },
  component: () => null,
})
