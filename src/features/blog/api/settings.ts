import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'

export const settingsGeneralBlogSchema = z.object({
  name: z.string(),
  about: z.string().optional(),
})

export const settingsGeneralListBlog = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.select().from(settings).where(eq(settings.key, 'general')).limit(1)

  if (!res[0]) return null

  const parsed = settingsGeneralBlogSchema.safeParse(res[0].value)
  return parsed.success ? parsed.data : null
})
