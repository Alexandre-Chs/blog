import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, isNotNull } from 'drizzle-orm'
import { articles, user } from '@/db/schema'
import { db } from '@/index'

export const articlesPublished = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db
    .select({
      article: articles,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.status, 'published'), isNotNull(articles.publishedAt)))
    .orderBy(desc(articles.updatedAt))

  return rows.map((row) => row.article)
})
