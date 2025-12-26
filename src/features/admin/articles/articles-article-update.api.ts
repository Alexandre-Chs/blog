import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { generateUniqueSlug } from '@/utils/slug'

const articlesArticleUpdateSchema = z.object({
  articleId: z.uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  publishedAt: z.coerce.date().nullable(),
})

export const articlesArticleUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleUpdateSchema)
  .handler(async ({ data }) => {
    const { articleId, title, content } = data
    const trimmedTitle = title.trim()
    const slug = await generateUniqueSlug(trimmedTitle)

    const [updatedArticle] = await db
      .update(articles)
      .set({
        title: trimmedTitle,
        slug,
        content,
        updatedAt: new Date(),
        publishedAt: data.publishedAt ?? null,
      })
      .where(eq(articles.id, articleId))
      .returning()

    return { success: true, article: updatedArticle }
  })
