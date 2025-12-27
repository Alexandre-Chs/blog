import { createServerFn } from '@tanstack/react-start'
import { inArray } from 'drizzle-orm'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { validateSettings } from '@/zod/settings'

export const settingsGeneralRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, ['general', 'favicon']))

    const generalRow = rows.find((r) => r.key === 'general')
    const faviconRow = rows.find((r) => r.key === 'favicon')

    const validGeneralSettings = generalRow ? validateSettings('general', generalRow.value) : { name: '', tagline: '' }

    const validFaviconSettings = faviconRow
      ? validateSettings('favicon', faviconRow.value)
      : { url: null, key: null, mimetype: null }

    return { general: validGeneralSettings, favicon: validFaviconSettings }
  })
