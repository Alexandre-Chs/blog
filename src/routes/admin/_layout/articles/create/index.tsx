import { createFileRoute, redirect } from '@tanstack/react-router'
import { articleCreate } from '@/features/admin/articles/api/create'

export const Route = createFileRoute('/admin/_layout/articles/create/')({
  loader: async () => {
    const { article } = await articleCreate({ data: { articleId: crypto.randomUUID() } })

    throw redirect({
      to: '/admin/articles/$articleId/edit',
      params: { articleId: article.id },
    })
  },
  component: () => null,
})
