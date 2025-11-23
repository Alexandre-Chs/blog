import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { articles, articlesToMedias, medias, user } from '@/db/schema'
import { db } from '@/index'

type ArticleRow = typeof articles.$inferSelect
type MediaRow = typeof medias.$inferSelect

type BlogArticle = ArticleRow & {
  authorName: string
  thumbnail?: MediaRow & {
    thumbnailUrl?: string | null
  }
}

const articleBySlugSchema = z.object({
  slug: z.string().min(1),
})

export const articleBySlug = createServerFn({ method: 'GET' })
  .inputValidator(articleBySlugSchema)
  .handler(async ({ data }) => {
    const imageBaseUrl = process.env.S3_PUBLIC_BASE_URL

    const rows = await db
      .select({
        article: articles,
        authorName: user.name,
        media: medias,
      })
      .from(articles)
      .leftJoin(user, eq(articles.authorId, user.id))
      .leftJoin(
        articlesToMedias,
        and(eq(articles.id, articlesToMedias.articleId), eq(articlesToMedias.role, 'thumbnail')),
      )
      .leftJoin(medias, eq(articlesToMedias.mediaId, medias.id))
      .where(eq(articles.slug, data.slug))
      .limit(1)

    const row = rows.at(0)

    if (!row) {
      return null
    }

    const { article, authorName, media } = row

    const base: BlogArticle = {
      ...article,
      authorName: authorName ?? 'Unknown author',
    }

    if (media && media.id) {
      base.thumbnail = {
        ...media,
        thumbnailUrl: media.key ? `${imageBaseUrl}${media.key}` : null,
      }
    }

    return base
  })
