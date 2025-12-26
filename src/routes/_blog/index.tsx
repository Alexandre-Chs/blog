import { createFileRoute } from '@tanstack/react-router'
import BlogHomePage from '@/features/blog/BlogHomePage'

export const Route = createFileRoute('/_blog/')({
  component: BlogHomePage,
})
