import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articleByIdSchema = z.object({
  articleId: z.uuid(),
})

const articleUpdateSchema = z.object({
  articleId: z.uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const articleById = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .inputValidator(articleByIdSchema)
  .handler(async ({ data }) => {
    const articleId = data.articleId

    const article = await db.query.articles.findFirst({
      where: eq(articles.id, articleId),
    })

    return article
  })

export const articleUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleUpdateSchema)
  .handler(async ({ data }) => {
    const { articleId, title, content } = data

    const [updatedArticle] = await db
      .update(articles)
      .set({
        title: title.trim(),
        content,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId))
      .returning()

    return { success: true, article: updatedArticle }
  })
