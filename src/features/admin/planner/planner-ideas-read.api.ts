import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { ideas } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

export const plannerIdeasRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    return await db.select().from(ideas).where(eq(ideas.status, 'draft')).orderBy(desc(ideas.createdAt))
  })
