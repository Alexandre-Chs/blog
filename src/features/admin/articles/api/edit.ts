import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { articles, articlesToMedias, medias } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articleByIdSchema = z.object({
  articleId: z.uuid(),
})

const articleUpdateSchema = z.object({
  articleId: z.uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const articleById = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .inputValidator(articleByIdSchema)
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
      })
      .from(articlesToMedias)
      .leftJoin(medias, eq(medias.id, articlesToMedias.mediaId))
      .where(and(eq(articlesToMedias.articleId, articleId), eq(articlesToMedias.role, 'thumbnail')))

    let thumbnail = null

    if (media.length > 0 && media[0].key) {
      thumbnail = {
        id: media[0].id,
        key: media[0].key,
        mimetype: media[0].mimetype,
        size: media[0].size,
        role: media[0].role,
      }
    }

    return {
      article,
      thumbnail,
    }
  })

export const articleUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleUpdateSchema)
  .handler(async ({ data }) => {
    const { articleId, title, content } = data

    const [updatedArticle] = await db
      .update(articles)
      .set({
        title: title.trim(),
        content,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId))
      .returning()

    return { success: true, article: updatedArticle }
  })
