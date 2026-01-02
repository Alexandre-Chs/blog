import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { ideas } from '@/db/schema'

const plannerIdeaDeleteSchema = z.object({
  ideaId: z.string(),
})

export const plannerIdeaDelete = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(plannerIdeaDeleteSchema)
  .handler(async ({ data }) => {
    const deleteIdea = await db.delete(ideas).where(eq(ideas.id, data.ideaId)).returning()

    if (!deleteIdea.length) throw new Error('Idea not found')

    return { success: true }
  })
