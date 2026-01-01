import { createFileRoute } from '@tanstack/react-router'
import PlannerPage from '@/features/admin/planner/PlannerPage'

export const Route = createFileRoute('/admin/_layout/planner/')({
  component: PlannerPage,
})
