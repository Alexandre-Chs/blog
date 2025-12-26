import { createFileRoute } from '@tanstack/react-router'
import ArticlesArticleEditPage from '@/features/admin/articles/ArticlesArticleEditPage'

export const Route = createFileRoute('/admin/_layout/articles/$articleId/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { articleId } = Route.useParams()

  return <ArticlesArticleEditPage articleId={articleId} />
}
