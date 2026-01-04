import { createServerFn } from '@tanstack/react-start'
import { desc, eq, or } from 'drizzle-orm'
import { ideas } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

export const plannerIdeasRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db
      .select()
      .from(ideas)
      .where(or(eq(ideas.status, 'draft'), eq(ideas.status, 'failed')))
      .orderBy(desc(ideas.createdAt))
  })
