import { settings } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { validateSettings } from '@/zod/settings'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const plannerScheduleUpdateSchema = z.object({
  publicationDays: z.array(z.number()),
  publicationHour: z.number().min(0).max(23),
})

export const plannerScheduleUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(plannerScheduleUpdateSchema)
  .handler(async ({ data }) => {
    const { publicationDays, publicationHour } = data
    const validData = validateSettings('planner', { publicationDays, publicationHour })

    await db
      .insert(settings)
      .values({
        key: 'planner',
        value: { publicationDays: validData.publicationDays, publicationHour: validData.publicationHour },
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: { publicationDays: validData.publicationDays, publicationHour: validData.publicationHour } },
      })
  })
