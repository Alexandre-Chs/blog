import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { settings } from '@/db/schema'
import { validateSettings } from '@/zod/settings'
import { db } from '@/index'

export const settingsAboutListBlog = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.select().from(settings).where(eq(settings.key, 'about')).limit(1)

  if (!res[0]) return null
  const row = res[0]

  const validValue = validateSettings('about', row.value)

  return { key: 'about', value: validValue }
})
