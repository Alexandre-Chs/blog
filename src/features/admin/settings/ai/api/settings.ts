import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { validateSettings } from '@/zod/settings'
import { settings } from '@/db/schema'

export const SettingsAiFormSchema = z.object({
  context: z.string(),
  defaultModel: z.string(),
})

export const settingsAiUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(SettingsAiFormSchema)
  .handler(async ({ data }) => {
    const { context, defaultModel } = data

    const validData = validateSettings('ai', { context, defaultModel })

    await db
      .insert(settings)
      .values({
        key: 'ai',
        value: validData,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: validData },
      })

    return { success: true, context, defaultModel }
  })

export const settingsAiList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const row = await db.select().from(settings).where(eq(settings.key, 'ai')).limit(1)

    const validAiSettings = row.length ? validateSettings('ai', row[0].value) : { context: '', defaultModel: '' }

    return validAiSettings
  })
