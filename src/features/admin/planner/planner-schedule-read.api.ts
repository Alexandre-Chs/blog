import { ideas, settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { validateSettings } from '@/zod/settings'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'

export const plannerScheduleRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const settingsPlanner = await db.select().from(settings).where(eq(settings.key, 'planner')).limit(1)

    if (!settingsPlanner.length) {
      return {
        publicationDays: [],
        publicationHour: 0,
      }
    }

    const validData = validateSettings('planner', settingsPlanner[0]?.value)

    return {
      publicationDays: validData.publicationDays,
      publicationHour: validData.publicationHour,
    }
  })

export const plannerIdeasRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.select().from(ideas).orderBy(desc(ideas.createdAt))
  })
