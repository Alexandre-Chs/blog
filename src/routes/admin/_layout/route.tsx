import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getSessionUser } from '@/features/auth/api/auth'

export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async () => {
    const session = await getSessionUser()
    if (!session?.user) {
      throw redirect({ to: '/admin/login', replace: true })
    }
    return session.user
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
