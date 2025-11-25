import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, desc, eq, gt, isNotNull, isNull, lte, sql } from 'drizzle-orm'
import { articles, articlesToMedias, medias, user } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articlesListSchema = z.object({
  status: z.enum(['published', 'draft', 'scheduled']),
})

export const articlesList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .inputValidator(articlesListSchema)
  .handler(async ({ data }) => {
    const now = new Date()

    const whereCondition =
      data.status === 'draft'
        ? isNull(articles.publishedAt)
        : data.status === 'scheduled'
          ? and(isNotNull(articles.publishedAt), gt(articles.publishedAt, now))
          : and(isNotNull(articles.publishedAt), lte(articles.publishedAt, now))

    const rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        thumbnailKey: medias.key,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        publishedAt: articles.publishedAt,
        authorName: user.name,
      })
      .from(articles)
      .leftJoin(user, eq(articles.authorId, user.id))
      .leftJoin(
        articlesToMedias,
        and(eq(articles.id, articlesToMedias.articleId), eq(articlesToMedias.role, 'thumbnail')),
      )
      .leftJoin(medias, eq(articlesToMedias.mediaId, medias.id))
      .where(whereCondition)
      .orderBy(desc(articles.publishedAt))

    return rows.map((row) => ({
      ...row,
      thumbnailUrl: row.thumbnailKey ? `${process.env.S3_PUBLIC_BASE_URL}${row.thumbnailKey}` : null,
    }))
  })

export const articlesListCount = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const now = new Date()

    const [row] = await db
      .select({
        draft: sql<number>`SUM(CASE WHEN ${articles.publishedAt} IS NULL THEN 1 ELSE 0 END)::int`,
        scheduled: sql<number>`SUM(CASE WHEN ${articles.publishedAt} IS NOT NULL AND ${articles.publishedAt} > ${now} THEN 1 ELSE 0 END)::int`,
        published: sql<number>`SUM(CASE WHEN ${articles.publishedAt} IS NOT NULL AND ${articles.publishedAt} <= ${now} THEN 1 ELSE 0 END)::int`,
      })
      .from(articles)

    return row
  })
