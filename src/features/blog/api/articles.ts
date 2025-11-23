import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { articles, user } from '@/db/schema'
import { db } from '@/index'

const articleBySlugSchema = z.object({
  slug: z.string().min(1),
})

export const articleBySlug = createServerFn({ method: 'GET' })
  .inputValidator(articleBySlugSchema)
  .handler(async ({ data }) => {
    const rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        content: articles.content,
        slug: articles.slug,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        publishedAt: articles.publishedAt,
        readTime: articles.readTime,
        views: articles.views,
        authorName: user.name,
      })
      .from(articles)
      .leftJoin(user, eq(articles.authorId, user.id))
      .where(eq(articles.slug, data.slug))
      .limit(1)

    const article = rows.at(0)

    if (!article) {
      return null
    }

    return article
  })
