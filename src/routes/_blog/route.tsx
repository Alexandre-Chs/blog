import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { settingsGeneralListBlog } from '@/features/blog/api/settings'

export const Route = createFileRoute('/_blog')({
  beforeLoad: async () => {
    // safe for public
    const settingsGeneral = await settingsGeneralListBlog()

    return { ...settingsGeneral?.value }
  },

  head: ({ match }) => {
    const projectName = match.context.name
    return {
      meta: [
        {
          title: 'Blog - ' + projectName,
        },
        {
          name: 'description',
          content: 'A blog about ' + projectName,
        },
      ],
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { name, tagline } = Route.useRouteContext()

  return (
    <div className="flex min-h-screen flex-col px-8 lg:px-0">
      <div className="mx-auto w-full max-w-5xl flex min-h-screen flex-col">
        <header className="shrink-0">
          <div className="flex w-full items-center justify-between py-6">
            <Link
              to="/"
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {name}
            </Link>
            {tagline && tagline.trim().length > 0 && (
              <div className="text-center md:text-left text-lg mt-5 md:pl-8">{tagline}</div>
            )}
          </div>
        </header>
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>

      <footer className="shrink-0 bg-gray-50 w-full rounded-t-4xl">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-gray-900 hover:text-gray-600"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {name}
            </Link>
          </div>
          <div className="mt-8 md:mt-0 flex flex-col md:flex-row gap-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Company
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
