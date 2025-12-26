import { createFileRoute } from '@tanstack/react-router'
import AboutPage from '@/features/blog/BlogAboutPage'

export const Route = createFileRoute('/_blog/about')({
  component: AboutPage,
})
