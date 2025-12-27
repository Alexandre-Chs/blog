import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { validateSettings } from '@/zod/settings'
import { settings } from '@/db/schema'

export const settingsAiUpdateSchema = z.object({
  context: z.string(),
  defaultModel: z.string(),
})

export const settingsAiUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsAiUpdateSchema)
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
