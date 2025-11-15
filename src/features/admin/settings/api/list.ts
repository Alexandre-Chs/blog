import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

export const settingsGeneralformSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const settingsGeneralList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const res = await db.select().from(settings).where(eq(settings.key, 'general')).limit(1)

    if (!res[0]) return { name: 'my blog' }

    const row = res[0]

    const parsed = settingsGeneralformSchema.safeParse(row.value)
    if (!parsed.success) return { name: 'my blog' }

    return parsed.data
  })

export const settingsGeneralUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsGeneralformSchema)
  .handler(async ({ data }) => {
    const { name } = data

    await db
      .insert(settings)
      .values({
        key: 'general',
        value: { name },
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: { name } },
      })

    return { success: true }
  })
