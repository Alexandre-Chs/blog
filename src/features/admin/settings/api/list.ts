import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { validateSettings } from '@/zod/settings'

export const settingsGeneralformSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const settingsGeneralList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const res = await db.select().from(settings).where(eq(settings.key, 'general')).limit(1)

    if (!res[0]) return { name: 'my blog' }

    const row = res[0]
    const validValue = validateSettings('general', row.value)

    return { key: 'general', value: validValue }
  })

export const settingsGeneralUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsGeneralformSchema)
  .handler(async ({ data }) => {
    const { name } = data

    const validName = validateSettings('general', { name })

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
