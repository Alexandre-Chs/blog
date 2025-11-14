import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '@/features/auth/login'
import { existingUser, getSessionUser } from '@/features/auth/api/auth'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async () => {
    const [exists, session] = await Promise.all([existingUser(), getSessionUser()])

    if (session?.user && session.user.role === 'admin') throw redirect({ to: '/admin', replace: true })
    else if (session?.user && session.user.role !== 'admin') throw redirect({ to: '/', replace: true })

    if (!exists) throw redirect({ to: '/admin/sign-up', replace: true })

    return { existingUser: exists }
  },
  loader: async () => {
    const existUser = await existingUser()
    return { existUser }
  },
  component: function RouteComponent() {
    const { existUser } = Route.useLoaderData()
    return <Login existUser={existUser} />
  },
})
