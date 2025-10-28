import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/features/auth/login'

export const Route = createFileRoute('/admin/login')({
  component: Login,
})
