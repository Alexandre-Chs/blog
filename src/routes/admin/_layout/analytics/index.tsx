import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/features/admin/analytics/view/AnalyticsPage'

export const Route = createFileRoute('/admin/_layout/analytics/')({
  component: AnalyticsPage,
})
