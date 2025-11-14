import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth/auth'
import { db } from '@/index'
import * as schema from '@/db/schema'

export const getSessionUser = createServerFn({ method: 'GET' }).handler(async () => {
  const sessionUser = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (!sessionUser) return null

  return sessionUser
})

export const existingUser = createServerFn({ method: 'GET' }).handler(async () => {
  const existing = await db.select({ id: schema.user.id }).from(schema.user).limit(1)
  return existing.length > 0
})
