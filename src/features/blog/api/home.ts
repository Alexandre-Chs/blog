import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, isNotNull, lte } from 'drizzle-orm'
import { articles, articlesToMedias, medias, user } from '@/db/schema'
import { db } from '@/index'

export const articlesPublished = createServerFn({ method: 'GET' }).handler(async () => {
  const imageBaseUrl = process.env.S3_PUBLIC_BASE_URL
  const articlesRows = await db
    .select({
      article: articles,
      media: medias,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .leftJoin(
      articlesToMedias,
      and(eq(articles.id, articlesToMedias.articleId), eq(articlesToMedias.role, 'thumbnail')),
    )
    .leftJoin(medias, eq(articlesToMedias.mediaId, medias.id))
    .where(and(isNotNull(articles.publishedAt), lte(articles.publishedAt, new Date())))
    .orderBy(desc(articles.publishedAt))

  return articlesRows.map(({ article, media }) => ({
    ...article,
    thumbnail: {
      thumbnailUrl: media?.key ? `${imageBaseUrl}${media.key}` : null,
      ...media,
    },
  }))
})
