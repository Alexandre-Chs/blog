import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const articlesArticleUnpublish = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ articleId: z.uuid() }))
  .handler(async ({ data }) => {
    const { articleId } = data

    const [updatedArticle] = await db
      .update(articles)
      .set({ publishedAt: null })
      .where(eq(articles.id, articleId))
      .returning()

    return { success: true, article: updatedArticle }
  })
