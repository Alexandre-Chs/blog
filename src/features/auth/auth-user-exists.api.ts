import { createServerFn } from '@tanstack/react-start'
import { db } from '@/index'
import * as schema from '@/db/schema'

export const authUserExists = createServerFn({ method: 'GET' }).handler(async () => {
  const existing = await db.select({ id: schema.user.id }).from(schema.user).limit(1)
  return existing.length > 0
})
