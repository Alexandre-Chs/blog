import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '@/features/admin/settings/view/SettingsPage'

export const Route = createFileRoute('/admin/_layout/settings/')({
  component: SettingsPage,
})
