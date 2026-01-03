import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { ideas } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const plannerIdeaCreateSchema = z.object({
  title: z.string().optional(),
  subject: z.string().min(1),
  context: z.string().min(1),
})

export const plannerIdeaCreate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(plannerIdeaCreateSchema)
  .handler(async ({ data }) => {
    const { title, subject, context } = data

    const [newIdea] = await db
      .insert(ideas)
      .values({
        id: crypto.randomUUID(),
        title: title || null,
        subject,
        context,
        status: 'draft',
      })
      .returning()

    return { success: true, idea: newIdea }
  })
