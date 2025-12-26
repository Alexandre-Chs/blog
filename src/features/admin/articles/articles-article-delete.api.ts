import z from 'zod'
import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articlesArticleDeleteSchema = z.object({
  articleId: z.uuid(),
})

export const articlesArticleDelete = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleDeleteSchema)
  .handler(async ({ data }) => {
    const articleId = data.articleId
    await db.delete(articles).where(eq(articles.id, articleId))

    return { success: true }
  })
