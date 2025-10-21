import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '@/features/dashboard/view/DashboardPage'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})
