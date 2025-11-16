import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { settings } from '@/db/schema'
import { validateSettings } from '@/zod/settings'

const settingsAboutUpdateSchema = z.object({
  content: z.string().min(1, 'Content is required'),
})

export const settingsAboutList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const raw = await db.select().from(settings).where(eq(settings.key, 'about')).limit(1)

    const row = raw[0]
    if (raw.length === 0) return { key: 'about', value: { content: '' } }

    const validValue = validateSettings('about', row.value)

    return { key: 'about', value: validValue }
  })

export const settingsAboutUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsAboutUpdateSchema)
  .handler(async ({ data }) => {
    const { content } = data

    const validContent = validateSettings('about', { content })

    await db
      .insert(settings)
      .values({
        key: 'about',
        value: validContent,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: validContent },
      })
  })
