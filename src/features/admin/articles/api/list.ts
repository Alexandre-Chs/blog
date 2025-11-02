import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { articles, user } from '@/db/schema'
import { db } from '@/index'

export const articlesList = createServerFn({ method: 'GET' }).handler(async () => {
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
