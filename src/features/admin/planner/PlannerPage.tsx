import NavigationName from '@/components/ui/navigation-name'
import { PlannerSchedule } from './PlannerSchedule'
import { PlannerIdeas } from './PlannerIdeas'

export default function PlannerPage() {
  return (
    <>
      <NavigationName name="Planner" subtitle="Manage your automatic article publication queue" />

      <div className="max-w-5xl mx-auto w-full space-y-12 px-4">
        <PlannerSchedule />
        <PlannerIdeas />
      </div>
    </>
  )
}
