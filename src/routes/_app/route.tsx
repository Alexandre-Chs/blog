import { createFileRoute, redirect } from '@tanstack/react-router'
import DashboardLayoutPage from '@/features/dashboard/view/DashboardLayoutPage'
import { getSessionUser } from '@/features/auth/api/auth'

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const session = await getSessionUser()
    if (!session?.user) {
      throw redirect({
        to: '/login',
      })
    }
    return session.user
  },
  component: DashboardLayoutPage,
})
