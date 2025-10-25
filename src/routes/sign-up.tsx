import { createFileRoute } from '@tanstack/react-router'
import SignUpPage from '@/features/auth/sign-up'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})
