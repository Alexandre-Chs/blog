import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articleCreateSchema = z.object({
  articleId: z.uuid(),
})

export const articleCreate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleCreateSchema)
  .handler(async ({ data, context }) => {
    const user = context.adminUser

    const [article] = await db
      .insert(articles)
      .values({
        id: data.articleId,
        title: '',
        content: '',
        authorId: user.id,
        slug: `untitled-${data.articleId}`,
        publishedAt: null,
      })
      .returning()

    return { success: true, article }
  })

const articleUpdateSchema = z.object({
  articleId: z.uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  publishedAt: z.coerce.date().nullable(),
})

export const articleUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleUpdateSchema)
  .handler(async ({ data, context }) => {
    const user = context.adminUser

    const [article] = await db
      .update(articles)
      .set({
        title: data.title,
        content: data.content,
        authorId: user.id,
        slug: data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
        publishedAt: data.publishedAt ?? null,
      })
      .where(eq(articles.id, data.articleId))
      .returning()

    return { success: true, article }
  })
