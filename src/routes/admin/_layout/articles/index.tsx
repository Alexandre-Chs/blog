import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/articles/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/articles/"!</div>
}
