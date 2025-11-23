import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, isNotNull, lte } from 'drizzle-orm'
import { articles, user } from '@/db/schema'
import { db } from '@/index'

export const articlesPublished = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db
    .select({
      article: articles,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(isNotNull(articles.publishedAt), lte(articles.publishedAt, new Date())))
    .orderBy(desc(articles.publishedAt))

  return rows.map((row) => row.article)
})
