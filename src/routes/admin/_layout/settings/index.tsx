import { createFileRoute } from '@tanstack/react-router'
import SettingsGeneralPage from '@/features/admin/settings/general/SettingsGeneralPage'

export const Route = createFileRoute('/admin/_layout/settings/')({
  component: SettingsGeneralPage,
})
