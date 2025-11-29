import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { articles, articlesToMedias, medias } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'
import { generateUniqueSlug } from '@/utils/slug'

const articleByIdSchema = z.object({
  articleId: z.uuid(),
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

const articleUpdateSchema = z.object({
  articleId: z.uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  publishedAt: z.coerce.date().nullable(),
})

export const articleUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleUpdateSchema)
  .handler(async ({ data }) => {
    const { articleId, title, content } = data
    const trimmedTitle = title.trim()
    const slug = await generateUniqueSlug(trimmedTitle)

    const [updatedArticle] = await db
      .update(articles)
      .set({
        title: trimmedTitle,
        slug,
        content,
        updatedAt: new Date(),
        publishedAt: data.publishedAt ?? null,
      })
      .where(eq(articles.id, articleId))
      .returning()

    return { success: true, article: updatedArticle }
  })

export const articleDeletePublishedAt = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ articleId: z.uuid() }))
  .handler(async ({ data }) => {
    const { articleId } = data

    const [updatedArticle] = await db
      .update(articles)
      .set({ publishedAt: null })
      .where(eq(articles.id, articleId))
      .returning()

    return { success: true, article: updatedArticle }
  })
