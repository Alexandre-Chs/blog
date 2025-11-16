import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { validateSettings } from '@/zod/settings'

export const settingsGeneralListBlog = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.select().from(settings).where(eq(settings.key, 'general')).limit(1)

  if (!res[0]) return null
  const row = res[0]

  const validValue = validateSettings('general', row.value)

  return { key: 'general', value: validValue }
})
