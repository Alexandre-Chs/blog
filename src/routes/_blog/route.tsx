import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0">
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
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="shrink-0">
        <div
          className="mx-auto max-w-screen-lg px-6 py-10 text-center text-sm text-gray-500"
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          © 2025 BlogAI — Built with ❤️
        </div>
      </footer>
    </div>
  )
}
