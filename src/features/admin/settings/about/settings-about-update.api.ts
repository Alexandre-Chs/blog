import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { settings } from '@/db/schema'
import { validateSettings } from '@/zod/settings'

const settingsAboutUpdateSchema = z.object({
  content: z.string().min(1, 'Content is required'),
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
