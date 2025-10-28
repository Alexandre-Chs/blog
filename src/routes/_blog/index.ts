import { createFileRoute } from '@tanstack/react-router'
import BlogPage from '@/features/blog/BlogPage'

export const Route = createFileRoute('/_blog/')({
  component: BlogPage,
})
