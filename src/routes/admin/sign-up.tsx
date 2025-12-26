import { createFileRoute, redirect } from '@tanstack/react-router'
import SignUpPage from '@/features/auth/AuthSignUpPage'
import { authSessionUserRead } from '@/features/auth/auth-session-user-read.api'
import { authUserExists } from '@/features/auth/auth-user-exists.api'

export const Route = createFileRoute('/admin/sign-up')({
  beforeLoad: async () => {
    const [existUser, session] = await Promise.all([authUserExists(), authSessionUserRead()])

    if (session?.user && session.user.role === 'admin') throw redirect({ to: '/admin', replace: true })
    else if (session?.user && session.user.role !== 'admin') throw redirect({ to: '/', replace: true })

    if (existUser) throw redirect({ to: '/admin/login', replace: true })
  },
  component: SignUpPage,
})
