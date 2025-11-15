import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articleCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export const articleCreate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleCreateSchema)
  .handler(async ({ data, context }) => {
    const user = context.adminUser

    const [article] = await db
      .insert(articles)
      .values({
        id: crypto.randomUUID(),
        title: data.title,
        content: data.content,
        status: 'published',
        authorId: user.id,
        slug: data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
        publishedAt: new Date(),
      })
      .returning()

    return { success: true, article }
  })
