import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { desc, eq, sql } from 'drizzle-orm'
import { articles, user } from '@/db/schema'
import { db } from '@/index'

const articlesListSchema = z.object({
  status: z.enum(['published', 'draft', 'scheduled']),
})

export const articlesList = createServerFn({ method: 'GET' })
  .inputValidator(articlesListSchema)
  .handler(async ({ data }) => {
    const rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        status: articles.status,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        publishedAt: articles.publishedAt,
        authorName: user.name,
      })
      .from(articles)
      .leftJoin(user, eq(articles.authorId, user.id))
      .where(eq(articles.status, data.status))
      .orderBy(desc(articles.updatedAt))

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      authorName: row.authorName ?? null,
    }))
  })

export const articlesListCount = createServerFn({ method: 'GET' }).handler(async () => {
  const counts = await db
    .select({
      status: articles.status,
      count: sql<number>`count(*)::int`,
    })
    .from(articles)
    .groupBy(articles.status)

  const result = {
    published: 0,
    scheduled: 0,
    draft: 0,
  }

  counts.forEach((row) => {
    if (row.status === 'published' || row.status === 'scheduled' || row.status === 'draft') {
      result[row.status] = row.count
    }
  })

  return result
})
