import { articles, articlesToMedias, medias } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

const articlesArticleReadSchema = z.object({
  articleId: z.uuid(),
})

export const articlesArticleRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleReadSchema)
  .handler(async ({ data }) => {
    const articleId = data.articleId

    const [article] = await db.select().from(articles).where(eq(articles.id, articleId))

    const media = await db
      .select({
        id: medias.id,
        key: medias.key,
        mimetype: medias.mimetype,
        size: medias.size,
        role: articlesToMedias.role,
        alt: medias.alt,
      })
      .from(articlesToMedias)
      .leftJoin(medias, eq(medias.id, articlesToMedias.mediaId))
      .where(and(eq(articlesToMedias.articleId, articleId), eq(articlesToMedias.role, 'thumbnail')))

    let thumbnail = null

    if (media.length > 0 && media[0].key) {
      thumbnail = {
        id: media[0].id,
        key: media[0].key,
        url: `${process.env.S3_PUBLIC_BASE_URL}${media[0].key}`,
        mimetype: media[0].mimetype,
        size: media[0].size,
        role: media[0].role,
        alt: media[0].alt,
      }
    }

    return {
      article,
      thumbnail,
    }
  })
