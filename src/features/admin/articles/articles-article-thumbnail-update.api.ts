import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { articlesToMedias, medias } from '@/db/schema'

const articlesArticleThumbnailAltUpdateSchema = z.object({
  articleId: z.uuid(),
  alt: z.string(),
})

export const articlesArticleThumbnailAltUpdate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleThumbnailAltUpdateSchema)
  .handler(async ({ data }) => {
    const articleToMedia = await db
      .select({ mediaId: articlesToMedias.mediaId })
      .from(articlesToMedias)
      .where(and(eq(articlesToMedias.articleId, data.articleId), eq(articlesToMedias.role, 'thumbnail')))
      .limit(1)

    if (!articleToMedia.length) throw new Error('No thumbnail found for this article.')

    await db.update(medias).set({ alt: data.alt }).where(eq(medias.id, articleToMedia[0].mediaId))

    return { success: true }
  })

const articlesArticleThumbnailsGallerySchema = z.object({
  articleId: z.string(),
  key: z.string(),
})

export const articlesArticleThumbnailsGallery = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleThumbnailsGallerySchema)
  .handler(async ({ data }) => {
    const mediaId = await db.select({ id: medias.id }).from(medias).where(eq(medias.key, data.key)).limit(1)

    if (mediaId.length === 0) throw new Error('An error occurred while selecting the media from gallery.')

    await db.transaction(async (tx) => {
      // prevent duplicate thumbnails
      await tx
        .delete(articlesToMedias)
        .where(and(eq(articlesToMedias.articleId, data.articleId), eq(articlesToMedias.role, 'thumbnail')))

      await tx.insert(articlesToMedias).values({
        articleId: data.articleId,
        mediaId: mediaId[0].id,
        role: 'thumbnail',
      })
    })
  })
