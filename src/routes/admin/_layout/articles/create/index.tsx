import { createFileRoute } from '@tanstack/react-router'
import ArticlesCreatePage from '@/features/admin/articles/view/ArticlesCreatePage'

export const Route = createFileRoute('/admin/_layout/articles/create/')({
  component: ArticlesCreatePage,
})
