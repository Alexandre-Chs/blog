import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth/auth'

export const getSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const sessionUser = await auth.api.getSession({
      headers: getRequestHeaders(),
    })

    if (!sessionUser) return null

    return sessionUser
  },
)
