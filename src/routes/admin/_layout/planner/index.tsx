import PlannerPage from '@/features/admin/planner/PlannerPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/planner/')({
  component: PlannerPage,
})
