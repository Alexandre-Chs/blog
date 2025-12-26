import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthLoginPage } from '@/features/auth/AuthLoginPage'
import { authSessionUserRead } from '@/features/auth/auth-session-user-read.api'
import { authUserExists } from '@/features/auth/auth-user-exists.api'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async () => {
    const [exists, session] = await Promise.all([authUserExists(), authSessionUserRead()])

    if (session?.user && session.user.role === 'admin') throw redirect({ to: '/admin', replace: true })
    else if (session?.user && session.user.role !== 'admin') throw redirect({ to: '/', replace: true })

    if (!exists) throw redirect({ to: '/admin/sign-up', replace: true })

    return { authUserExists: exists }
  },
  loader: async () => {
    const existUser = await authUserExists()
    return { existUser }
  },
  component: function RouteComponent() {
    const { existUser } = Route.useLoaderData()
    return <AuthLoginPage existUser={existUser} />
  },
})
