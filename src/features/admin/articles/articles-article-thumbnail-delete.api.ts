import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { articlesToMedias } from '@/db/schema'

const articlesArticleThumbnailDeleteSchema = z.object({
  articleId: z.string(),
})

export const articlesArticleThumbnailDelete = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articlesArticleThumbnailDeleteSchema)
  .handler(async ({ data }) => {
    await db.transaction(async (tx) => {
      await tx
        .delete(articlesToMedias)
        .where(and(eq(articlesToMedias.articleId, data.articleId), eq(articlesToMedias.role, 'thumbnail')))
    })

    return { success: true }
  })
