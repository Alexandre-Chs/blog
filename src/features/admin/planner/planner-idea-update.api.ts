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
    subject: z.string().min(1),
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
        subject: ideaData.subject,
        context: ideaData.context,
      })
      .where(eq(ideas.id, id))
      .returning()

    return { success: true, idea: updatedIdea }
  })

const plannerIdeaStatusUpdateSchema = z.object({
  id: z.string(),
  status: z.enum(['draft', 'failed', 'published', 'generating']),
})

export const plannerIdeaStatusUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(plannerIdeaStatusUpdateSchema)
  .handler(async ({ data }) => {
    const { id, status } = data

    console.log('le id', id)

    const [updatedIdea] = await db
      .update(ideas)
      .set({
        status,
      })
      .where(eq(ideas.id, id))
      .returning()

    return { success: true, idea: updatedIdea }
  })
