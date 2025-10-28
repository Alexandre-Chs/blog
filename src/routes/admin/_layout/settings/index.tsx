import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/settings/"!</div>
}
