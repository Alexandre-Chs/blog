import { createFileRoute } from '@tanstack/react-router'
import ArticlesPage from '@/features/admin/articles/ArticlesPage'

export const Route = createFileRoute('/admin/_layout/articles/')({
  component: ArticlesPage,
})
