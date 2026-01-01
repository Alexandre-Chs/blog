import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { ideas } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const plannerIdeaUpdateSchema = z.object({
  id: z.string(),
  data: z.object({
    title: z.string().optional(),
    context: z.string().min(1),
  }),
})

export const plannerIdeaUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(plannerIdeaUpdateSchema)
  .handler(async ({ data }) => {
    const { id, data: ideaData } = data

    const [updatedIdea] = await db
      .update(ideas)
      .set({
        title: ideaData.title || null,
        context: ideaData.context,
      })
      .where(eq(ideas.id, id))
      .returning()

    return { success: true, idea: updatedIdea }
  })
