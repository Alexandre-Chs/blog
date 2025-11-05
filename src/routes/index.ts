import { createFileRoute } from '@tanstack/react-router'
import BlogHomePage from '@/features/blog/views/BlogHomePage'

export const Route = createFileRoute('/')({
  component: BlogHomePage,
})
