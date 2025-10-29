import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  versions: ['1.0.0'],
  navMain: [
    {
      title: 'Dashboard',
      items: [{ title: 'Overview', url: '/admin', isActive: true }],
    },
    {
      title: 'Articles',
      items: [
        { title: 'All Articles', url: '/admin/articles' },
        { title: 'Create article', url: '/admin/articles/create' },
      ],
    },
    {
      title: 'Schedule',
      items: [{ title: 'Calendar', url: '/admin/calendar' }],
    },
    {
      title: 'Settings',
      items: [{ title: 'General', url: '/admin/settings' }],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routerState = useRouterState()

  const handleRouteActive = (to: string) => {
    if (to === routerState.location.pathname) return true
    else return false
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/admin" className="flex items-center gap-x-2">
          <img src="/logo.png" alt="Logo" width={40} />
          <span className="text-lg font-semibold">Blog AI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((itm) => (
                  <SidebarMenuItem key={itm.title}>
                    <SidebarMenuButton asChild isActive={handleRouteActive(itm.url)}>
                      <Link to={itm.url}>{itm.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
