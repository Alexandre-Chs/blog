import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { articlesToMedias, medias } from '@/db/schema'

const articlesArticleThumbnailCreateSchema = z.object({
  articleId: z.uuid(),
  key: z.string(),
  mimetype: z.string(),
  size: z.number().int().positive(),
  alt: z.string().default(''),
})

export const articlesArticleThumbnailCreate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleThumbnailCreateSchema)
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
