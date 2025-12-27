import { createFileRoute } from '@tanstack/react-router'
import SettingsGalleryPage from '@/features/admin/settings/gallery/SettingsGalleryPage'

export const Route = createFileRoute('/admin/_layout/settings/gallery/')({
  component: SettingsGalleryPage,
})
