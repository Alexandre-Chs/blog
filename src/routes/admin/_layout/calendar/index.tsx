import { createFileRoute } from '@tanstack/react-router'
import NavigationName from '@/components/ui/navigation-name'

export const Route = createFileRoute('/admin/_layout/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <NavigationName name="Calendar" subtitle="Visualize your articles by publication date in a clear calendar view" />
  )
}
