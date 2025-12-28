import { Link, useRouterState } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import {
  Calendar,
  FileText,
  FilePlus,
  Home,
  LineChart,
  Settings,
  Image as ImageIcon,
  Bot,
  BookA,
  CalendarClock,
} from 'lucide-react'
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
      items: [{ title: 'Home', url: '/admin', isActive: true, icon: Home }],
    },
    {
      title: 'Articles',
      items: [
        { title: 'All Articles', url: '/admin/articles', icon: FileText },
        { title: 'Create article', url: '/admin/articles/create', icon: FilePlus },
      ],
    },
    {
      title: 'Schedule',
      items: [
        { title: 'Planner', url: '/admin/planner', icon: CalendarClock },
        { title: 'Calendar', url: '/admin/calendar', icon: Calendar },
      ],
    },
    {
      title: 'Analytics',
      items: [{ title: 'Overview', url: '/admin/analytics', icon: LineChart }],
    },
    {
      title: 'Settings',
      items: [
        { title: 'General', url: '/admin/settings', icon: Settings },
        { title: 'Gallery', url: '/admin/settings/gallery', icon: ImageIcon },
        { title: 'AI', url: '/admin/settings/ai', icon: Bot },
        { title: 'About page', url: '/admin/settings/about', icon: BookA },
      ],
    },
  ],
}
type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  projectName: string
}

export function AppSidebar({ projectName, ...props }: AppSidebarProps) {
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
          <span className="text-lg font-semibold">{projectName}</span>
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
                      <Link to={itm.url} preload={itm.title === 'Create article' ? false : 'intent'}>
                        <itm.icon className="h-4 w-4" />
                        {itm.title}
                      </Link>
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
