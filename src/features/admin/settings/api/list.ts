import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { validateSettings } from '@/zod/settings'

export const settingsGeneralformSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().min(0),
})

export const settingsGeneralList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const res = await db.select().from(settings).where(eq(settings.key, 'general')).limit(1)

    const row = res[0]
    const validValue = validateSettings('general', row.value)

    return { key: 'general', value: validValue }
  })

export const settingsGeneralUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsGeneralformSchema)
  .handler(async ({ data }) => {
    const { name, tagline } = data

    const validName = validateSettings('general', { name, tagline })

    await db
      .insert(settings)
      .values({
        key: 'general',
        value: validName,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: validName },
      })

    return { success: true }
  })
