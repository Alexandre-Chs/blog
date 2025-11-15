import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth/auth'

export const adminMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (!session?.user) throw new Error('Unauthorized')

  if (session.user.role !== 'admin') throw new Error('Forbidden')

  return next({
    context: {
      adminUser: session.user,
    },
  })
})
