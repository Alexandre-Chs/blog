import { createFileRoute } from '@tanstack/react-router'
import ArticlePage from '@/features/blog/views/ArticlePage'

export const Route = createFileRoute('/_blog/$slug/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()

  return <ArticlePage slug={slug} />
}
