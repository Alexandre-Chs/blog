import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { articlesToMedias, medias } from '@/db/schema'

const thumbnailInsertSchema = z.object({
  articleId: z.uuid(),
  key: z.string(),
  mimetype: z.string(),
  size: z.number().int().positive(),
  alt: z.string().default(''),
})

export const thumbnailInsertDatabase = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(thumbnailInsertSchema)
  .handler(async ({ data }) => {
    await db.transaction(async (tx) => {
      const [media] = await tx
        .insert(medias)
        .values({
          id: crypto.randomUUID(),
          key: data.key,
          mimetype: data.mimetype,
          size: data.size,
        })
        .returning()

      await tx
        .delete(articlesToMedias)
        .where(and(eq(articlesToMedias.articleId, data.articleId), eq(articlesToMedias.role, 'thumbnail')))

      await tx.insert(articlesToMedias).values({
        articleId: data.articleId,
        mediaId: media.id,
        role: 'thumbnail',
      })
    })

    return { success: true }
  })

const thumbnailAltUpdateSchema = z.object({
  articleId: z.uuid(),
  alt: z.string(),
})

export const thumbnailUpdateAlt = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(thumbnailAltUpdateSchema)
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

const thumbnailDeleteDatabaseSchema = z.object({
  articleId: z.string(),
})

export const thumbnailDeleteDatabase = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(thumbnailDeleteDatabaseSchema)
  .handler(async ({ data }) => {
    await db.transaction(async (tx) => {
      const [articleToMedia] = await tx
        .select()
        .from(articlesToMedias)
        .where(and(eq(articlesToMedias.articleId, data.articleId), eq(articlesToMedias.role, 'thumbnail')))
        .limit(1)

      await tx
        .delete(articlesToMedias)
        .where(and(eq(articlesToMedias.articleId, data.articleId), eq(articlesToMedias.role, 'thumbnail')))

      await tx.delete(medias).where(eq(medias.id, articleToMedia.mediaId))
    })

    return { success: true }
  })
