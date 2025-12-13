import z from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import type { GalleryImage } from './types'
import { s3Client } from '@/lib/s3'
import { adminMiddleware } from '@/middlewares/admin'

export const galleryList = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    try {
      const folder = process.env.S3_FOLDER_NAME || 'blog'
      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: `${folder}/`,
      })

      const response = await s3Client.send(command)
      if (!response.Contents || response.Contents.length === 0) return []

      const publicBase = process.env.S3_PUBLIC_BASE_URL
      const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const

      const images: Array<GalleryImage> = response.Contents.filter(
        (obj): obj is { Key: string; Size?: number; LastModified?: Date } => {
          if (!obj.Key) return false
          const lastDotIndex = obj.Key.lastIndexOf('.')
          if (lastDotIndex === -1) return false
          const ext = obj.Key.slice(lastDotIndex + 1).toLowerCase()
          return ALLOWED_IMAGE_EXTENSIONS.includes(ext as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])
        },
      )
        .map((obj) => ({
          key: obj.Key,
          url: `${publicBase}${obj.Key}`,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ?? new Date(),
        }))
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

      return images
    } catch (error) {
      console.error('Error listing gallery images:', error)
      throw error
    }
  })

const UUID_REGEX =
  /^[a-zA-Z0-9_-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|avif)$/i

const galleryDeleteSchema = z.object({
  key: z
    .string()
    .min(1, 'Image key is required')
    .regex(UUID_REGEX, 'Invalid image key format')
    .refine((key) => !key.includes('..'), 'Invalid characters in image key'),
})

export const galleryDelete = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(galleryDeleteSchema)
  .handler(async ({ data }) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: data.key,
      })

      await s3Client.send(command)

      return { success: true }
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      throw error
    }
  })
