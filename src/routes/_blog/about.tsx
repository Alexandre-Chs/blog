import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_blog/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about"!</div>
}
