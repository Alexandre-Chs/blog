import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { articles } from '@/db/schema'
import { db } from '@/index'

const articleByIdSchema = z.object({
  articleId: z.uuid(),
})

const articleUpdateSchema = z.object({
  articleId: z.uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const articleById = createServerFn({ method: 'GET' })
  .inputValidator(articleByIdSchema)
  .handler(async ({ data }) => {
    try {
      const articleId = data.articleId

      const article = await db.query.articles.findFirst({
        where: eq(articles.id, articleId),
      })

      return article
    } catch (err) {
      throw new Error('Failed to fetch article', err as any)
    }
  })

export const articleUpdate = createServerFn({ method: 'POST' })
  .inputValidator(articleUpdateSchema)
  .handler(async ({ data }) => {
    try {
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
    } catch (err) {
      throw new Error('Failed to update article')
    }
  })
