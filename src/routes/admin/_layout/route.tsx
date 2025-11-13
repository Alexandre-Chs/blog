import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getSessionUser } from '@/features/auth/api/auth'
import { settingsGeneralList } from '@/features/admin/settings/api/list'

export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async () => {
    const session = await getSessionUser()
    if (!session?.user) {
      throw redirect({ to: '/admin/login', replace: true })
    }

    if (session.user.role !== 'admin') {
      throw redirect({ to: '/admin/login', replace: true })
    }

    const settingsGeneral = await settingsGeneralList()

    return {
      user: session.user,
      settings: {
        general: settingsGeneral,
      },
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { settings } = Route.useRouteContext()
  return (
    <SidebarProvider>
      <AppSidebar projectName={settings.general.name} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
