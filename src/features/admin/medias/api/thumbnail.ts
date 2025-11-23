import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { and, eq } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { s3Client } from '@/lib/s3'
import { db } from '@/index'
import { articlesToMedias, medias } from '@/db/schema'

const maxThumbnailSizeBytes = 5 * 1024 * 1024 // 5MB
const allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const thumbnailUploadSchema = z.object({
  contentType: z.string(),
  size: z.number().nonnegative(),
})

export const thumbnailSignedUrl = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(thumbnailUploadSchema)
  .handler(async ({ data }) => {
    if (!process.env.S3_BUCKET_NAME) {
      throw new Error('S3_BUCKET_NAME is not configured')
    }

    if (!allowedContentTypes.includes(data.contentType)) {
      throw new Error('File type not allowed')
    }

    if (data.size > maxThumbnailSizeBytes) {
      throw new Error('File is too large (max 5MB)')
    }

    const extension = data.contentType.split('/')[1] ?? 'jpg'
    const key = `${crypto.randomUUID()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: data.contentType,
      ACL: 'public-read',
    })

    // s3Client error type, but i follow the doc...
    const presigned = await getSignedUrl(s3Client as any, command, {
      expiresIn: 5 * 60,
      signableHeaders: new Set(['content-type']),
    })

    const publicBase = process.env.S3_PUBLIC_BASE_URL
    const bucketName = process.env.S3_BUCKET_NAME

    const fileUrl = `${publicBase}/${bucketName}/${key}`

    return {
      presigned,
      fileUrl,
      key,
      expiresIn: 300,
    }
  })

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
