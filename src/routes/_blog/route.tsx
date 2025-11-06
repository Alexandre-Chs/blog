import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-6">
          <Link to="/" className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            blogai.
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-[#111] transition-colors duration-200 hover:text-[#555]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            About
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
