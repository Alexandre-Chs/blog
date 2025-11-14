import { createFileRoute, redirect } from '@tanstack/react-router'
import SignUpPage from '@/features/auth/sign-up'
import { existingUser, getSessionUser } from '@/features/auth/api/auth'

export const Route = createFileRoute('/admin/sign-up')({
  beforeLoad: async () => {
    const [existUser, session] = await Promise.all([existingUser(), getSessionUser()])

    if (session?.user && session.user.role === 'admin') throw redirect({ to: '/admin', replace: true })
    else if (session?.user && session.user.role !== 'admin') throw redirect({ to: '/', replace: true })

    if (existUser) throw redirect({ to: '/admin/login', replace: true })
  },
  component: SignUpPage,
})
