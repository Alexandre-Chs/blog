import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, isNotNull } from 'drizzle-orm'
import { articles, user } from '@/db/schema'
import { db } from '@/index'

export const articlesPublished = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      slug: articles.slug,
      status: articles.status,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      publishedAt: articles.publishedAt,
      authorName: user.name,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.status, 'published'), isNotNull(articles.publishedAt)))
    .orderBy(desc(articles.updatedAt))

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    slug: row.slug,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    publishedAt: row.publishedAt!.toISOString(),
    authorName: row.authorName ?? null,
  }))
})
