import { createFileRoute } from '@tanstack/react-router'
import SettingsAiPage from '@/features/admin/settings/ai/SettingsAiPage'

export const Route = createFileRoute('/admin/_layout/settings/ai/')({
  component: SettingsAiPage,
})
