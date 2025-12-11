import { createFileRoute } from '@tanstack/react-router'
import GalleryPage from '@/features/admin/settings/gallery/view/GalleryPage'

export const Route = createFileRoute('/admin/_layout/settings/gallery/')({
  component: GalleryPage,
})
