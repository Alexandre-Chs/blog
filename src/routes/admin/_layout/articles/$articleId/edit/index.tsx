import { createFileRoute } from '@tanstack/react-router'
import ArticleEditPage from '@/features/admin/articles/view/ArticleEditPage'

export const Route = createFileRoute('/admin/_layout/articles/$articleId/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { articleId } = Route.useParams()

  return <ArticleEditPage articleId={articleId} />
}
