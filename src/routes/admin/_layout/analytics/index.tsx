import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/features/admin/analytics/AnalyticsPage'

export const Route = createFileRoute('/admin/_layout/analytics/')({
  component: AnalyticsPage,
})
