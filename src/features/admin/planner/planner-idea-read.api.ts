import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { ideas } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const plannerIdeaReadSchema = z.object({
  id: z.string(),
})

export const plannerIdeaRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .inputValidator(plannerIdeaReadSchema)
  .handler(async ({ data }) => {
    const [idea] = await db.select().from(ideas).where(eq(ideas.id, data.id)).limit(1)
    return idea
  })
