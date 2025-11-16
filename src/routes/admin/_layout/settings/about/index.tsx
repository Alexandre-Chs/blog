import { createFileRoute } from '@tanstack/react-router'
import SettingsAboutPage from '@/features/admin/settings/about/view/SettingsAbout'

export const Route = createFileRoute('/admin/_layout/settings/about/')({
  component: SettingsAboutPage,
})
