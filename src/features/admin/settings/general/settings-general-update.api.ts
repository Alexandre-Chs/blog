import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { validateSettings } from '@/zod/settings'

export const settingsGeneralUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().min(0),
})

export const settingsGeneralUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsGeneralUpdateSchema)
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

const settingsGeneralFaviconUpdateSchema = z.object({
  key: z.string().nullable(),
  mimetype: z.string().nullable(),
})

export const settingsGeneralFaviconUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsGeneralFaviconUpdateSchema)
  .handler(async ({ data }) => {
    const baseUrl = process.env.S3_PUBLIC_BASE_URL
    const { key, mimetype } = data

    if (!key || !mimetype) {
      await db.delete(settings).where(eq(settings.key, 'favicon'))
      return { success: true }
    }

    await db
      .insert(settings)
      .values({
        key: 'favicon',
        value: { key, mimetype, url: `${baseUrl}${key}` },
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: { key, mimetype, url: `${baseUrl}${key}` } },
      })

    return { success: true }
  })
