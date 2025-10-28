import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/calendar/"!</div>
}
