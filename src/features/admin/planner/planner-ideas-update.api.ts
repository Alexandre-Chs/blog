import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { ideas } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const plannerIdeasUpdateSchema = z.object({
  title: z.string().optional(),
  context: z.string().min(1),
})

export const plannerIdeasUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(plannerIdeasUpdateSchema)
  .handler(async ({ data }) => {
    const { title, context } = data

    const [newIdea] = await db
      .insert(ideas)
      .values({
        id: crypto.randomUUID(),
        title: title || null,
        context,
      })
      .returning()

    return { success: true, idea: newIdea }
  })
