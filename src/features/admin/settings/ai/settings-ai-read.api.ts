import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { validateSettings } from '@/zod/settings'
import { settings } from '@/db/schema'

export const settingsAiRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const row = await db.select().from(settings).where(eq(settings.key, 'ai')).limit(1)

    const validAiSettings = row.length ? validateSettings('ai', row[0].value) : { context: '', defaultModel: '' }

    return validAiSettings
  })
