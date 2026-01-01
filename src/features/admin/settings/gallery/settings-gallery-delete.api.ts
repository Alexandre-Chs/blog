import z from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { s3Client } from '@/lib/s3'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { medias } from '@/db/schema'

const UUID_REGEX =
  /^[a-zA-Z0-9_-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|avif)$/i

const settingsGalleryDeleteSchema = z.object({
  key: z
    .string()
    .min(1, 'Image key is required')
    .regex(UUID_REGEX, 'Invalid image key format')
    .refine((key) => !key.includes('..'), 'Invalid characters in image key'),
})

export const settingsGalleryDelete = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(settingsGalleryDeleteSchema)
  .handler(async ({ data }) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: data.key,
      })

      await s3Client.send(command)
      await db.delete(medias).where(eq(medias.key, data.key))

      return { success: true }
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      throw error
    }
  })
